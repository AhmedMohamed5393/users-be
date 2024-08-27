import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export function QueryRequestValidationMiddleware<T>(type: any): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next): void => {
    const dtoInstance: any = plainToInstance(type, req.query);
    validate(dtoInstance).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const errorMessages = errors.map((error) =>
          Object.values(error.constraints ?? {}).join(', ')
        );
        res.status(400).json({ errors: errorMessages });
      } else {
        req.query = dtoInstance;
        next();
      }
    });
  };
}
