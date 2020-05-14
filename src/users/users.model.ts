import { Model, Document, Schema } from 'mongoose';
import {ConversationModel} from '../conversation/conversation.model'
import {FriendModel} from '../friend/friend.model'
import * as mongoose from 'mongoose';
interface User {
    username:string,
    name:string,
    job:string,
    img:string,
    password: string,
    conversations:ConversationModel[],
    friends:FriendModel[]


}

export interface UserModel extends User, Document{}


export const UserSchema  = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    name:{type: String},
    img:{type: String, default:'user-default123.png'},
    job:{type: String},
    conversations: [{
        type:Schema.Types.ObjectId,
        ref: "Conversation"
    }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'Friend'}]

  });





