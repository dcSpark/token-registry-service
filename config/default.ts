export default {
  APIGenerated: {
    refreshRate: 60000, // per min
    port: 8091,
    tokenMetadataDir: process.env.TOKEN_METADATA_DIR ?? "../registry/cardano-foundation/mappings",
  },
} as ConfigType;
