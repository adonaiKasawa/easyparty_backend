import {
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Tokens } from './types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { authDTO, authUserDTO } from 'src/shared/dto/auth.dto';
import { CreateUserDto, UpdateUserDto } from 'src/shared/dto/user.dto';
import { PrivilegesEnum } from 'src/shared/enums/privilege.enum';
import { User } from './user/user.decorators';
import { PayloadUserInterface } from 'src/shared/payload/payload.user.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authservice: AuthService
  ) { }

  @Post('/signin')
  async signIn(@Body() auth: authDTO) {
    return await this.authservice.signIn(auth);
  }

  @Post('/signup')
  async signUp(@Body() signupDTO: CreateUserDto) {
    return await this.authservice.signUp(signupDTO);
  }

  @Get('/findUserByPrivilege/:type')
  async findAllUserByPrivilege(
    @Param('type') type: PrivilegesEnum
  ) {
    return await this.authservice.findAllUserByPrivilege(type);
  }

  @Get('/findUserById/:id')
  async findByUserId(
    @Param('id', ParseIntPipe) id: number
  ) {
    return await this.authservice.findUserById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`/:id`)
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() dto: UpdateUserDto,
    @Param("id", ParseIntPipe) id: number,
    @User() user: PayloadUserInterface
  ) {
    return await this.authservice.updateUser(dto, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Request() req) {
    const user = req.user;
    return this.authservice.logout(user['sub']);
  }

  //Refresh tokens
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Request() req): Promise<Tokens> {
    const user = req.user;
    return this.authservice.refreshToken(user['sub'], user['refreshToken']);
  }



}
