import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
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
import { Role } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    const { birthday } = createUserDto;
    const [year, month, day] = birthday.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        birthday: date,
      },
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      where: {
        NOT: {
          role: Role.ADMIN,
        },
      },
      include: {
        things: true,
      },
    });

    const usersWithCount = users.map((user) => {
      const thingsCount = user.things.length;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        birthday: user.birthday,
        photo: user.photo,
        role: user.role,
        thingsCount,
      };
    });

    return usersWithCount;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        things: true,
      },
    });

    if (!user) {
      throw new NotFoundException(FIND_USER_ERROR);
    }

    const thingsCount = user.things.length;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthday: user.birthday,
      photo: user.photo,
      role: user.role,
      thingsCount,
    };
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const data = {
      email: updateUserDto.email,
      name: updateUserDto.name,
      phone: updateUserDto.phone,
      photo: updateUserDto.photo,
    };
    return this.prisma.user.update({
      where: { id },
      data,
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
