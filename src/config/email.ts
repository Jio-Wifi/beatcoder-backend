import nodemailer from 'nodemailer';
import config from '.';

export const emailTransporter = nodemailer.createTransport({
    service: config.SMPT_SERVICE,
    host: config.SMPT_HOST,
    port: Number(config.SMPT_PORT),
    secure: false,
    auth: {
        user: config.SMPT_MAIL,
        pass: config.SMPT_PASSWORD,
    },
});



