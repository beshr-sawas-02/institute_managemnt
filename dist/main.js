"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
let cachedServer;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('نظام إدارة المدرسة')
        .setDescription('واجهة برمجية لنظام إدارة المدرسة الشامل')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
    return cachedServer;
}
if (process.env.NODE_ENV !== 'production') {
    core_1.NestFactory.create(app_module_1.AppModule).then(async (app) => {
        app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
        app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
        app.enableCors();
        await app.listen(3000);
        console.log('Server running on http://localhost:3000');
    });
}
async function handler(req, res) {
    const server = await bootstrap();
    return server(req, res);
}
module.exports = handler;
//# sourceMappingURL=main.js.map