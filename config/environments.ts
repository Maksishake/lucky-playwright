export const EnvironmentConfig = {
  getBaseUrl(): string {
    return process.env.BASE_URL || 'https://luckycoin777.live';
  },
  
  getApiUrl(): string {
    return process.env.API_URL || 'http://127.0.0.1:3000/api';
  },
  
  isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  },
  
  isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  },
  
  isTest(): boolean {
    return process.env.NODE_ENV === 'test';
  }
};
