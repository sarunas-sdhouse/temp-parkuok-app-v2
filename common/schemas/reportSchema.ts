import * as yup from 'yup';

import { emailPattern } from 'utils/helpers';

export const reportSchema = yup.object().shape({
  description: yup
    .string()
    .trim()
    .min(1, 'errors.required')
    .required('errors.required'),
  phone: yup
    .string()
    .required('errors.required'),
  email: yup
    .string()
    .matches(emailPattern, 'errors.invalidEmail')
    .required('errors.required'),
});