'use client';

import AlertDialogCustom, { IAlertDialogCustomProps } from '@/components/custom/AlertDialogCustom';
import HeaderComponent from '@/components/Header';
import { Button } from '@/components/ui/button';
import { TypographyLarge } from '@/components/ui/typography';
import { toast } from 'react-toastify';
import * as TestType from '@/components/ui/typography';

export default function AlertDialogDemo() {
  const props: IAlertDialogCustomProps = {
    buttonText: 'nộp bài',
    title: 'Xác nhận nộp bài',
    description: 'Bạn có chắc chắn muốn nộp bài không?',
    handleAction: () => {
      console.log('Action confirmed');
    },
  };

  return (
    <div>
      <HeaderComponent />
      <AlertDialogCustom {...props} />
      <Button
        className="mt-4"
        onClick={() => {
          toast.success('This is a success message!');
          toast.error('This is a error message!');
          toast.info('This is a info message!');
          toast.warning('This is a warning message!');
          toast.warn('This is a default message!');
          toast.update('This is a dark message!');
        }}
      >
        Toastify Button
      </Button>
      <Button>New Button</Button>
      <TypographyLarge>Welcome to ff</TypographyLarge>
      <TestType.TypographyH1>
        Chào mừng bạn đến với nền tảng thi trực tuyến của Trung Tâm Hiếu Học - H1
      </TestType.TypographyH1>
      <TestType.TypographyH2>
        Chào mừng bạn đến với nền tảng thi trực tuyến của Trung Tâm Hiếu Học - H2
      </TestType.TypographyH2>
      <TestType.TypographyH3>
        Chào mừng bạn đến với nền tảng thi trực tuyến của Trung Tâm Hiếu Học - H3
      </TestType.TypographyH3>
      <TestType.TypographyH4>
        Chào mừng bạn đến với nền tảng thi trực tuyến của Trung Tâm Hiếu Học - H4
      </TestType.TypographyH4>
      <TestType.TypographyBlockquote>
        Chào mừng bạn đến với nền tảng thi trực tuyến của Trung Tâm Hiếu Học - TypographyBlockquote
      </TestType.TypographyBlockquote>
      <TestType.TypographyLarge>
        Chào mừng bạn đến với nền tảng thi trực tuyến của Trung Tâm Hiếu Học - TypographyLarge
      </TestType.TypographyLarge>
      <TestType.TypographySmall>
        Chào mừng bạn đến với nền tảng thi trực tuyến của Trung Tâm Hiếu Học - TypographySmall
      </TestType.TypographySmall>
      <TestType.TypographyMuted>
        Chào mừng bạn đến với nền tảng thi trực tuyến của Trung Tâm Hiếu Học - TypographyMuted
      </TestType.TypographyMuted>
      <TestType.TypographyLead>
        Chào mừng bạn đến với nền tảng thi trực tuyến của Trung Tâm Hiếu Học - TypographyLead
      </TestType.TypographyLead>
      <TestType.TypographyP>
        Chào mừng bạn đến với nền tảng thi trực tuyến của Trung Tâm Hiếu Học - TypographyP
      </TestType.TypographyP>
      <TestType.TypographyList>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </TestType.TypographyList>
    </div>
  );
}
