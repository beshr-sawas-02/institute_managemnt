// src/common/decorators/current-user.decorator.ts
// مُزخرف المستخدم الحالي - لاستخراج بيانات المستخدم من الطلب

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (data) {
      return user?.[data];
    }

    return user;
  },
);