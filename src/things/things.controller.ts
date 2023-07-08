import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { ThingsService } from "./things.service";
import { CreateThingDto } from "./dto/create-thing.dto";
import { UpdateThingDto } from "./dto/update-thing.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";

@ApiTags("Things")
@Controller("things")
@ApiBearerAuth()
export class ThingsController {
  constructor(private readonly thingsService: ThingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createThingDto: CreateThingDto) {
    return this.thingsService.create(createThingDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.thingsService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  findOne(@Param("id") id: string) {
    return this.thingsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  update(@Param("id") id: string, @Body() updateThingDto: UpdateThingDto) {
    return this.thingsService.update(id, updateThingDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  remove(@Param("id") id: string) {
    return this.thingsService.remove(id);
  }
}
