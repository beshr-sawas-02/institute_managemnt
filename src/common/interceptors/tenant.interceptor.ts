import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.source === 'org') {
      if (!user.orgId) {
        throw new ForbiddenException('لم يتم تحديد المؤسسة');
      }
      request.orgId = user.orgId;
    }

    return next.handle();
  }
}
