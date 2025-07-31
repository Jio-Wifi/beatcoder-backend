import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

class Config {
    readonly NODE_ENV: string;
    readonly PORT: string;
    readonly MONGO_URI: string;
    readonly SMPT_SERVICE: string;
    readonly SMPT_MAIL: string;
    readonly SMPT_PASSWORD: string;
    readonly SMPT_HOST: string;
    readonly SMPT_PORT: string;
    readonly REDIS_PASSWORD: string;
    readonly REDIS_HOST: string;
    readonly REDIS_PORT: string;
    readonly RAPID_API_KEY: string;
    readonly RAPID_API_HOST: string;
    readonly RAZORPAY_KEY_ID: string;
    readonly RAZORPAY_KEY_SECRET: string;
    readonly CLOUDINARY_CLOUD_NAME: string;
    readonly CLOUDINARY_API_KEY: string;
    readonly CLOUDINARY_API_SECRET: string;
    readonly FRONTEND_URL: string;
    readonly JWT_PRIVATE_KEY: string;
    readonly JWT_PUBLIC_KEY: string;
    readonly RAZORPAY_WEBHOOK_SECRET: string;



    constructor() {
        this.NODE_ENV = process.env.NODE_ENV || 'development';
        this.PORT = process.env.PORT || '3000';
        this.MONGO_URI = process.env.MONGO_URI || '';
        this.SMPT_SERVICE = process.env.SMPT_SERVICE || '';
        this.SMPT_MAIL = process.env.SMPT_MAIL || '';
        this.SMPT_PASSWORD = process.env.SMPT_PASSWORD || '';
        this.SMPT_HOST = process.env.SMPT_HOST || '';
        this.SMPT_PORT = process.env.SMPT_PORT || '';
        this.REDIS_HOST = process.env.REDIS_HOST || '';
        this.REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';
        this.REDIS_PORT = process.env.REDIS_PORT || '';
        this.RAPID_API_KEY = process.env.RAPID_API_KEY || '';
        this.RAPID_API_HOST = process.env.RAPID_API_HOST || '';
        this.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
        this.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
        this.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
        this.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
        this.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
        this.FRONTEND_URL = process.env.FRONTEND_URL || '';
        this.RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';
 

        this.JWT_PRIVATE_KEY = (process.env.JWT_PRIVATE_KEY || '').replace(/\\n/g, '\n');
this.JWT_PUBLIC_KEY = (process.env.JWT_PUBLIC_KEY || '').replace(/\\n/g, '\n');


        
        if (!this.MONGO_URI) {
            throw new Error('MongoDB URI is missing in environment variables!');
        }
    }
}

const config = new Config();
export default config;
