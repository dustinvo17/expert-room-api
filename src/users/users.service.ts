import { Model } from 'mongoose'
import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { UserModel } from './users.model'
import { FriendModel } from '../friend/friend.model'
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt'
//'add friend' 0,
//'requested' 1,
//'pending' 2,
//'friends 3'
@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private userModel: Model<UserModel>, @InjectModel('Friend') private friendModel: Model<FriendModel>) {

    }

    async findByUsername(username: string) {


        return await this.userModel.findOne({ username })
    }

    async findByName(name: string, userId: string) { // search functions
        const user = await this.findUserById(userId)
        const results = await this.userModel.find({ "name": { "$regex": name, "$options": "i" }, _id: { $ne: user._id } }).select('-password')
        return results
    }

    async findUserById(id: string) {
        return await this.userModel.findById(id).populate({
            path: "friends", populate: {
                path: "recipient requester",
                select: "-password"
            }
        }).select('-password')
    }
    async addUser(username: string, pass: string, name) {
        const passwordHash = bcrypt.hashSync(pass, 1);
        const newUser = new this.userModel({
            username,
            password: passwordHash,
            name

        })

        return await newUser.save()
    }

    async addFriend(adderId: string, recieverId: string) {
        const adder = await this.findUserById(adderId)
        const reciever = await this.findUserById(recieverId)
        const existRelationship = await this.friendModel.findOne({ requester: adder._id, recipient: reciever._id })
        if (existRelationship) { // check if users are already friends

            throw new BadRequestException('Relationship already exist')
        }
        else {
            try {
                const docA = new this.friendModel({ status: 1, requester: adder._id, recipient: reciever._id })
                const docB = new this.friendModel({ status: 2, requester: reciever._id, recipient: adder._id })
                adder.friends.push(docA)
                reciever.friends.push(docB)

                await docA.save()
                await docB.save()
                await reciever.save()
                await adder.save()
                return this.friendModel.find({ '_id': { $in: adder.friends } }).populate({ path: 'requester', select: '-password' }).populate({ path: 'recipient', select: '-password' }).exec()
            } catch (err) {
                console.log(err)
                throw new BadRequestException(err)
            }
        }
        // generate relationship




    }
    async acceptFriend(adderId: string, recieverId: string) {
        try {
            const adder = await this.findUserById(adderId)
            const reciever = await this.findUserById(recieverId)
            const adderDoc = await this.friendModel.findOne({ requester: adder._id, recipient: reciever._id })
            const recieverDoc = await this.friendModel.findOne({ requester: reciever._id, recipient: adder._id })

            adderDoc.status = 3
            recieverDoc.status = 3

            await adderDoc.save()
            await recieverDoc.save()
            const friendDocs = await this.friendModel.find({ '_id': { $in: reciever.friends } }).populate({ path: 'requester', select: '-password' }).populate({ path: 'recipient', select: '-password' }).exec() // return all friends of this user
            return friendDocs


        } catch (err) {
            throw new BadRequestException(err)
        }


    }
    async denyFriend(adderId: string, recieverId: string, pullBack = false) {
        try {
            let docA: FriendModel;
            let docB: FriendModel;
            const adder = await this.findUserById(adderId)
            const reciever = await this.findUserById(recieverId)
            if (pullBack === true) {
                docA = await this.friendModel.findOne({ recipient: adder._id, requester: reciever._id })
                docB = await this.friendModel.findOne({ recipient: reciever._id, requester: adder._id })
                await adder.update({ $pull: { friends: docB._id } })
                await reciever.update({ $pull: { friends: docA._id } })
            }
            
            else {
                docA = await this.friendModel.findOne({ recipient: reciever._id, requester: adder._id })
                docB = await this.friendModel.findOne({ recipient: adder._id, requester: reciever._id })
                await adder.update({ $pull: { friends: docA._id } })
                await reciever.update({ $pull: { friends: docB._id } })
            }


            await this.friendModel.findOneAndDelete({ _id: docA._id })
            await this.friendModel.findOneAndDelete({ _id: docB._id })
            await adder.save()
            await reciever.save()
            if (pullBack === true) {
                return await this.friendModel.find({ '_id': { $in: reciever.friends } }).populate({ path: 'requester', select: '-password' }).populate({ path: 'recipient', select: '-password' }).exec()

            }
            return await this.friendModel.find({ '_id': { $in: adder.friends } }).populate({ path: 'requester', select: '-password' }).populate({ path: 'recipient', select: '-password' }).exec()
        } catch (err) {
            throw new BadRequestException(err)
        }


    }
    async userUploadProfile(userId: string, imgPath: string) {
        try {
            const user = await this.findUserById(userId)
            user.img = imgPath
            await user.save()
            return user

        } catch (err) {
            throw new BadRequestException(err)
        }

    }
    async uploadProfile(userId: string, name: string, job: string) {
        try {
            const user = await this.findUserById(userId)
            user.name = name
            user.job = job

            await user.save()
            return user
        } catch (err) {
            throw new BadRequestException(err)
        }
    }
}
