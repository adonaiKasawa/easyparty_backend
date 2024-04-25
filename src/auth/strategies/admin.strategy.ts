import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { AbonnementService } from 'src/core/abonnement/abonnement.service';
// import { EgliseEntity } from 'src/shared/entities/eglise.entity';
import { UserEntity } from 'src/shared/entities/user.entity';
import { PrivilegesEnum } from 'src/shared/enums/privilege.enum';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import { PayloadUserInterface } from 'src/shared/payload/payload.user.interface';
import { RepositoryService } from 'src/core/repository/repository.service';

type JwtPayload = {
  sub: string;
  email: string;
};

dotenv.config()

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(
    private Repository: RepositoryService
    // private abonnementService: AbonnementService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY_AT,
    });
  }

  validate(payload: PayloadUserInterface) {
    if (payload.privilege_user === PrivilegesEnum.PSF) {
      if (payload) {
        // const find = this.egliseRepository.findOneBy({
        //   id_eglise: payload.eglise.id_eglise,
        // });
        // if (find) 
        return payload;
        // else return new NotFoundException();
      } else {
        return new UnauthorizedException('admin');
      }
    } else {
      // console.log(payload);
      return new UnauthorizedException("l'admin n'est pas correct");
    }
  }
}
