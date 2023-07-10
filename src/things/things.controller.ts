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
import { ThingsService } from "./things.service";
import { CreateThingDto } from "./dto/create-thing.dto";
import { UpdateThingDto } from "./dto/update-thing.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";

@ApiTags("Things")
@Controller("things")
@ApiBearerAuth()
export class ThingsController {
  constructor(private readonly thingsService: ThingsService) {}

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
  async create(@UploadedFile() photo: Express.Multer.File, @Body() createThingDto: CreateThingDto) {
    const photoUrl = photo ? `/${photo.filename}` : null;
    createThingDto.photo = photoUrl;
    return this.thingsService.create(createThingDto);
  }

  @Get("/all/:id")
  @UseGuards(JwtAuthGuard)
  findAll(@Param("id") id: string) {
    return this.thingsService.findAll(id);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  findOne(@Param("id") id: string) {
    return this.thingsService.findOne(id);
  }

  @Get("/findUserThings/:id")
  @UseGuards(JwtAuthGuard)
  findUserThings(@Param("id") id: string) {
    return this.thingsService.findUserThings(id);
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
    @Body() updateThingDto: UpdateThingDto,
  ) {
    const photoUrl = photo ? `/${photo.filename}` : null;
    updateThingDto.photo = photoUrl;
    return this.thingsService.update(id, updateThingDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  remove(@Param("id") id: string) {
    return this.thingsService.remove(id);
  }
}
