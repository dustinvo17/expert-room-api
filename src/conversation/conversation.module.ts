import { Module, forwardRef,} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {ConversationSchema} from './conversation.model'
import {UsersModule} from '../users/users.module'
import {MessageModule} from '../message/message.module'
import {UploadFileService} from './aws.service'
import {ConversationService} from './conversation.service'
import {ConversationController} from './conversation.controller'

import  {ChatGateway} from '../chat/chat.gateway'


@Module({
    imports: [MongooseModule.forFeature([{ name: 'Conversation', schema: ConversationSchema}]), UsersModule,forwardRef(() => MessageModule) ],
    controllers:[ConversationController],
    providers:[ConversationService ,UploadFileService],
    exports:[ConversationService],
   
  })
  export class ConversationModule {}