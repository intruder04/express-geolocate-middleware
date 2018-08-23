export type EnvironmentType = 'test' | 'development' | 'test';

export type CertType = {
  url: string,
  name: string,
  username: string,
  password: string,
  passphrase: string,
  path: string
};

export type ConfigType = {
  name: string,
  server: {
    log: {
      dir: string
    },
    port: number,
    postgres: {
      host: string,
      port: number,
      lp: string,
      db: string
    }
  },
  modules: {
    certs: Array<CertType>,
    defaultCertName: string,
    config: {
      token: string,
      access: {
        user: string
      }
    }
  },
  functions: {
    cert: Function
  },
  src: ?string,
  clickHouseTable: string,
  clickhouse: {
    host: string,
    port: number
  }
};

export type ConfigFileType = {
  [EnvironmentType]: ConfigType
};
