import { Module } from "@nestjs/common";
import { ContainerController } from "./controller";
import { ContainerService } from "./service";

@Module({
  controllers: [ContainerController],
  providers: [ContainerService],
})
export class ContainerModule {}
