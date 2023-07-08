import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { JwtStrategy } from "../auth/strategies/jwt.strategy";
import { DatabaseModule } from "src/database/database.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],
  imports: [DatabaseModule],
})
export class UsersModule {}
