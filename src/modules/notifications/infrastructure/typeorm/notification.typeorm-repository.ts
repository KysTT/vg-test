import { Repository } from 'typeorm';
import {
  Notification,
  NotificationRepository,
} from '../../domain/notification.entity';
import { NotificationOrmEntity } from './notification.orm-entity';

export class TypeOrmNotificationRepository implements NotificationRepository {
  constructor(private readonly ormRepo: Repository<NotificationOrmEntity>) {}

  private static readonly toDomain = (
    row: NotificationOrmEntity,
  ): Notification => {
    return new Notification({
      id: row.id,
      title: row.title,
      message: row.message,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  };

  async save(notification: Notification): Promise<Notification> {
    const entity = this.ormRepo.create({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      status: notification.status,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    });
    const saved = await this.ormRepo.save(entity);
    return TypeOrmNotificationRepository.toDomain(saved);
  }

  async findAll(): Promise<Notification[]> {
    const rows = await this.ormRepo.find({ order: { createdAt: 'DESC' } });
    return rows.map(TypeOrmNotificationRepository.toDomain);
  }
}
