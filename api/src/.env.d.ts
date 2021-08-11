declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    DB_USER: string;
    DB_HOST: string;
    DATABASE: string;
    DB_PASSWORD: string;
    DB_PORT: string;
    REDIS_URL: string;
    SESSION_SECRET: string;
    GOOGLE_MAPS_API_KEY: string;
    // CORS_ORIGIN: string;
    
  }
}
