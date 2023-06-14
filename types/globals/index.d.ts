interface ConfigType {
  priceAPI: {
    url: string,
    key: string,
  },
  APIGenerated: {
    refreshRate: number,
    port: number,
    tokenMetadataDir: string
  },
}

declare global {
    namespace NodeJS {
      interface Global {
        CONFIG: ConfigType;
      }
    }
  }
