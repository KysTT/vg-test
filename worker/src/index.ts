import { connect, StringCodec, NatsConnection, Subscription } from 'nats';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

interface NotificationCreatedEvent {
  id: string;
  title: string;
  message: string;
  status: string;
  createdAt: string;
}

class NotificationWorker {
  private natsConnection: NatsConnection | undefined;
  private dbClient: Client;

  constructor() {
    this.dbClient = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'notifications',
    });
  }

  async start() {
    try {
      this.natsConnection = await connect({
        servers: process.env.NATS_URL || 'nats://localhost:4222',
      });
      console.log('Connected to NATS');

      await this.dbClient.connect();
      console.log('Connected to database');

      const subscription: Subscription = this.natsConnection.subscribe(
        'notification.created',
      );

      console.log('Worker started, listening for notifications...');

      const sc = StringCodec();
      for await (const msg of subscription) {
        try {
          const raw = sc.decode(msg.data);
          console.log('raw', raw)
          const data = JSON.parse(raw).data as NotificationCreatedEvent;
          console.log('Received event notification.created:', data);

          if (!data.id) {
            console.warn('Skipping message without id');
            continue;
          }

          await this.processNotification(data);
        } catch (error) {
          console.error('Error processing notification message:', error);
        }
      }
    } catch (error) {
      console.error('Worker startup error:', error);
      process.exit(1);
    }
  }

  private async processNotification(event: NotificationCreatedEvent) {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const processingTime = 2000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, processingTime));

        // симулируем ошибку
        if (Math.random() < 0.5) {
          retryCount = 4;
          throw new Error('Simulated processing failure');
        }

        await this.updateNotificationStatus(event.id, 'processed');
        console.log(`Notification ${event.id} processed successfully`);
        return;

      } catch (error) {
        retryCount++;
        console.error(`Attempt ${retryCount} failed for notification ${event.id}:`, error);

        if (retryCount >= maxRetries) {
          await this.updateNotificationStatus(event.id, 'failed');
          console.error(`Notification ${event.id} failed after ${maxRetries} attempts`);
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
    }
  }

  private async updateNotificationStatus(id: string, status: string) {
    const query = `
      UPDATE notifications
      SET status = $1, "updatedAt" = NOW()
      WHERE id = $2
    `;
    try {
      const res = await this.dbClient.query(query, [status, id]);
      if (res.rowCount === 0) {
        console.warn(`No notification found with id ${id} to update.`);
      }
    } catch (e) {
      console.error('Failed to update notification status:', e);
    }
  }

  async stop() {
    if (this.natsConnection) {
      await this.natsConnection.close();
    }
    if (this.dbClient) {
      await this.dbClient.end();
    }
  }
}

// graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down worker...');
  await worker.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down worker...');
  await worker.stop();
  process.exit(0);
});

const worker = new NotificationWorker();
worker.start().catch(console.error);
