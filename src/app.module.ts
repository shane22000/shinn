import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module'; 

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CategoryModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}