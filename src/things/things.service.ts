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

  findAll(userId: string) {
    return this.prisma.thing
      .findMany({
        where: {
          NOT: {
            authorId: userId,
          },
        },
        include: {
          category: true,
          exchangeCategory: true,
          author: true,
        },
      })
      .then((things) => {
        return things.map((thing) => ({
          ...thing,
          author: thing.author.name,
          phone: thing.author.phone,
          category: thing.category.name,
          exchangeCategory: thing.exchangeCategory.name,
        }));
      });
  }

  findOne(id: string) {
    return this.prisma.thing
      .findUnique({
        where: {
          id,
        },
        include: {
          category: true,
          exchangeCategory: true,
          author: true,
        },
      })
      .then((thing) => {
        if (!thing) return null;

        return {
          ...thing,
          author: thing.author.name,
          phone: thing.author.phone,
          category: thing.category.name,
          exchangeCategory: thing.exchangeCategory.name,
        };
      });
  }

  findUserThings(userId: string) {
    return this.prisma.thing
      .findMany({
        where: {
          authorId: userId,
        },
        include: {
          category: true,
          exchangeCategory: true,
          author: true,
        },
      })
      .then((things) => {
        return things.map((thing) => ({
          ...thing,
          author: thing.author.name,
          phone: thing.author.phone,
          category: thing.category.name,
          exchangeCategory: thing.exchangeCategory.name,
        }));
      });
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
