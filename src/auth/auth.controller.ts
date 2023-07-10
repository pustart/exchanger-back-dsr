import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ErrorResponse } from "src/exceptions/response/exceptions.response";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/auth.dto";
import { AuthUserResponse } from "./response/auth.responses";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";

@ApiTags("Log in and sign up endpoints")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "User authorization" })
  @ApiResponse({
    status: 200,
    description: "access JWT was created",
    type: AuthUserResponse,
  })
  @ApiResponse({ status: 400, type: ErrorResponse })
  @ApiResponse({ status: 401, type: ErrorResponse })
  @ApiResponse({ status: 404, type: ErrorResponse })
  @ApiResponse({ status: 500, type: ErrorResponse })
  @Post("/login")
  @HttpCode(HttpStatus.OK)
  login(@Body() userDto: LoginDto) {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: "User registration" })
  @ApiResponse({
    status: 200,
    description: "User was created",
    type: AuthUserResponse,
  })
  @ApiResponse({ status: 400, type: ErrorResponse })
  @ApiResponse({ status: 401, type: ErrorResponse })
  @ApiResponse({ status: 404, type: ErrorResponse })
  @ApiResponse({ status: 500, type: ErrorResponse })
  @Post("/registration")
  @HttpCode(HttpStatus.OK)
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
  registration(@UploadedFile() photo: Express.Multer.File, @Body() userDto: CreateUserDto) {
    const photoUrl = photo ? `/${photo.filename}` : null;
    userDto.photo = photoUrl;
    return this.authService.registration(userDto);
  }
}
