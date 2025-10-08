export enum NotificationStatus {
  Pending = 'pending',
  Processed = 'processed',
  Failed = 'failed',
}

export interface NotificationProps {
  id?: string;
  title: string;
  message: string;
  status?: NotificationStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Notification {
  public readonly id?: string;
  public readonly title: string;
  public readonly message: string;
  public status: NotificationStatus;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: NotificationProps) {
    this.id = props.id;
    this.title = props.title;
    this.message = props.message;
    this.status = props.status ?? NotificationStatus.Pending;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}

export interface NotificationRepository {
  save(notification: Notification): Promise<Notification>;
  findAll(): Promise<Notification[]>;
}
