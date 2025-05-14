import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'database.sqlite',
    entities:  [User],
    synchronize: true,
    logging: true,
    migrations: ["src/database/migration/*.ts"]
  }), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
