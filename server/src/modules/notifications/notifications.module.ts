import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationOrmEntity } from './infrastructure/typeorm/notification.orm-entity';
import { NotificationsController } from './presentation/notifications.controller';
import { CreateNotificationUseCase } from './application/create-notification.usecase';
import { ListNotificationsUseCase } from './application/list-notifications.usecase';
import { TypeOrmNotificationRepository } from './infrastructure/typeorm/notification.typeorm-repository';
import { NatsNotificationsPublisher } from './infrastructure/nats/nats.publisher';
import { Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationOrmEntity]),
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'NATS_CLIENT',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [config.get<string>('NATS_URL', 'nats://localhost:4222')],
          },
        }),
      },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [
    {
      provide: CreateNotificationUseCase,
      useFactory: (repo: TypeOrmNotificationRepository) =>
        new CreateNotificationUseCase(repo),
      inject: [TypeOrmNotificationRepository],
    },
    {
      provide: ListNotificationsUseCase,
      useFactory: (repo: TypeOrmNotificationRepository) =>
        new ListNotificationsUseCase(repo),
      inject: [TypeOrmNotificationRepository],
    },
    {
      provide: TypeOrmNotificationRepository,
      useFactory: (ormRepo: Repository<NotificationOrmEntity>) =>
        new TypeOrmNotificationRepository(ormRepo),
      inject: [getRepositoryToken(NotificationOrmEntity)],
    },
    {
      provide: NatsNotificationsPublisher,
      useFactory: (client: ClientProxy) =>
        new NatsNotificationsPublisher(client),
      inject: ['NATS_CLIENT'],
    },
  ],
})
export class NotificationsModule {}
