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
        // no duplicate otp's or overwriting keys
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
    }

    public async validateOtp(
        input: OtpValidator,
        userId: string
    ): Promise<SuccessResponse> {
        // ensure otp recorded on redis
        const value = await this.redis.get(input.otp);
        if (value === null) {
            return {
                result: { success: false },
                errors: [
                    {
                        field: 'otp',
                        error: 'no record of this otp saved',
                    },
                ],
            };
        }
        // is otp expired
        const cutoff = new Date(value),
            now = new Date();
        if (cutoff < now)
            return {
                result: { success: false },
                errors: [
                    {
                        field: 'otp',
                        error: 'otp has expired',
                    },
                ],
            };

        // is identity validated
        const secret = process.env.OTP_SECRET + userId.replaceAll('-', '');

        const isValid = authenticator.verify({
            secret: secret,
            token: input.otp,
        });
        if (!isValid)
            return {
                result: { success: false },
                errors: [
                    {
                        field: 'otp',
                        error: 'could not validate otp to your account',
                    },
                ],
            };
        // user token is validated, delete this key
        this.redis.del(input.otp);
        return { result: { success: true } };
    }
}
