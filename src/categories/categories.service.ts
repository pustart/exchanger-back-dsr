import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CATEGORY_FOUND_ERROR } from "./categories.constants";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({ data: createCategoryDto });
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      include: {
        thing: true,
      },
    });

    const categoriesWithCount = categories.map((category) => {
      const thingsCount = category.thing.length;
      return { id: category.id, name: category.name, thingsCount };
    });

    return categoriesWithCount;
  }

  async findOne(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        thing: true,
      },
    });

    if (!category) {
      throw new NotFoundException(CATEGORY_FOUND_ERROR);
    }

    const thingsCount = category.thing.length;
    return { id: category.id, name: category.name, thingsCount };
  }

  update(categoryId: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id: categoryId },

      data: updateCategoryDto,
    });
  }

  remove(categoryId: string) {
    return this.prisma.category.delete({ where: { id: categoryId } });
  }
}
