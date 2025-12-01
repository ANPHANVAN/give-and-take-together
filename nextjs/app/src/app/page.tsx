import HeaderComponent from '@/components/Header';
import { Loading } from '@/components/Loading';
import MiniLoading from '@/components/MiniLoading';

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <HeaderComponent />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* <MiniLoading /> */}
        {/* <Loading /> */}
      </main>
    </div>
  );
}
