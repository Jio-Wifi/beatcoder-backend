import config from '../config';
import { emailTransporter } from '../config/email';

export const sendEmail = async (to: string, subject: string, html: string) => {
    const mailOptions = {
        from: config.SMPT_MAIL, 
        to,
        subject,
        html,
    };

    await emailTransporter.sendMail(mailOptions);
};
