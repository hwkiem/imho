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
            html: `<b>Forgot your password? Happens dude. Type this in: ${otp}</b>`, // html body
        });
        if (email in info.accepted) {
            return true;
        }
        return false;
    }
}
