import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendSchema} from './friend.model'

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Friend', schema: FriendSchema}])],
    exports: [MongooseModule]
  })
  export class FriendModule {}