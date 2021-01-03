import { Controller, Request, Post, UseGuards , Get, BadRequestException, Put, Delete} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {UsersService} from './users.service'
import {UploadFileService} from '../conversation/aws.service'
import {UseInterceptors, UploadedFile} from '@nestjs/common'
import {FileInterceptor} from '@nestjs/platform-express'
@Controller('/users')
export class UserController {
  constructor(private usersService: UsersService, private uploadService: UploadFileService) {}
    @UseGuards(AuthGuard('jwt'))
    @Get('/search')
    async searchFriend(@Request() req){
        const {name} = (req.query)
        const {userId} = req.user
        const users =  await this.usersService.findByName(name,userId)
        return users
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('')
    async updateProfile(@Request() req) {
        if(req.body.name.length  && req.body.job) {
            const name = req.body.name
            const userId = req.user.userId
            const job = req.body.job
            return await this.usersService.uploadProfile(userId,name,job)
        }
        else {
            throw new BadRequestException()
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @UseInterceptors(FileInterceptor('file')) 
    async updateImageFile(@UploadedFile() file,@Request() req) {
        const defaultImg = 'user-default123.png'
        const userId = req.user.userId
        const user = await this.usersService.findUserById(userId)
        if(user.img !== defaultImg) {
            const res = await this.uploadService.deleteFile(`${user.img}`)
            console.log(res)
        }
        const imgUrl = await this.uploadService.uploadFile(file, user.id)
        const userUpdated = await this.usersService.userUploadProfile(user.id,imgUrl)
        return userUpdated
    }


    @UseGuards(AuthGuard('jwt'))
    @Post('/friend')
    async addFriend(@Request() req) {
        const adderId = req.user.userId
        const recieverId = req.body.userId
       if(adderId && recieverId ) {
        return await this.usersService.addFriend(adderId,recieverId)
       }
       else {
           throw new BadRequestException()
       }
    
   

    }
    @UseGuards(AuthGuard('jwt'))
    @Put('/friend')
    async acceptFriend(@Request() req) {
        const adderId = req.body.userId
        const recieverId = req.user.userId
        return await this.usersService.acceptFriend(adderId,recieverId)

    }
    @UseGuards(AuthGuard('jwt'))
    @Delete('/friend')
    async denydFriend(@Request() req ){
        const adderId = req.body.userID
        const recieverId = req.user.userId
        if(req.body.pullBack === true ){ // pullback is user sent add friend request but later cancel
            return  await this.usersService.denyFriend(adderId,recieverId,true)
        }
        return await this.usersService.denyFriend(adderId,recieverId)
    }

  // @Get()
  // testUser(){
  //   return this.usersService.addUser('dustinvo','dustin123')
  // }
}