import { Loader2Icon } from 'lucide-react';
const MiniLoading = () => {
  return (
    <section className="fixed top-1/2 left-1/2 z-20 flex items-center justify-center">
      <div className="-translate-x-1/2 flex flex-wrap items-center justify-center gap-4">
        <button className="gap-2 z-40 flex items-center justify-center text-lg">
          <Loader2Icon role="status" aria-label="Loading" className={'size-5 animate-spin'} />
          <p>Loading...</p>
        </button>
      </div>
    </section>
  );
};

export default MiniLoading;
