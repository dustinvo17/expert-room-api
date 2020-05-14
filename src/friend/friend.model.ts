import { Model, Document, Schema } from 'mongoose';
import {UserModel} from '../users/users.model'
import * as mongoose from 'mongoose';
interface Friend {
    status: number,
    requester:UserModel,
    recipient:UserModel
}

export interface FriendModel extends Friend, Document{}
export const FriendSchema = new Schema({
    requester: { type: Schema.Types.ObjectId, ref: 'User'},
    recipient: { type: Schema.Types.ObjectId, ref: 'User'},
    status: {
      type: Number,
      enums: [
          0,    //'add friend',
          1,    //'requested',
          2,    //'pending',
          3,    //'friends'
      ]
    }
  }, {timestamps: true})

  



