import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ToolService } from "./tool.service";
@Controller("tool")
export class ToolController {
  constructor(private readonly toolService: ToolService) {}
  @Get()
  findAll() {
    return this.toolService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.toolService.findOne(+id);
  }
}
