import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export type CurrentUserRequest = {
  sub: number;
};

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.user as CurrentUserRequest;
  }
);
