'use client';

import Image from 'next/image';
import Link from 'next/link';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { useIsMobile } from '@/hooks/use-mobile';

import { INavigation, TUserRole } from '@/types/general';
import { GearToolComponent } from './childComponents/GearTool';
import { SheetSideHeader } from './childComponents/SheetSideHeader';
import NavigationHeader from './childComponents/NavigationHeader';
import navigations from '@/data/navigationData';

const HeaderComponent = ({ role = 'guest' }: { role?: TUserRole }) => {
  const filterNavigations: INavigation[] = navigations.filter((navivation) =>
    navivation.role.some((roleItem) => role === roleItem)
  );
  const isMobile = useIsMobile();

  return (
    <header className="bg-blue-100/50 sticky top-0 z-40 flex h-14 items-center justify-between px-3">
      {/* Logo */}
      <div className="flex w-auto max-w-full items-center pr-4">
        <Link href="/" className="w-20 mx-2 text-left text-xl text-white hover:text-blue-300 dark:hover:text-blue-300">
          <AspectRatio ratio={16 / 9} className="">
            <Image
              src="/images/logo-trung-tam-hieu-hoc.png"
              alt="Hiếu Học"
              fill
              className="rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </AspectRatio>
        </Link>
      </div>

      {/* Navigations */}
      {!isMobile && <NavigationHeader filterNavigations={filterNavigations} />}

      {/* Tool & Login */}
      <div className="flex items-center justify-start">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/login">Đăng Nhập</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <GearToolComponent />

        {/* Navigation Button Smartphone */}
        {isMobile && <SheetSideHeader filterNavigations={filterNavigations} />}
      </div>
    </header>
  );
};

export default HeaderComponent;
