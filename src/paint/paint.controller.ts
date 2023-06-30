import { Controller, Get, Param } from "@nestjs/common";
import { PaintService } from "./paint.service";

@Controller("paint")
export class PaintController {
  constructor(private readonly paintService: PaintService) {}

  @Get()
  findAll() {
    return this.paintService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.paintService.findOne(+id);
  }
}
