-- AddForeignKey
ALTER TABLE "one_nigeria_users" ADD CONSTRAINT "one_nigeria_users_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
