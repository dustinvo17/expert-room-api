import {Model} from 'mongoose'
import {Injectable,  InternalServerErrorException} from '@nestjs/common'
import {ConversationModel} from './conversation.model'
import {MessageModel} from '../message/message.model'
import { InjectModel } from '@nestjs/mongoose'
import {UsersService} from '../users/users.service'
import { UserModel } from 'src/users/users.model'

@Injectable()
export class ConversationService {
    constructor(@InjectModel('Conversation') private conversationModel: Model<ConversationModel>,private usersService: UsersService,@InjectModel('Message') private msgModel: Model<MessageModel>){

    }
    async initConversation(starterId: string, partnerId: string) {
        const starter = await this.usersService.findUserById(starterId)
        const partner = await this.usersService.findUserById(partnerId)
    
        const existConversation = await this.findConversation(starter, partner)
        if(existConversation){
           return existConversation._id
       
        }
        const newConversation = new this.conversationModel()
        newConversation.members.push(starter)
        newConversation.members.push(partner)
        starter.conversations.push(newConversation)
        partner.conversations.push(newConversation)
        try {
        
            await starter.save()
            await partner.save()
            await newConversation.save()
            return await this.conversationModel.find({'_id':{
                $in:starter.conversations
            }}).sort({createdAt:-1}).populate({path:'messages' ,option:{sort:{createdAt:-1}}, populate:{path:'user',select:('_id img name')}}).populate({path:'members',select:'name img'}).exec()
       
        }catch(err){
            throw new InternalServerErrorException(err)
        }
    
    }

    async findConversation(starter:UserModel, partner: UserModel) {
        return await this.conversationModel.findOne({$or: [{"members":[starter._id,partner._id]} , {"members":[partner._id,starter._id]}] })
    }
    async findConversationsByUser(userId: string) {
        const user = await this.usersService.findUserById(userId)

        const conversations = await this.conversationModel.find({'_id':{
            $in:user.conversations
        }}).sort({createdAt:-1}).populate({path:'messages' ,option:{sort:{createdAt:-1}}, populate:{path:'user',select:('_id img name')}}).populate({path:'members',select:'name img'}).exec()
        return conversations
      

        // const latestMsg = await this.msgModel.findById(messagesIds[-1])
        // console.log(latestMsg)
        
    }
    async findConversationbyId(conversationId: string) {
        return await this.conversationModel.findById(conversationId)
    }

   
}