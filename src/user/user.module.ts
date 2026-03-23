import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { OneNigeriaUser } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import jwtConfig from '../../iam/login/config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([OneNigeriaUser]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
