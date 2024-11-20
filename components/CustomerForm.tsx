import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CustomerForm = (props) => {
  // Setup our customer
  let customer = props.customer;
  if (!customer) {
    customer = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address1: '',
      suburb: '',
      state: '',
      postcode: '',
      country: ''
    };
  }

  const [checkoutDetails] = useState<any>(customer);

  const validate = (values) => {
    const errors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address1: '',
      suburb: '',
      state: '',
      postcode: '',
      country: '',
      hasErrors: false
    };

    // Validation logic here...

    if (errors.hasErrors) {
      return errors;
    }
    return {};
  };

  const formik = useFormik({
    initialValues: {
      email: checkoutDetails.email,
      phone: checkoutDetails.phone,
      firstName: checkoutDetails.firstName,
      lastName: checkoutDetails.lastName,
      address1: checkoutDetails.address1,
      suburb: checkoutDetails.suburb,
      state: checkoutDetails.state,
      postcode: checkoutDetails.postcode,
      country: checkoutDetails.country
    },
    validate,
    onSubmit: (values) => {
      props.submitForm(values);
    }
  });
  const [userDataa, setUserData] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = response.data;
        setUserData(data);
        console.log('User data fetched: ', data);
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    getUserData();
  }, []);

  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-semibold">
              Email Address
            </label>
            <input
              className="mt-1 rounded-md border border-gray-300 p-2"
              name="email"
              placeholder="Enter email"
              {...formik.getFieldProps('email')}
            />
            {formik.errors.email && (
              <div className="mt-1 text-sm text-red-500">
                {formik.errors.email}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone" className="text-sm font-semibold">
              Phone
            </label>
            <input
              className="mt-1 rounded-md border border-gray-300 p-2"
              name="phone"
              placeholder="Enter phone"
              {...formik.getFieldProps('phone')}
            />
            {formik.errors.phone && (
              <div className="mt-1 text-sm text-red-500">
                {formik.errors.phone}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="firstName" className="text-sm font-semibold">
              First Name
            </label>
            <input
              className="mt-1 rounded-md border border-gray-300 p-2"
              name="firstName"
              placeholder="First name"
              {...formik.getFieldProps('firstName')}
            />
            {formik.errors.firstName && (
              <div className="mt-1 text-sm text-red-500">
                {formik.errors.firstName}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="lastName" className="text-sm font-semibold">
              Last Name
            </label>
            <input
              className="mt-1 rounded-md border border-gray-300 p-2"
              name="lastName"
              placeholder="Last name"
              {...formik.getFieldProps('lastName')}
            />
            {formik.errors.lastName && (
              <div className="mt-1 text-sm text-red-500">
                {formik.errors.lastName}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-right">{props.button}</div>
      </form>
    </div>
  );
};

export default CustomerForm;
