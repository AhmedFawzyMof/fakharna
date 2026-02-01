type Success<T> = T | null;
type Failed = Error | null;

type Result<T> = {
  data: Success<T>;
  error: Failed;
};

export async function tryCatch<T>(func: () => Promise<T>): Promise<Result<T>> {
  try {
    return { data: await func(), error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error };
    }
    return { data: null, error: new Error(String(error)) };
  }
}
