import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { CategoriesModule } from "./categories/categories.module";

@Module({
  imports: [DatabaseModule, CategoriesModule],
})
export class AppModule {}
