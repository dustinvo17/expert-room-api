import { Model, Document, Schema } from 'mongoose';
import {UserModel} from '../users/users.model'
import {ConversationModel} from '../conversation/conversation.model'
import * as mongoose from 'mongoose';
interface Message {
    body: string,
    user: UserModel,
    owner: ConversationModel,
    status: number
}
export interface MessageModel extends Message, Document{}

export const MessageSchema = new mongoose.Schema({
    body: {type: String, required: true},
    status: {
        type: Number,
        enums: [
            0,    //'normal text',
            1,    //'images',
        ],
        default:0
    },

    owner: {
        type:Schema.Types.ObjectId,
        ref: "Conversation"
    },
    user: {
        type:Schema.Types.ObjectId,
        ref: "User"
    }
  }, { timestamps: true });


