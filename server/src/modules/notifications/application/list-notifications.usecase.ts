import {
  Notification,
  NotificationRepository,
} from '../domain/notification.entity';

export class ListNotificationsUseCase {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(): Promise<Notification[]> {
    return await this.repository.findAll();
  }
}
