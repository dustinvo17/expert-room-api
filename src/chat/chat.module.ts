import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/auth.constants';
import { MessageModule} from '../message/message.module'

@Module({ 
    providers: [ ChatGateway ],
    imports:[
        JwtModule.register({
            secret: jwtConstants.secret,
          }),
        MessageModule
    ],
    exports:[ChatGateway]
  
})
export class ChatModule {}
