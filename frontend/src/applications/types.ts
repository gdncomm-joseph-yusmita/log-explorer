export type ApplicationLog = Record<string, string | number | boolean> & {
  raw: string;
};

export type ApplicationSchema<T extends ApplicationLog> = {
  [K in keyof T]: {
    header: string;
    key: K;
    hidden?: boolean;
    columnSize?: string;

    // Render functions receive the specific value
    render?: (val: T[K], searchQuery?: string) => React.ReactNode;
    renderDetail?: (val: T[K], searchQuery?: string) => React.ReactNode;
  };
}[keyof T];

export type ApplicationModule<T extends ApplicationLog> = {
  parse: (rawLog: string) => T | undefined;
  columns: ApplicationSchema<T>[];
};

export function createApplicationModule<T extends ApplicationLog>(opts: {
  name: string;
  icon: string;
  parseFn: (rawLog: string) => T | undefined;
  schema: ApplicationSchema<T>[];
}) {
  return opts;
}
