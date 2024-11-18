import React, { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const OtpVerify = ({ closeModal }: { closeModal: () => void }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  const otpverification = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${API_URL}/api/verifyOTP`,
        { otp },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess('OTP verified successfully!');
      setError('');
      // console.log(response.data);
      window.location.reload();
    } catch (error: any) {
      setSuccess('');
      setError(error.response?.data?.message || 'Failed to verify OTP.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim() === '') {
      setError('OTP is required.');
      return;
    }
    otpverification();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-80 rounded-lg bg-white p-6 text-center shadow-lg">
        {/* Close Button */}
        <button
          className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
          onClick={closeModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Email Verification
        </h2>
        <p className="mb-6 text-gray-600">
          Please verify your email by entering the OTP sent to your email.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            className="mb-3 w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            type="submit"
            className={buttonVariants({ variant: 'default', size: 'default' })}
          >
            Submit OTP
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        {/* Success Message */}
        {success && <p className="mt-3 text-sm text-green-500">{success}</p>}
      </div>
    </div>
  );
};

export default function VerifyEmailModal() {
  const [showOtpVerify, setShowOtpVerify] = useState(false);

  return (
    <>
      {showOtpVerify ? (
        <OtpVerify closeModal={() => setShowOtpVerify(false)} />
      ) : (
        <div className="flex items-center justify-between bg-white p-4 shadow-lg">
          <p className="text-sm text-gray-600">
            Please verify your email to continue using your account.
          </p>
          <button
            className={buttonVariants({ variant: 'default', size: 'default' })}
            onClick={() => setShowOtpVerify(true)}
          >
            Verify
          </button>
        </div>
      )}
    </>
  );
}
