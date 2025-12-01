'use client';

// components/custom/AlertDialog.tsx
import {
  AlertDialog as ShadcnAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export interface IAlertDialogCustomProps {
  buttonText: string;
  title: string;
  description: string;
  handleCancel?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleAction: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function AlertDialogCustom({
  buttonText,
  title,
  description,
  handleCancel,
  handleAction,
}: IAlertDialogCustomProps) {
  return (
    <ShadcnAlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          {buttonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} className="cursor-pointer">
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAction} className="cursor-pointer">
            Tiếp Tục
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </ShadcnAlertDialog>
  );
}
