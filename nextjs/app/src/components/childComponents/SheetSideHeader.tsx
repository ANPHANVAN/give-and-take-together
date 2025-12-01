import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { INavigation } from '../../types/general';

export function SheetSideHeader({ filterNavigations }: { filterNavigations: INavigation[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here. Click save when you&apos;re done.</SheetDescription>
        </SheetHeader>
        <NavigationMenu>
          <NavigationMenuList className="flex flex-col">
            {filterNavigations.map((navigationItem, index) => (
              <NavigationMenuItem key={index} className="min-w-15 text-center">
                <NavigationMenuLink asChild className="text-2xl">
                  <Link href={navigationItem.href}>{navigationItem.title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
