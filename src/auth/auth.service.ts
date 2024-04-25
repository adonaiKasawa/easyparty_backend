import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Tokens } from './types';
import { PrivilegesEnum } from 'src/shared/enums/privilege.enum';
import * as dotenv from 'dotenv';
import { PayloadUserInterface } from 'src/shared/payload/payload.user.interface';
import { CreateUserDto, UpdateUserDto } from 'src/shared/dto/user.dto';
import { authDTO } from 'src/shared/dto/auth.dto';
import { RepositoryService } from 'src/core/repository/repository.service';
import { UserEntity } from 'src/shared/entities/user.entity';

dotenv.config();
@Injectable()
export class AuthService {
  constructor(
    private Reposiroty: RepositoryService,
    private jwtService: JwtService,
  ) { }

  async checkPrivileges(user: PayloadUserInterface) {
    if (
      user.privilege_user !== PrivilegesEnum.SAO &&
      user.privilege_user !== PrivilegesEnum.PSF
    ) {
      throw new UnauthorizedException();
    }
  }

  async signUp(user: CreateUserDto): Promise<Tokens> {
    const userCreated = await this.createUser(user);
    const userEglise = await this.Reposiroty.UserEntityRepository.findOne({ where: { id: userCreated.id } });

    const tokens = await this.getTokens(
      userCreated.id,
      userCreated.nom,
      userCreated.prenom,
      userCreated.telephone,
      userCreated.email,
      userCreated.username,
      userCreated.privilege,
      userEglise.ville,
      userEglise.pays,
      userEglise.adresse,
    );

    await this.updateRtHash(userCreated.id, tokens.refresh_token);
    // await this.sendSMS(userCreated.telephone, userEglise.email);
    return tokens;
  }

  async signIn(dto: authDTO): Promise<Tokens> {
    
    const user = await this.Reposiroty.UserEntityRepository.findOne({ where: { telephone: dto.telephone } });

    if (!user) throw new ForbiddenException('Identifiants incorrects');
    if (user.status !== 'actif')
      throw new ForbiddenException('Votre compte est bloquer');

    const tokens = await this.getTokens(
      user.id,
      user.nom,
      user.prenom,
      user.telephone,
      user.email,
      user.username,
      user.privilege,
    );
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens
  }


  async logout(userId: number) {
    return this.updateUserSetRtNull(userId);
  }

  async refreshToken(userId: number, rt: string): Promise<Tokens> {
    const user = await this.Reposiroty.UserEntityRepository.findOne({
      where: { id: userId },
      relations: ['eglise'],
    });

    if (!user) throw new ForbiddenException('Identifiants incorrects');
    if (!user.hashedRt) throw new ForbiddenException('Identifiants incorrects');
    if (!(await bcrypt.compare(rt, user.hashedRt)))
      throw new ForbiddenException('Identifiants incorrects');

    const tokens = await this.getTokens(
      user.id,
      user.nom,
      user.prenom,
      user.telephone,
      user.email,
      user.username,
      user.privilege,
    );
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await bcrypt.hash(rt, 12);
    const updateResult = this.updateUserRt(userId, hash);
  }

