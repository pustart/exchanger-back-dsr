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

  async findExchangeable(userId: string) {
    const userCategories = await this.prisma.thing.findMany({
      where: {
        authorId: userId,
      },
      distinct: ["categoryId"],
      select: {
        categoryId: true,
      },
    });

    const userCategoriesToExchange = await this.prisma.thing.findMany({
      where: {
        authorId: userId,
      },
      distinct: ["exchangeCategoryId"],
      select: {
        exchangeCategoryId: true,
      },
    });

    const categoryIds = userCategories.map((category) => category.categoryId);
    const exchangeCategoryIds = userCategoriesToExchange.map(
      (category) => category.exchangeCategoryId,
    );

    const things = await this.prisma.thing.findMany({
      where: {
        exchangeCategoryId: {
          in: categoryIds,
        },
        categoryId: {
          in: exchangeCategoryIds,
        },
        NOT: {
          authorId: userId,
        },
      },
      include: {
        category: true,
        exchangeCategory: true,
        author: true,
      },
    });

    const transformedThings = things.map((thing) => ({
      ...thing,
      author: thing.author.name,
      phone: thing.author.phone,
      category: thing.category.name,
      exchangeCategory: thing.exchangeCategory.name,
    }));

    return transformedThings;
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
    const data = {
      name: updateThingDto.name,
      description: updateThingDto.description,
      authorId: updateThingDto.authorId,
      categoryId: updateThingDto.categoryId,
      exchangeCategoryId: updateThingDto.exchangeCategoryId,
      photo: updateThingDto.photo,
    };
    return this.prisma.thing.update({
      where: { id },

      data,
    });
  }

  remove(id: string) {
    return this.prisma.thing.delete({ where: { id } });
  }

  async exchange(thingId1: string, thingId2: string) {
    const deleteThing1 = this.prisma.thing.delete({ where: { id: thingId1 } });
    const deleteThing2 = this.prisma.thing.delete({ where: { id: thingId2 } });

    await Promise.all([deleteThing1, deleteThing2]);

    return true;
  }
}
