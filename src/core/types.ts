export type Extract<T, U> = U extends keyof T ? T[U] : {};
export type ValueOf<T> = T[keyof T];
export type HashMap<T> = { [key: string]: T };
export type UnwrapArrayType<T> = T extends Array<infer U> ? U : T;
