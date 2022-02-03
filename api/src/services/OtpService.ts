import { Service } from 'typedi';
import Redis from 'ioredis';
import { ValidateOtpInput } from '../utils/types/ValidateOtpInput';
import { authenticator } from 'otplib';

export class Otp {
    constructor(public otp: string, public expirationTime: Date) {}
}

@Service()
export class OtpService {
    constructor(private readonly redis = new Redis(process.env.REDIS_URL)) {}

    public async storeOtp(otp: Otp): Promise<boolean> {
        try {
            if (await this.redis.exists(otp.otp)) {
                return false;
            }
            // store
            await this.redis.set(otp.otp, otp.expirationTime.toString());
            // TODO: setup auto expiration if never claimed
            // this.redis.expireat(otp, )
            return true;
        } catch {
            return false;
        }
    }

    public async validateOtp(
        input: ValidateOtpInput,
        userId: string
    ): Promise<boolean> {
        try {
            if (!(await this.redis.exists(input.otp))) {
                return false;
            }
            const value = await this.redis.get(input.otp);
            console.log('actually maps to ', value);
            if (value === null) {
                return false;
            }
            // is otp expired
            const cutoff = new Date(value),
                now = new Date();
            if (cutoff < now) return false;
            // is identity validated
            const secret = process.env.OTP_SECRET + userId.replaceAll('-', '');
            console.log(`(${input.otp} ${secret})`);

            const isValid = authenticator.verify({
                secret: secret,
                token: input.otp,
            });
            console.log('is token valid:', isValid);
            if (!isValid) return false;
            return true;
        } catch {
            return false;
        }
    }
}
