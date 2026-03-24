import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { PartyModule } from "./party/party.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [UserModule, PartyModule, AuthModule],
})
export class AppModule {}
