/**
 * OmniRecon — Config loader
 * Reads and validates environment variables.
 */

const config = {
  port: Number(process.env.PORT) || 3000,
  wsPort: Number(process.env.WS_PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  googleTilesApiKey: process.env.GOOGLE_3D_TILES_API_KEY || '',
  openskyUsername: process.env.OPENSKY_USERNAME || '',
  openskyPassword: process.env.OPENSKY_PASSWORD || '',
  adsbExchangeApiKey: process.env.ADSB_EXCHANGE_API_KEY || '',
  celestrakBaseUrl: process.env.CELESTRAK_BASE_URL || 'https://celestrak.org',
  aisApiKey: process.env.AIS_API_KEY || '',
  databaseUrl: process.env.DATABASE_URL || 'sqlite://./data/omnirecon.db',
  replayRetentionDays: Number(process.env.REPLAY_RETENTION_DAYS) || 30,
  features: {
    cctv: process.env.ENABLE_CCTV !== 'false',
    jamming: process.env.ENABLE_JAMMING !== 'false',
    blackouts: process.env.ENABLE_BLACKOUTS !== 'false',
    replay: process.env.ENABLE_REPLAY !== 'false',
  },
};

export default config;
