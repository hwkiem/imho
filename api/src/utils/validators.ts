import { RegisterInput } from '../types/input_types';
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

// export const validateWriteReviewInput = (
//     options: WriteReviewInput
// ): WriteReviewInput | undefined => {

//     return;
// };
