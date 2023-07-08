import { Module } from "@nestjs/common";
import { ThingsService } from "./things.service";
import { ThingsController } from "./things.controller";
import { JwtStrategy } from "src/auth/strategies/jwt.strategy";
import { DatabaseModule } from "src/database/database.module";

@Module({
  controllers: [ThingsController],
  providers: [ThingsService, JwtStrategy],
  imports: [DatabaseModule],
})
export class ThingsModule {}
