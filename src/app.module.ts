import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { CategoriesModule } from "./categories/categories.module";
import { ThingsModule } from "./things/things.module";
import { UsersModule } from "./users/users.module";
import { TokenModule } from "./token/token.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [DatabaseModule, CategoriesModule, ThingsModule, UsersModule, TokenModule, AuthModule],
})
export class AppModule {}
