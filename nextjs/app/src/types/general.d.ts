export type TUserRole = 'guest' | 'admin' | 'student' | 'teacher';

export interface INavigation {
  title: string;
  href: string;
  role: TUserRole[];
}
