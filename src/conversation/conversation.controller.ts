import { Controller, Request, Post, UseGuards , Get, BadRequestException, Put, Delete} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {ConversationService} from './conversation.service'
import {UploadFileService} from './aws.service'
import {MessageService} from '../message/message.service'
import {UseInterceptors, UploadedFile} from '@nestjs/common'
import {FileInterceptor} from '@nestjs/platform-express'
import {SocketService} from '../socket/socket.service'
@Controller('/chat')
export class ConversationController {
    constructor(private conversationService: ConversationService , private uploadFileService: UploadFileService, private msgService: MessageService,private socketService: SocketService) {}
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async initConversation(@Request() req) {
        const starterId = req.user.userId
        const parterId = req.body.userID 
    
        return await this.conversationService.initConversation(starterId,parterId)
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('/conversation')
    async getConversation(@Request() req) {

        return await this.conversationService.findConversationsByUser(req.user.userId)
    }
    @UseGuards(AuthGuard('jwt'))
    @Post('/message/')
    @UseInterceptors(FileInterceptor('file'))
    async handImageUpload(@UploadedFile() file,@Request() req){
        const userId = req.user.userId
        const conversationId = req.query.conversationId
        const filePath = await this.uploadFileService.uploadFile(file,userId)
        const newMsg = await this.msgService.create(filePath,userId,conversationId,true) // filePath,userId,conversationId, isImage
        this.socketService.server.emit('chat',newMsg)   
        // console.log(file)
        // console.log(await this.uploadFileService.uploadFile(file))
        // return await this.uploadFileService.uploadFile(file)
    }
    
}