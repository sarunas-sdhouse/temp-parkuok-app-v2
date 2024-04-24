import * as yup from 'yup';

import { emailPattern } from 'utils/helpers';
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

export const userSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(1, 'errors.required')
    .matches(/^[a-zA-Z0-9ąčęėįšųūžĄČĘĖĮŠŲŪŽ ]*$/, 'errors.invalidCharacters')
    .required('errors.required'),
  email: yup
    .string()
    .matches(emailPattern, 'errors.invalidEmail')
    .required('errors.required'),
  password: yup
    .string()
    .required('errors.required')
    .matches(passwordRegex, 'errors.passwordRequirements'),
  repeatPassword: yup
    .string()
    .required('errors.required')
    .oneOf([yup.ref('password')], 'errors.passwordMustMatch'),
});
export const userLoginSchema = yup.object().shape({
  email: yup
    .string()
    .matches(emailPattern, 'errors.invalidEmail')
    .required('errors.required'),
  password: yup.string().required('errors.required'),
});

export const updateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(1, 'errors.required')
    .matches(/^[a-zA-Z0-9ąčęėįšųūžĄČĘĖĮŠŲŪŽ ]*$/, 'errors.invalidCharacters')
    .required('errors.required'),
  email: yup
    .string()
    .matches(emailPattern, 'errors.invalidEmail')
    .required('errors.required'),
  password: yup
    .string()
    .optional()
    .nullable()
    .test('passwordRegex', 'errors.passwordRequirements', function (value) {
      if (!value) {
        return true; // bypasses the validation if password is empty
      }
      return passwordRegex.test(value);
    }),
  confirmPassword: yup
    .string()
    .optional()
    .nullable()
    .when('password', (password, schema) => {
      if (password && password.length > 0) {
        return schema.oneOf([yup.ref('password')], 'errors.passwordMustMatch');
      }
      return schema;
    }),
});

export const userForgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .matches(emailPattern, 'errors.invalidEmail')
    .required('errors.required'),
});

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required('errors.required'),
  newPassword: yup
    .string()
    .required('errors.required')
    .matches(passwordRegex, 'errors.passwordRequirements'),
  repeatPassword: yup
    .string()
    .required('errors.required')
    .oneOf([yup.ref('newPassword')], 'errors.passwordMustMatch'),
});

export const newPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required('errors.required')
    .matches(passwordRegex, 'errors.passwordRequirements'),
  repeatPassword: yup
    .string()
    .required('errors.required')
    .oneOf([yup.ref('newPassword')], 'errors.passwordMustMatch'),
});
