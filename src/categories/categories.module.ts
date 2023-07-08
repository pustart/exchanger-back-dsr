import { Module } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { DatabaseModule } from "src/database/database.module";
import { JwtStrategy } from "src/auth/strategies/jwt.strategy";

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, JwtStrategy],
  imports: [DatabaseModule],
})
export class CategoriesModule {}
