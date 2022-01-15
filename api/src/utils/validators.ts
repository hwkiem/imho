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

// export const validateFlagInput = (
//     input: FlagInput
// ): FieldError | ProcessedFlag => {
//     // make sure category matches topic, and dont put both on a single flag
//     if (
//         (input.category == FlagTypes.RED && !input.red_topic) ||
//         (input.category == FlagTypes.GREEN && !input.green_topic) ||
//         (input.green_topic && input.red_topic)
//     ) {
//         return {
//             field: 'FlagInput',
//             message: 'malformed query',
//         };
//     }
//     // assign correct topic to generic 'topic'
//     if (input.category == FlagTypes.RED && input.red_topic)
//         return { category: input.category, topic: input.red_topic };
//     else if (input.category == FlagTypes.GREEN && input.green_topic)
//         return { category: input.category, topic: input.green_topic };

//     return {
//         field: 'validateFlagInput',
//         message: 'eof',
//     };
// };
