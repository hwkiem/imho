import { Service } from 'typedi';
import Redis from 'ioredis';
import { AddMinutesToDate, OtpValidator } from '../validators/OtpValidator';
import { authenticator } from 'otplib';
import { SuccessResponse } from '../utils/types/SuccessResonse';

export class Otp {
    constructor(
        public otp: string,
        public expirationTime: Date = AddMinutesToDate(new Date(), 60) // default 1 hour lifetime
    ) {}
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
            // setup auto expiration if never claimed
            this.redis.expireat(
                otp.otp,
                AddMinutesToDate(new Date(), 60 * 4).getTime() // OTP expires for good 4 hours later
            );
            return true;
        } catch {
            return false;
        }
    }

    public async validateOtp(
        input: OtpValidator,
        userId: string
    ): Promise<SuccessResponse> {
        const value = await this.redis.get(input.otp);
        if (value === null) {
            return {
                success: false,
                apiError: {
                    field: 'otp',
                    error: 'no record of this otp saved',
                },
            };
        }
        // is otp expired
        const cutoff = new Date(value),
            now = new Date();
        if (cutoff < now)
            return {
                success: false,
                apiError: {
                    field: 'otp',
                    error: 'otp has expired',
                },
            };
        // is identity validated
        const secret = process.env.OTP_SECRET + userId.replaceAll('-', '');
        // console.log(`(${input.otp} ${secret})`);

        const isValid = authenticator.verify({
            secret: secret,
            token: input.otp,
        });
        if (!isValid)
            return {
                success: false,
                apiError: {
                    field: 'otp',
                    error: 'could not validate otp to your profile',
                },
            };
        // user token is validated, delete this key
        this.redis.del(input.otp);
        return { success: true };
    }
}
