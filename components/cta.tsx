import { MoveRight, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import img2 from '@/public/img-2.png';
import img1 from '@/public/img-1.png';
import Image from 'next/image';

export const CTA1 = () => (
  <div className="w-full py-10 lg:pt-40">
    <div className="container mx-auto">
      <div className="flex justify-around rounded-md bg-muted">
        <div className="flex flex-col items-center gap-8 p-4 text-center lg:p-14">
          <div>{/* <Badge>Get started</Badge> */}</div>
          <div className="flex flex-col gap-2">
            <h3 className="font-regular max-w-xl text-3xl tracking-tighter md:text-5xl">
              This is something <span className="font-bold"> FAST</span>
            </h3>
            <p className="max-w-xl text-lg leading-relaxed tracking-tight text-muted-foreground">
              Get your food fast and easy! Place your order in advance and savor
              your meal without the delay!
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <Button className="gap-4" variant="outline">
              Add to Cart <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button className="gap-4">
              Are you a shop owner? <MoveRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Image src={img1} alt="img2" width={650} height={70} />
      </div>
    </div>
  </div>
);
