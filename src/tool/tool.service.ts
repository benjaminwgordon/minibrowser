import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, Tool } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ToolService {
  constructor(private prisma: PrismaService) {}
  // Tools represent a static resource that users cannot upload or modify.
  // This is subject to change in the future if there is demand for user-uploaded tools
  async findAll(): Promise<Tool[]> {
    try {
      const toolList: Tool[] = await this.prisma.tool.findMany({});
      return toolList;
    } catch (err) {
      console.log(`Failed to fetch tools from Postgres: ${err}`);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number): Promise<Tool> {
    try {
      const toolList: Tool = await this.prisma.tool.findUniqueOrThrow({
        where: {
          id,
        },
      });
      return toolList;
    } catch (err) {
      if (err instanceof Prisma.NotFoundError) {
        // no tool exists with supplied code
        throw new NotFoundException();
      } else {
        console.log(`Failed to fetch tool from Postgres: ${err}`);
        throw new InternalServerErrorException();
      }
    }
  }
}
