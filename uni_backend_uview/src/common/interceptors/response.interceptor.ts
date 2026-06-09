import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SKIP_INTERCEPTOR_KEY } from '../decorators/skip-interceptor.decorator';

export interface Response<T> {
  code: number;
  data: T;
  message: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // 检查是否跳过拦截器
    const skipInterceptor = Reflect.getMetadata(SKIP_INTERCEPTOR_KEY, context.getHandler());

    if (skipInterceptor) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // 强制设置 HTTP 状态码为 200，避免201 Created 问题
        const response = context.switchToHttp().getResponse();
        response.status(200);

        if (data && typeof data === 'object' && 'code' in data) {
          return data;
        }
        return {
          code: 1000,
          data: data || null,
          message: 'success',
        };
      }),
    );
  }
}