  async getTokens(
    id: number,
    name: string,
    prenom: string,
    telephone: string,
    email: string,
    username: string,
    privilege: string,
    ville?: string,
    pays?: string,
    adresse?: string,
  ): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          name,
          prenom,
          telephone,
          email,
          username,
          privilege_user: privilege,
          ville,
          pays,
          adresse,
        },
        {
          secret: process.env.SECRET_KEY_AT,
          expiresIn: 60 * 60 * 24 * 62,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          name,
          prenom,
          telephone,
          email,
          username,
          privilege_user: privilege,
          ville,
          pays,
          adresse,
        },
        {
          secret: process.env.SECRET_KEY_RT,
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateUserSetRtNull(id: number) {
    const updatedUser = await this.Reposiroty.UserEntityRepository.findOne({ where: { id } }); // hashedRt: Not(null) (Ajouter : where hashedRt is not null)
    updatedUser.hashedRt = null;
    return await this.Reposiroty.UserEntityRepository.update(id, updatedUser);
  }

  async updateUserRt(id: number, rt: string) {
    const updatedUser = await this.Reposiroty.UserEntityRepository.findOne({ where: { id } });
    updatedUser.hashedRt = rt;
    return await this.Reposiroty.UserEntityRepository.update(id, updatedUser);
  }

  async createUser(user: CreateUserDto): Promise<UserEntity> {
    const newUser = this.Reposiroty.UserEntityRepository.create(user);
    if (newUser.email === '') newUser.email = null;
    if (user.password) {
      newUser.salt = await bcrypt.genSalt();
      newUser.password = await bcrypt.hash(user.password, newUser.salt);
    }
    const checkTelExiste = await this.Reposiroty.UserEntityRepository.findOneBy({
      telephone: user.telephone,
    });
    if (checkTelExiste)
      throw new ConflictException('Le numéro de téléphone éxiste déjà!');
    const checkEmailExiste = await this.Reposiroty.UserEntityRepository.findOneBy({
      email: user.email,
    });
    if (checkEmailExiste)
      throw new ConflictException(`L'adresse email éxiste déjà!`);
    try {
      return this.Reposiroty.UserEntityRepository.save(newUser);
    } catch (error) {
      console.log(error);
      throw new NotFoundException();
    }
  }

  async findUserByTel(telephone: string): Promise<UserEntity> {
    try {
      return await this.Reposiroty.UserEntityRepository.findOneByOrFail({ telephone });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findUserById(id: number): Promise<UserEntity> {
    try {
      return await this.Reposiroty.UserEntityRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findAllUserByPrivilege(privilege: PrivilegesEnum): Promise<UserEntity[]>{
    return await this.Reposiroty.UserEntityRepository.find({
      where: {privilege}
    })
  }

  async updateUser(updateUserDto: UpdateUserDto, id: number): Promise<Tokens> {
    const update = await this.Reposiroty.UserEntityRepository.preload({
      id,
      ...updateUserDto,
    });
    
    if (updateUserDto.password) {
      update.password = await bcrypt.hash(updateUserDto.password, update.salt);
    }

    if (updateUserDto.email) {
      const checkEmailExiste = await this.Reposiroty.UserEntityRepository.findOneBy({ email: updateUserDto.email });
      if (checkEmailExiste) {
        if (checkEmailExiste.id !== id) {
          throw new ConflictException(`L'adresse email existe déjà`)
        }
      }
    }

    if (updateUserDto.telephone) {
      const checkTelExiste = await this.Reposiroty.UserEntityRepository.findOneBy({ telephone: updateUserDto.telephone });
      if (checkTelExiste) {
        if (checkTelExiste.id !== id) {
          throw new ConflictException(`Le numéro de téléphone existe déjà.`)
        }
      }
    }

    try {
      const save = await this.Reposiroty.UserEntityRepository.save(update);
      const user = await this.Reposiroty.UserEntityRepository.findOne({ where: { id: save.id }, });
      const tokens = await this.getTokens(
        user.id,
        user.nom,
        user.prenom,
        user.telephone,
        user.email,
        user.username,
        user.privilege,
        user.ville,
        user.pays,
        user.adresse,
      );
      console.log(tokens);


      await this.updateRtHash(save.id, tokens.refresh_token);
      return tokens;
    } catch (error) {
      console.log(error);
      throw new NotFoundException(error.messsage);
    }
  }

  generateString(length: number = 6) {
    const caracteresPermis = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ'; // Chiffres de 1 à 9 et lettres majuscules sans 'O'

    let chaine = '';
    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * caracteresPermis.length);
      chaine += caracteresPermis[index];
    }
    return chaine;
  }

}
