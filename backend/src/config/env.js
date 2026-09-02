require('dotenv').config();
const { z } = require('zod');

const isTest = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default(isTest ? 'test' : 'development'),
  PORT: z.string().default('4000').transform(val => parseInt(val, 10)),
  DATABASE_URL: z.string().default(
    isTest ? 'postgresql://postgres:postgres@localhost:5432/edusphare_test' : ''
  ).refine(val => val.length > 0, { message: 'DATABASE_URL is required' }),
  WEB_ORIGIN: z.string().default('http://localhost:3000'),
  JWT_ACCESS_SECRET: z.string().default(
    isTest ? 'edusphare_test_secret_key_at_least_32_chars_long' : ''
  ).refine(val => val.length >= 16, { message: 'JWT_ACCESS_SECRET must be at least 16 characters long' }),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).optional(),
  RATE_LIMIT_LOGIN_MAX: z.string().default('10').transform(val => parseInt(val, 10)),
  RATE_LIMIT_LOGIN_WINDOW_MS: z.string().default('60000').transform(val => parseInt(val, 10)),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables configuration:');
    console.error(result.error.format());
    // Throw error or exit in production, but in development provide clear message
    throw new Error('Invalid environment configuration');
  }
  return result.data;
};

const env = parseEnv();

module.exports = env;
