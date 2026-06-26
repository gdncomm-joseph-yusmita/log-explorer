export type ApplicationLog = Record<string, string | number | boolean> & {
  raw: string;
};

export type ApplicationColumn<T extends ApplicationLog> = {
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

export function createColumns<T extends ApplicationLog>(
  columns: ApplicationColumn<T>[],
) {
  return columns;
}

export type ApplicationModule<T extends ApplicationLog> = {
  parse: (rawLog: string) => T | undefined;
  columns: ApplicationColumn<T>[];
};

export function createApplicationModule<T extends ApplicationLog>(opts: {
  parseFn: (rawLog: string) => T | undefined;
  columns: ApplicationColumn<T>[];
}) {
  return opts;
}
