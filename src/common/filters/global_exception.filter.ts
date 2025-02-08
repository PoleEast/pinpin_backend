import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DatabaseException } from '../exception/database.exception.js';
import { ApiErrorResponseDTO } from 'pinpin_library';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const errorResponse: ApiErrorResponseDTO = {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: '發生預期之外的錯誤',
            error: exception.name,
        };

        if (exception instanceof HttpException) {
            errorResponse.statusCode =
                exception.getStatus() || errorResponse.statusCode;
            errorResponse.message = exception.message || errorResponse.message;
            errorResponse.error = exception.name || errorResponse.error;
        } else if (exception instanceof DatabaseException) {
            errorResponse.statusCode = HttpStatus.SERVICE_UNAVAILABLE;
            errorResponse.message = exception.message || errorResponse.message;
            errorResponse.error = exception.name || errorResponse.error;

            this.logger.error(exception.originalError);
        }

        this.logger.debug(exception);

        response.status(errorResponse.statusCode).json(errorResponse);
    }
}

