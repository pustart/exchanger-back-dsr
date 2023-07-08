import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({ data: createCategoryDto });
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  findOne(categoryId: string) {
    return this.prisma.category.findUnique({ where: { id: categoryId } });
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
