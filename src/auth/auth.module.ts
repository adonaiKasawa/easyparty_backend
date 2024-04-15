/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/shared/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AdminStrategy, AtStrategy, RtStrategy } from './strategies';
import * as dotenv from 'dotenv';
import { RepositoryModule } from 'src/core/repository/repository.module';

dotenv.config();
@Module({
  imports: [
    JwtModule.register({}),
    RepositoryModule
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, AdminStrategy],
  exports: [AuthService]
})
export class AuthModule { }
