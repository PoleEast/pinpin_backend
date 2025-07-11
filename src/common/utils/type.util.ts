type ConstObjectValues<T extends Record<string, string | number | symbol>> = T[keyof T];

export type { ConstObjectValues };
