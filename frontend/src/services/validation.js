import * as Yup from 'yup';

export const REGISTRATION_SCHEMA = Yup.object({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required'),

  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),

  phone: Yup.string()
    .matches(/^\d{10}$/, 'Phone must be exactly 10 digits')
    .required('Phone number is required'),

  address: Yup.string()
    .min(5, 'Address must be at least 5 characters')
    .required('Address is required'),

  gender: Yup.string()
    .oneOf(['male', 'female', 'other'], 'Select a valid gender')
    .required('Gender is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const LOGIN_SCHEMA = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});
