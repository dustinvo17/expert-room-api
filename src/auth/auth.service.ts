import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);
        const valid = await bcrypt.compare(pass, user.password)
        if (valid) {
            return {
                userId: user.id,
                username
            }

        }
        else {
            return null
        }

    }
    async registerUser(username: string, pass: string, name: string) {
        const user = await this.usersService.findByUsername(username);
        if (user) {
            // return user exist
            throw new ConflictException()


        }
        else {
            // create new user 
            const newUser = await this.usersService.addUser(username, pass, name)
            const payload = { username: newUser.username, sub: newUser.id }
            return {
                // eslint-disable-next-line @typescript-eslint/camelcase
                access_token: this.jwtService.sign(payload)
            }


        }
    }
    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            // eslint-disable-next-line @typescript-eslint/camelcase
            access_token: this.jwtService.sign(payload),
        };
    }
}
