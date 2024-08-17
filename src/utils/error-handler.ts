import { HttpException, InternalServerErrorException } from '@nestjs/common';

export const handleError = (moduleName: string, e: unknown) => {
  if (e instanceof HttpException) {
    throw e;
  } else {
    console.log(moduleName, e);
    throw new InternalServerErrorException(e);
  }
};
