import { ZodType } from "zod";

export const validateData = <T>({
  schema,
  data,
}: {
  schema: ZodType<T>;
  data: unknown;
}) => {
  let errors: Partial<{
    [key in keyof T]: string;
  }> = {};
  const validatingData = schema.safeParse(data);
  if (!validatingData.success) {
    validatingData.error.issues.forEach(
      (issue: { path: (string | number)[]; message: string }) => {
        errors = {
          ...errors,
          [issue.path[0]]: issue.message
            .toLowerCase()
            .replace("boolean", "true or false")
            .replace("invalid enum value. expected", "must be")
            .replace("|", "or"),
        };
      }
    );
    return {
      validData: null,
      errors,
    };
  }
  return {
    validData: validatingData.data,
    errors,
  };
};

export const addServerError = <T>(
  serverErrorMessage: string,
  zodErrors: Partial<{
    [key in keyof T]: string;
  }>
): {
  status: "error";
  errors: Partial<{
    [key in keyof T]: string;
  }>;
} => {
  return {
    status: "error",
    errors:
      Object.keys(zodErrors).length > 0
        ? zodErrors
        : { ...zodErrors, serverError: serverErrorMessage },
  };
};

export const errorHandler = <T>(
  error: any,
  zodErrors: Partial<{
    [key in keyof T]: string;
  }>
): {
  status: "error";
  errors: Partial<{
    [key in keyof T]: string;
  }>;
} => {
  if (error instanceof Error) {
    return {
      status: "error",
      errors:
        Object.keys(zodErrors).length > 0
          ? zodErrors
          : { ...zodErrors, serverError: error.message },
    };
  }
  return {
    status: "error",
    errors:
      Object.keys(zodErrors).length > 0
        ? zodErrors
        : { ...zodErrors, serverError: `${error}` },
  };
};
