import * as yup from 'yup';

export const addTokensSchema = yup.object().shape({
  amount: yup.number().typeError('errors.mustByNumber').required('errors.required').min(10, 'errors.minAmount').test(
    'two-decimals',
    'errors.maxTwoDecimals',
    value => {
      if (value === null || value === undefined) {
        return false;
      }
      
      const parts = value.toString().split('.');
      if (parts.length === 1) return true;
      if (parts.length > 2 || parts[1].length > 2) return false;

      return true;
    }
  )
});
