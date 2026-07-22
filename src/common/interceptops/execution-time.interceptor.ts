import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class ExecutionTimeInterceptor implements NestInterceptor {
  private readonly logger = new Logger();
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now(); // Start time
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap(() => {
        const executionTime = Date.now() - start;
        const { method } = request;
        const url = request.route?.path || request.path; // Clean path, no query params
        let statusCode = response.statusCode;
        const statusMessage = response.statusMessage; // 'Not Modified',
        if(statusMessage === "Not Modified") {
          statusCode = 200
        }
        const color = statusCode >= 200 && statusCode < 300 ? "\x1b[32m" : "\x1b[31m"; // Green or Red
        const reset = "\x1b[0m"; // Reset color
        const yellow = "\x1b[33m";

        this.logger.debug(`${yellow}[${method} API ${url}]${reset}responded with status ${color}${statusCode}${reset}${statusMessage === 'Not Modified' ? ' (was 304)' : ''} in ${executionTime}ms`);

      })
    );
  }
}