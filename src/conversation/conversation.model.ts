import { Model, Document , Schema} from 'mongoose';
import {MessageModel} from '../message/message.model'
import {UserModel} from '../users/users.model'
import * as mongoose from 'mongoose';
interface Conversation {
    messages: MessageModel[],
    members: UserModel[]
}
export interface ConversationModel extends Conversation, Document{}

export const ConversationSchema = new mongoose.Schema({
  messages: [
      {
        type:Schema.Types.ObjectId,
        ref: 'Message'
      }
  ],
  members: [
    {
        type:Schema.Types.ObjectId,
        ref: 'User'
      }
  ]
}, { timestamps: true });


