import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, Technique } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TechniqueService {
  constructor(private prisma: PrismaService) {}
  // Techniques represent a static resource that users cannot upload or modify.
  // This is subject to change in the future if there is demand for user-uploaded techniques
  async findAll(): Promise<Technique[]> {
    try {
      const techniqueList: Technique[] = await this.prisma.technique.findMany(
        {}
      );
      return techniqueList;
    } catch (err) {
      console.log(`Failed to fetch techniques from Postgres: ${err}`);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number): Promise<Technique> {
    try {
      const techniqueList: Technique =
        await this.prisma.technique.findUniqueOrThrow({
          where: {
            id,
          },
        });
      return techniqueList;
    } catch (err) {
      if (err instanceof Prisma.NotFoundError) {
        // no technique exists with supplied code
        throw new NotFoundException();
      } else {
        console.log(`Failed to fetch technique from Postgres: ${err}`);
        throw new InternalServerErrorException();
      }
    }
  }
}
