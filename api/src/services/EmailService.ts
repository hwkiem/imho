import { Service } from 'typedi';
import nodemailer from 'nodemailer';

@Service()
export class EmailService {
    constructor(
        private readonly mailer = nodemailer.createTransport({
            service: 'Gmail',
            secure: true,
            auth: {
                user: `${process.env.EMAIL_ADDRESS}`,
                pass: `${process.env.EMAIL_PASSWORD}`,
            },
        })
    ) {}

    public async sendOtp(email: string, otp: string): Promise<boolean> {
        const info = await this.mailer.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: 'Your OTP, as requested', // Subject line
            html: `<b>Forgot your password? Happens dude. Click our link and you'll be on your way.</b> 
            <a href="${
                process.env.NODE_ENV === 'dev'
                    ? 'http://localhost:4000'
                    : 'http://imho.vercel.app'
            }/change-password/${otp}">reset password</a>`, // html body
        });
        if (info.accepted.includes(email)) {
            return true;
        }
        return false;
    }
}
