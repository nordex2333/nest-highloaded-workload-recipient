import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AggregationModule } from '../aggregation/aggregation.module';
import { PayoutModule } from '../payout/payout.module';
import { AppController } from './app.controller';
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
        synchronize: false,
        migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
        migrationsRun: configService.get<boolean>('RUN_MIGRATIONS') || false,
      }),
    }),
    AggregationModule,
    PayoutModule,
    TransactionApiModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}