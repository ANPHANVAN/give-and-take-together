import { INavigation } from '@/types/general';

const navigations: INavigation[] = [
  {
    title: 'Trang Chủ',
    href: '/home',
    role: ['student', 'guest', 'admin', 'teacher'],
  },
  {
    title: 'Thi',
    href: '/test',
    role: ['student', 'guest', 'admin', 'teacher'],
  },
  {
    title: 'Lớp học',
    href: '/classroom',
    role: ['student', 'guest', 'admin', 'teacher'],
  },
];

export default navigations;
