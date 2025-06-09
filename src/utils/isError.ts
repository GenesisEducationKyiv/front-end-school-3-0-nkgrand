export const isError = (e: unknown): e is Error => {
  return e instanceof Error;
}

export const isNamedError = (err: unknown): err is { name: string } => {
  return (
    typeof err === 'object' &&
    err !== null &&
    'name' in err &&
    typeof (err as Record<string, unknown>)['name'] === 'string'
  );
}