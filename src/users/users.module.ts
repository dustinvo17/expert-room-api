import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';

import {UserSchema} from  './users.model'
import {FriendModule} from '../friend/friend.module'
import {UserController} from './users.controller'
import {UploadFileService} from '../conversation/aws.service'


@Module({
  providers: [UsersService,UploadFileService],
  imports:[MongooseModule.forFeature([{ name: 'User', schema: UserSchema}]),FriendModule],
  exports: [UsersService], 
  controllers: [UserController],
})
export class UsersModule {}





// @Module({
//     imports: [MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }])],
//     controllers: [MessageController],
//     providers: [MessageService],
//   })
//   export class MessageModule {}