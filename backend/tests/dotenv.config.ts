import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../config/', `.${process.env.NODE_ENV}`) });
