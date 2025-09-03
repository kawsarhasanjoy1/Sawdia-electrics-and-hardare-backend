import { ZodError } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleZodError = (err: ZodError<any>): TGenericErrorResponse => {
  const errorSources: TErrorSources = err.issues.map((issue) => {
    const lastPath = issue.path && issue.path.length ? issue.path[issue.path.length - 1] : '';
    return {
      path: String(lastPath),
      message: issue.message ?? 'Invalid value',
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleZodError;