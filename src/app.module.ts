import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your_jwt_secret', // Use a strong secret and store it in environment variables
      signOptions: { expiresIn: '1d' }, // Token expiration time
    }),
    DbModule, // Import your custom database module
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule, // Load the configuration module globally
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
