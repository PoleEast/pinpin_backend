import { User } from "@/entities/user.entity.js";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

//獲取User的屬性資料
type UserKey = keyof User;

const GetUser = createParamDecorator((data: UserKey | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user: User = request.user;

  if (!data) {
    return user;
  }

  //回傳傳入參數的屬性
  if (data in user) {
    return user[data];
  }
});

export default GetUser;
