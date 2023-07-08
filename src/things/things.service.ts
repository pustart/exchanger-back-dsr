import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateThingDto } from "./dto/create-thing.dto";
import { UpdateThingDto } from "./dto/update-thing.dto";

@Injectable()
export class ThingsService {
  constructor(private prisma: PrismaService) {}

  create(createThingDto: CreateThingDto) {
    return this.prisma.thing.create({ data: createThingDto });
  }

  findAll() {
    return this.prisma.thing.findMany();
  }

  findOne(id: string) {
    return this.prisma.thing.findUnique({ where: { id } });
  }

  update(id: string, updateThingDto: UpdateThingDto) {
    return this.prisma.thing.update({
      where: { id },

      data: updateThingDto,
    });
  }

  remove(id: string) {
    return this.prisma.thing.delete({ where: { id } });
  }
}
