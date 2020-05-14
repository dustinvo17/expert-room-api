import {Model} from 'mongoose'
import {Injectable, BadRequestException, BadGatewayException} from '@nestjs/common'
import {MessageModel} from './message.model'
import { InjectModel } from '@nestjs/mongoose'
import {UsersService} from '../users/users.service'
import {ConversationService} from '../conversation/conversation.service'
@Injectable()
export class MessageService {
    constructor(@InjectModel('Message') private messageModel: Model<MessageModel>,private readonly userSerivce: UsersService,
    private readonly conversationService: ConversationService){

    }

    async create(message: string, userId: string,conversationId: string,image = false) {
        const user = await this.userSerivce.findUserById(userId)
        const conversation = await this.conversationService.findConversationbyId(conversationId)
        if(user && conversation){
            const newMessage = new this.messageModel({body:message, user:user._id, owner: conversation._id})
            conversation.messages.push(newMessage)
            if(image === true){
                newMessage.status = 1
            }
            try {
                conversation.save()
                await newMessage.save()
                return await this.messageModel.findById(newMessage._id).populate({path:'user',select:'_id img'})
            }catch(err){
                throw new BadRequestException(err)
            }
       
        }
        else {
            throw new BadGatewayException("Can't init new message, invalid user")
        }
       
    }
}