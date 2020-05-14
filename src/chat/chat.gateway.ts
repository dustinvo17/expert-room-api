import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import {MessageService} from '../message/message.service'
import {ChatDataModel} from './chatdata.model'
import {Injectable} from '@nestjs/common'
import { SocketService } from '../socket/socket.service';
@Injectable()
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly jwtServ: JwtService,private readonly msgService: MessageService,private socketService: SocketService){}
    
    @WebSocketServer() public server: Server
    users = 0;
    afterInit(server: Server) {
        this.socketService.server = server;
      }
    async handleConnection(client: Socket){
    
        
        
        console.log('connect')
        // A client has connected
        this.users++;

        // Notify connected clients of current users
        this.server.emit('users', this.users);

    }

    async handleDisconnect(){

        // A client has disconnected
        this.users--;

        // Notify connected clients of current users
        this.server.emit('users', this.users);

    }
    @SubscribeMessage('chat')
    async onChat(client: Socket, data: ChatDataModel){
        try {
            const user = await this.jwtServ.verify(client.handshake.query.access_token)
            if(user){
                const {message,conversationId} = data
                const userId = user.sub
                try {
                    const msg = await this.msgService.create(message,userId,conversationId)
             
                    this.server.emit('chat',msg)
                }catch(err){
                    throw err
                }
            }
     
        }catch(err){
            throw err 
           
        }
     
        
     
     
        
    }
   
 
}