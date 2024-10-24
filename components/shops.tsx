import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import React, { forwardRef } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ShopDisplay = forwardRef((props, ref) => {
  const router = useRouter();

  const [shops, setShops] = useState([]);

  return (
    <div ref={ref} className="w-full py-10">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="font-regular max-w-xl text-left text-3xl tracking-tighter md:text-5xl">
                Menu Items
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-2">
              <div className="mb-2 aspect-video rounded-md bg-muted"></div>
              <h3 className="text-xl tracking-tight">Pay supplier invoices</h3>
              <p className="text-base text-muted-foreground">
                Our goal is to streamline SMB trade, making it easier and faster
                than ever.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="mb-2 aspect-video rounded-md bg-muted"></div>
              <h3 className="text-xl tracking-tight">Pay supplier invoices</h3>
              <p className="text-base text-muted-foreground">
                Our goal is to streamline SMB trade, making it easier and faster
                than ever.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="mb-2 aspect-video rounded-md bg-muted"></div>
              <h3 className="text-xl tracking-tight">Pay supplier invoices</h3>
              <p className="text-base text-muted-foreground">
                Our goal is to streamline SMB trade, making it easier and faster
                than ever.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="mb-2 aspect-video rounded-md bg-muted"></div>
              <h3 className="text-xl tracking-tight">Pay supplier invoices</h3>
              <p className="text-base text-muted-foreground">
                Our goal is to streamline SMB trade, making it easier and faster
                than ever.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="mb-2 aspect-video rounded-md bg-muted"></div>
              <h3 className="text-xl tracking-tight">Pay supplier invoices</h3>
              <p className="text-base text-muted-foreground">
                Our goal is to streamline SMB trade, making it easier and faster
                than ever.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="mb-2 aspect-video rounded-md bg-muted"></div>
              <h3 className="text-xl tracking-tight">Pay supplier invoices</h3>
              <p className="text-base text-muted-foreground">
                Our goal is to streamline SMB trade, making it easier and faster
                than ever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
