import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const Blog1 = () => {
  const [shops, setShops] = useState(
    Array.from({ length: 4 }, () => ({
      name: '',
      description: ''
    }))
  );

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/getAllShops`);
        setShops(response.data);
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };

    fetchShops();
  }, []);

  return (
    <div className="w-full pt-20 lg:py-10">
      <div className="container mx-auto flex flex-col gap-14 ">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="font-regular max-w-xl text-3xl tracking-tighter md:text-5xl">
            Visit Shops
          </h4>
        </div>
        <div className="-mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4">
          {shops.map((shop, index) => (
            <div
              key={index}
              className="flex cursor-pointer flex-col gap-2 hover:opacity-75"
            >
              <div className="mb-4 aspect-video rounded-md bg-muted"></div>
              <h3 className="text-xl tracking-tight">{shop.name}</h3>
              <p className="text-base text-muted-foreground">
                {shop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
