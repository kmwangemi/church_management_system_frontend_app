import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex size-full max-w-[50rem] flex-col">
      <main id="content">
        <div className="px-4 py-10 text-center sm:px-6 lg:px-8">
          <h1 className="block font-bold text-7xl text-foreground sm:text-9xl">
            404
          </h1>
          <p className="mt-3 text-muted-foreground">Oops, something went wrong.</p>
          <p className="text-muted-foreground">
            Sorry, we couldn&apos;t find your page.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
            <Link
              className="inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 font-medium text-sm text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
              href="/"
            >
              <svg
                className="size-4 shrink-0"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to home page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
