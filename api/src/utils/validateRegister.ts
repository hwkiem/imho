import { FieldError, RegisterInput } from '../types';

// Ben's, can edit however our form requires
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

