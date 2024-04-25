import { Injectable, UnauthorizedException } from '@nestjs/common';
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
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
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
    // console.log(payload);
    if (payload.privilege_user === PrivilegesEnum.PSF) {
      if (payload) {
        // const find = this.abonnementService.findOneByEgliseId(
        //   payload.eglise.id_eglise,
        // );
        // if (!find)
        // throw new UnauthorizedException(`Vous n'avez pas d'abonnement.`);
        return payload;
      } else {
        throw new UnauthorizedException(`Vous n'avez pas d'eglise.`);
      }
    } else {
      return payload;
    }
  }
}
