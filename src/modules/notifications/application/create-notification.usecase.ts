import {
  Notification,
  NotificationRepository,
} from '../domain/notification.entity';

export interface CreateNotificationInput {
  title: string;
  message: string;
}

export class CreateNotificationUseCase {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(input: CreateNotificationInput): Promise<Notification> {
    const notification = new Notification({
      title: input.title,
      message: input.message,
    });
    return await this.repository.save(notification);
  }
}
