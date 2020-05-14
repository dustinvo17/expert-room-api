import { Module ,forwardRef} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {MessageModule} from './message/message.module'
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { ConversationModule} from './conversation/conversation.module'
import { UsersModule } from './users/users.module';
@Module({
  imports: [MongooseModule.forRoot(`mongodb+srv://${process.env.MONGO_CONFIG}@cluster0-2i7tz.mongodb.net/chat-app?retryWrites=true&w=majority`),forwardRef(() => MessageModule), ChatModule, AuthModule, UsersModule,ConversationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
