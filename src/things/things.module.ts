import { Module } from "@nestjs/common";
import { ThingsService } from "./things.service";
import { ThingsController } from "./things.controller";
import { JwtStrategy } from "src/auth/strategies/jwt.strategy";

@Module({
  controllers: [ThingsController],
  providers: [ThingsService, JwtStrategy],
})
export class ThingsModule {}
