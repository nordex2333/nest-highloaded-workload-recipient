import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AggregationModule } from '../aggregation/aggregation.module';
import { PayoutsModule } from '../payouts/payouts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionApiModule } from '../transaction-api/transaction-api.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get<string>('DATABASE_URL'),
        database: configService.get<string>('MONGO_DATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    AggregationModule,
    PayoutsModule,
    TransactionApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}