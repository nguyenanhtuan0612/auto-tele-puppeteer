import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const { NODE_ENV, PORT, MIN_CRON_HCE, ADMIN_USER, ADMIN_PASSWORD, BACKEND_URL } = process.env;
