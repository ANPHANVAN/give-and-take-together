import { Loader2Icon } from 'lucide-react';

export const Loading = () => {
  return (
    <section className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button className="text-lg bg-primary-from inline-flex h-12 items-center justify-center gap-2.5 rounded-lg px-6 py-3 font-medium text-white dark:hidden">
            <Loader2Icon role="status" aria-label="Loading" className={'size-5 animate-spin'} />
            Loading...
          </button>

          <button className="text-lg border-stroke text-dark dark:border-dark-3 hidden h-12 items-center justify-center gap-2.5 rounded-lg border bg-transparent px-6 py-3 font-medium dark:inline-flex dark:text-white">
            <Loader2Icon role="status" aria-label="Loading" className={'size-5 animate-spin'} />
            Loading...
          </button>
        </div>
      </div>
    </section>
  );
};
