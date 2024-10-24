import Link from 'next/link';
import Image from 'next/image';
import Logowhite from '@/public/LOGO_1-removebg-preview.png';

export const Footer1 = () => {
  return (
    <div className="w-full bg-foreground py-5 text-background lg:py-0">
      <div className="container mx-auto">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="-mb-5 flex flex-col items-start  gap-5 lg:mb-0">
            <h2 className="font-regular max-w-xl text-left text-3xl tracking-tighter md:text-5xl">
              <Image src={Logowhite} alt="campick logo" width={130} />
            </h2>
          </div>
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <p className="text-background/75">Meet the team:</p>
            <ul className="flex flex-col gap-1 lg:flex lg:flex-row lg:gap-3">
              <li>
                <Link
                  href="https://github.com/asghar4415"
                  target="_blank"
                  className="text-background/75 hover:underline"
                >
                  Asghar Ali
                </Link>
              </li>
              <li className="hidden text-background/75 lg:block">|</li>
              <li>
                <Link
                  href="https://github.com/abdullahshafiq-20/"
                  className="text-background/75 hover:underline"
                >
                  Hafiz M.Abdullah
                </Link>
              </li>
              <li className="hidden text-background/75 lg:block">|</li>
              <li>
                <Link
                  href="https://github.com/Apexvirus"
                  className="text-background/75 hover:underline"
                >
                  Muhammad Bilal
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
