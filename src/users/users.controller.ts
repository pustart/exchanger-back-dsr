import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";

@ApiTags("Users")
@Controller("users")
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor("photo", {
      storage: diskStorage({
        destination: "./public",
        filename: (req, file, cb) => {
          const filename = uuidv4();
          const extension = file.originalname.split(".").pop();
          cb(null, `${filename}.${extension}`);
        },
      }),
    }),
  )
  create(@UploadedFile() photo: Express.Multer.File, @Body() createUserDto: CreateUserDto) {
    const photoUrl = photo ? `/${photo.filename}` : null;
    createUserDto.photo = photoUrl;
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor("photo", {
      storage: diskStorage({
        destination: "./public",
        filename: (req, file, cb) => {
          const filename = uuidv4();
          const extension = file.originalname.split(".").pop();
          cb(null, `${filename}.${extension}`);
        },
      }),
    }),
  )
  update(
    @UploadedFile() photo: Express.Multer.File,
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const photoUrl = photo ? `/${photo.filename}` : null;
    if (!photoUrl) {
      updateUserDto.photo = updateUserDto.photoUrl === "null" ? null : updateUserDto.photoUrl;
    } else {
      updateUserDto.photo = photoUrl;
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
