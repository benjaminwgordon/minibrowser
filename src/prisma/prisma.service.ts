import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
  logger = new Logger(PrismaService.name);

  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get("DB_CONNECTION_STRING"),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();

    console.log(this.config);

    console.log(
      `Connected to database at: ${process.env.DB_CONNECTION_STRING}`
    );

    this.$on("query" as any, async (e: any) => {
      this.logger.debug(`(${e.duration}ms) ${e.query}`);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }
}
