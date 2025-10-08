import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateNotificationUseCase } from '../application/create-notification.usecase';
import { ListNotificationsUseCase } from '../application/list-notifications.usecase';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NatsNotificationsPublisher } from '../infrastructure/nats/nats.publisher';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly createUseCase: CreateNotificationUseCase,
    private readonly listUseCase: ListNotificationsUseCase,
    private readonly publisher: NatsNotificationsPublisher,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() dto: CreateNotificationDto) {
    const created = await this.createUseCase.execute(dto);
    await this.publisher.publishCreated(created);
    return created;
  }

  @Get()
  async list() {
    return await this.listUseCase.execute();
  }
}
