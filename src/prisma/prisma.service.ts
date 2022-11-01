import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    console.log({
      db_status: `Dialing database at: postgresql://minibrowser-db:saucy-emu@localhost/cloudsql/rosy-petal-365623:us-central1:minibrowser-db/.s.PGSQL.5432`,
    });
    super({
      datasources: {
        db: {
          url: 'postgresql://minibrowser-db:saucy-emu@localhost/postgres?host=/cloudsql/rosy-petal-365623:us-central1:minibrowser-db',
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
