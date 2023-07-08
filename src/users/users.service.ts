import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserEntity } from "./entities/user.entity";
import * as bcrypt from "bcryptjs";

import {
  CREATE_USER_ERROR,
  FIND_USER_BY_EMAIL_ERROR,
  FIND_USER_ERROR,
  HASH_ERROR,
} from "./users.constants";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    const { birthday } = createUserDto;
    console.log(birthday);
    const [year, month, day] = birthday.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        birthday: date,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    try {
      return this.prisma.user.findUnique({ where: { email } });
    } catch (err) {
      throw new HttpException(FIND_USER_BY_EMAIL_ERROR, HttpStatus.NOT_FOUND);
    }
  }

  async hashPassword(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, 10);
    } catch (err) {
      throw new HttpException(HASH_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
