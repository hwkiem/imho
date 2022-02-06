import { Service } from 'typedi';
import Redis from 'ioredis';
import { AddMinutesToDate, OtpValidator } from '../validators/OtpValidator';
import { authenticator } from 'otplib';
import { SuccessResponse } from '../utils/types/SuccessResonse';

// import { encode, decode } from 'hi-base32';

export class Otp {
    constructor(
        public token: string,
        public userId: string,
        public secret: string,
        public expirationTime: Date = AddMinutesToDate(new Date(), 60) // default 1 hour lifetime
    ) {}
}

@Service()
export class OtpService {
    constructor(private readonly redis = new Redis(process.env.REDIS_URL)) {}

    public async generateOtp(id: string): Promise<string | undefined> {
        // const mySecret =
        //     process.env.OTP_SECRET + id.replaceAll('-', '').substring(0, 4);
        // console.log('mysecret: ', mySecret);
        // .toString(32); // unique but secret
        // const secret = authenticator.generateSecret();

        // const encodedSecret = encode(mySecret);

        // console.log('secret ended up being: ', secret);
        // const betterSecret = authenticator.generateSecret();
        // console.log('32 byte looks like:', betterSecret);
        // authenticator.options = { crypto };
        // console.log(encodedSecret);

        // const cleanedup = encodedSecret.toString().replace(/=/g, '');
        // console.log('cleanedup', cleanedup);
        // const encodedSecret = authenticator.encode(secret);
        // console.log('encoded: ', encodedSecret);
        const losersecret = authenticator.generateSecret();
        const token = authenticator.generate(losersecret);
        console.log('token: ', token);
        const otp = new Otp(token, id, losersecret);

        // no duplicate otp's or overwriting keys
        if (await this.redis.exists(otp.token)) {
            return;
        }
        // store
        console.log('storing', JSON.stringify(otp));
        await this.redis.set(otp.token, JSON.stringify(otp));
        // setup auto expiration if never claimed
        this.redis.expireat(
            otp.token,
            AddMinutesToDate(new Date(), 60 * 4).getTime() // OTP expires for good 4 hours later
        );
        return otp.token;
    }

    public async validateOtp(input: OtpValidator): Promise<SuccessResponse> {
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

        console.log(value);
        const obj: Otp = JSON.parse(value);
        console.log('on the other side', obj);
        // const decoded = decode(obj.secret);
        // console.log('decoded secret is', decoded);

        // is otp expired
        const cutoff = new Date(obj.expirationTime),
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
        // const secret = process.env.OTP_SECRET + userId.replaceAll('-', '');
        // const secret = (
        //     process.env.OTP_SECRET +
        //     userId
        //         .replaceAll('-', '')
        //         .toLowerCase()
        //         .replaceAll('w', '')
        //         .replaceAll('x', '')
        //         .replaceAll('z', '')
        //         .replaceAll('y', '')
        //         .substring(0, 4)
        // ).toUpperCase(); // unique but secret
        // const secret =
        //     process.env.OTP_SECRET +
        //     obj.userId.replaceAll('-', '').substring(0, 4);

        // console.log('mysecret: ', secret);

        const isValid = authenticator.verify({
            secret: obj.secret,
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
