import { FieldError } from "../src/generated/graphql";

export const toErrorMap = (err: FieldError[]) => {
  const errorMap: Record<string, string> = {};
  err.forEach(({ field, message }) => {
    errorMap[field] = message;
  });

  return errorMap;
};
