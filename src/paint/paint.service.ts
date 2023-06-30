import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Paint, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PaintService {
  constructor(private prisma: PrismaService) {}
  // Paints represent a static resource that users cannot upload or modify.
  // This is done to prevent future copyright issues, and should not be changed without reason
  async findAll(): Promise<Paint[]> {
    try {
      const paintList: Paint[] = await this.prisma.paint.findMany({});
      return paintList;
    } catch (err) {
      console.log(`Failed to fetch paints from Postgres: ${err}`);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number): Promise<Paint> {
    try {
      const paintList: Paint = await this.prisma.paint.findUniqueOrThrow({
        where: {
          id,
        },
      });
      return paintList;
    } catch (err) {
      if (err instanceof Prisma.NotFoundError) {
        // no paint exists with supplied code
        throw new NotFoundException();
      } else {
        console.log(`Failed to fetch paints from Postgres: ${err}`);
        throw new InternalServerErrorException();
      }
    }
  }
}
