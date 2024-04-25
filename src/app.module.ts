import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './shared/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ReservationModule } from './core/reservation/reservation.module';
import { RepositoryModule } from './core/repository/repository.module';
import { RoomsModule } from './core/rooms/rooms.module';
import { TarifModule } from './core/tarif/tarif.module';
import { PaiementModule } from './core/paiement/paiement.module';
import { ServicesModule } from './core/services/services.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    ReservationModule,
    RepositoryModule,
    RoomsModule,
    TarifModule,
    PaiementModule,
    ServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
