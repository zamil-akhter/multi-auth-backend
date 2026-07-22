import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExecutionTimeInterceptor } from './common/interceptops/execution-time.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ExecutionTimeInterceptor());

  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Multi Auth Backend API')
    .setDescription('Authentication, session, and security endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Retains tokens on browser refresh
      defaultModelsExpandDepth: -1, // Hides the Schemas section completely
    },
  });

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  logger.log(`Server started on port ${port}`);
  logger.log(`Swagger available at http://localhost:${port}/docs`);
}
bootstrap();
