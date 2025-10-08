import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Notification } from '../../domain/notification.entity';

export class NatsNotificationsPublisher {
  constructor(private readonly client: ClientProxy) {}

  async publishCreated(notification: Notification): Promise<void> {
    await lastValueFrom(
      this.client.emit('notification.created', {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        status: notification.status,
        createdAt: notification.createdAt.toISOString(),
      }),
    );
  }
}
