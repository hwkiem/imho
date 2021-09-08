import {
    PartialReview,
    RegisterInput,
    WriteReviewInput,
} from '../types/input_types';
import { FieldError } from '../types/object_types';

export const validateRegister = (
    options: RegisterInput
): FieldError[] | null => {
    if (!options.email.includes('@')) {
        return [
            {
                field: 'email',
                message: 'invalid email',
            },
        ];
    }

    if (options.password.length <= 2) {
        return [
            {
                field: 'password',
                message: 'length must be greater than 2',
            },
        ];
    }

    return null;
};

export const validateWriteReviewInput = (
    input: WriteReviewInput | PartialReview
): FieldError | null => {
    if (input.bath_count && input.bath_count % 0.5 != 0) {
        return { field: 'bath_count', message: 'incremenets of .5!' };
    }
    return null;
};

// export const validateWriteReviewInput = (
//     options: WriteReviewInput
// ): WriteReviewInput | undefined => {

//     return;
// };
