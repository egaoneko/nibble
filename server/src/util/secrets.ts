import logger from './logger';
import dotenv from 'dotenv';
import fs from 'fs';
import { ENVIRONMENT } from '../const';

if (fs.existsSync('.env')) {
    logger.debug('Using .env file to supply config environment variables');
    dotenv.config({ path: '.env' });
} else {
    logger.debug('Using .env.example file to supply config environment variables');
    dotenv.config({ path: '.env.example' });  // you can delete this after you create your own .env file!
}
const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

export const SESSION_SECRET: string = process.env.SESSION_SECRET as string;
export const MONGODB_URI: string = (prod ? process.env.MONGODB_URI : process.env.MONGODB_URI_LOCAL) as string;

if (!SESSION_SECRET) {
    logger.error('No client secret. Set SESSION_SECRET environment variable.');
    process.exit(1);
}

if (!MONGODB_URI) {
    logger.error('No mongo connection string. Set MONGODB_URI environment variable.');
    process.exit(1);
}
