import Link from 'next/link';
import { INavigation } from '../../types/general';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

const NavigationHeader = ({ filterNavigations }: { filterNavigations: INavigation[] }) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {filterNavigations.map((navigationItem, index) => (
          <NavigationMenuItem key={index} className="min-w-15 text-center">
            <NavigationMenuLink asChild>
              <Link href={navigationItem.href}>{navigationItem.title}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationHeader;
