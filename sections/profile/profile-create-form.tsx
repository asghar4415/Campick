'use client';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import axios from 'axios';
import defaultImage from '@/public/shopowner.webp';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfileCreateForm({
  data
}: {
  data: {
    id: string | null;
    user_name: string;
    email: string;
    imageURL: string;
  };
}) {
  const [dataFetched, setDataFetched] = useState({
    firstname: '',
    lastname: '',
    email: '',
    imageURL: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(data.imageURL);

  const methods = useForm({
    defaultValues: {
      firstname: '',
      lastname: '',
      email: data.email
    },
    mode: 'onSubmit' // Validation will run when form is submitted
  });

  useEffect(() => {
    const separateFullname = () => {
      const name = data.user_name.split(' ');
      setDataFetched({
        firstname: name[0],
        lastname: name[1],
        email: data.email,
        imageURL: data.imageURL
      });
    };

    separateFullname();
  }, [data]);

  // When dataFetched is updated, reset the form with the new values
  useEffect(() => {
    if (dataFetched.firstname || dataFetched.lastname || dataFetched.email) {
      methods.reset({
        firstname: dataFetched.firstname,
        lastname: dataFetched.lastname,
        email: dataFetched.email
      });
    }
  }, [dataFetched, methods]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a URL for the uploaded image
      setImagePreview(imageUrl); // Update the preview image with the new URL

      // Update the dataFetched with the new image URL
      setDataFetched((prevState) => ({
        ...prevState,
        imageURL: imageUrl // Ensure the image URL is set
      }));
    }
  };

  // Handle input changes for firstname, lastname, and email
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataFetched((prevState) => ({
      ...prevState,
      [name]: value // Update the specific field in dataFetched
    }));
  };

  const updateProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const user_name = `${dataFetched.firstname || ''} ${
      dataFetched.lastname || ''
    }`;
    const email = dataFetched.email || '';
    const imageURL = dataFetched.imageURL || '';

    try {
      const update = await axios.put(
        `${API_URL}/api/updateProfile`,
        {
          user_name: user_name,
          email: email,
          image_url: imageURL
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (error: any) {
      console.error('Failed to update profile:', error.response || error);
    }
  };

  const onSubmit = async (formData: any) => {
    formData.imageURL = dataFetched.imageURL; // Ensure the imageURL is included in the form data
    await updateProfile(); // Update the profile
  };

  const selectImagePreview = () => {
    // if (imagePreview) {
    //   return imagePreview;
    // } else if (dataFetched.imageURL) {
    //   return dataFetched.imageURL;
    // } else {
    return defaultImage.src;
  };

  return (
    <FormProvider {...methods}>
      <div className="flex items-center justify-between ">
        <Heading title="Profile" description="Manage your profile details" />
      </div>

      <Separator />

      <div className="h-60 w-60 border">
        <img
          src={selectImagePreview()}
          alt="Profile Image"
          className="full h-60 w-60 object-cover"
        />
      </div>

      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="w-full space-y-8">
          <div className="gap-8 md:grid md:grid-cols-3">
            <div className="col-span-2 space-y-4">
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Controller
                    name="firstname"
                    control={methods.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        disabled={!isEditing}
                        value={methods.watch('firstname')}
                        onChange={handleInputChange} // Add the change handler here
                      />
                    )}
                  />
                </FormControl>
                <FormMessage>
                  {methods.formState.errors.firstname && (
                    <span>{methods.formState.errors.firstname.message}</span>
                  )}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Controller
                    name="lastname"
                    control={methods.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        disabled={!isEditing}
                        value={methods.watch('lastname')}
                        onChange={handleInputChange} // Add the change handler here
                      />
                    )}
                  />
                </FormControl>
                <FormMessage>
                  {methods.formState.errors.lastname && (
                    <span>{methods.formState.errors.lastname.message}</span>
                  )}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Controller
                    name="email"
                    control={methods.control}
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value:
                          /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                        message: 'Invalid email format'
                      }
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        disabled={!isEditing}
                        value={methods.watch('email')}
                        onChange={handleInputChange} // Add the change handler here
                      />
                    )}
                  />
                </FormControl>
                <FormMessage>
                  {methods.formState.errors.email && (
                    <span>{methods.formState.errors.email.message}</span>
                  )}
                </FormMessage>
              </FormItem>

              {/* Image Upload Input */}
              {isEditing && (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </FormControl>
                </FormItem>
              )}

              <Button variant="outline" size="sm" onClick={handleEditClick}>
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
