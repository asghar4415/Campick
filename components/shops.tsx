import React, { forwardRef } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Remove if not used

// Sample menu items array
const menuItems = [
  {
    title: 'Pay supplier invoices',
    description:
      'Our goal is to streamline SMB trade, making it easier and faster than ever.'
  },
  // Add more items as needed
  {
    title: 'Manage inventory',
    description: 'Efficiently keep track of stock levels and orders.'
  },
  {
    title: 'Process payments',
    description: 'Securely handle transactions with ease.'
  },
  {
    title: 'Customer support',
    description: 'Provide timely assistance to enhance customer satisfaction.'
  },
  {
    title: 'Analyze sales data',
    description: 'Gain insights from sales analytics to improve performance.'
  },
  {
    title: 'Generate reports',
    description: 'Create comprehensive reports for informed decision-making.'
  }
];

export const ShopDisplay = forwardRef((props, ref) => {
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
            {menuItems.map((item, index) => (
              <div className="flex flex-col gap-2" key={index}>
                <div className="mb-2 aspect-video rounded-md bg-muted"></div>
                <h3 className="text-xl tracking-tight">{item.title}</h3>
                <p className="text-base text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

// Adding display name for better debugging
ShopDisplay.displayName = 'ShopDisplay';
