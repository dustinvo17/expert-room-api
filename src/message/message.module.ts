import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageService } from './message.service';
import { MessageSchema } from './message.model';
import { UsersModule} from '../users/users.module'
import {ConversationModule} from '../conversation/conversation.module'

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),UsersModule,ConversationModule],
    providers: [MessageService],
    exports:[MessageService,MongooseModule]
  })
  export class MessageModule {}