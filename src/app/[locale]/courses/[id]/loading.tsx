/** Skeleton shown while a course page is rendered on the server. */
export default function CourseLoading() {
  const bar = 'animate-pulse rounded-xl bg-fg/10';
  return (
    <section aria-busy aria-label="Loading" className="bg-bg pt-28 pb-16 text-fg md:pt-36">
      <div className="container-x">
        <div className={`${bar} h-4 w-40`} />
        <div className={`${bar} mt-6 h-12 w-full max-w-2xl`} />
        <div className={`${bar} mt-3 h-12 w-2/3 max-w-xl`} />
        <div className={`${bar} mt-6 h-5 w-full max-w-lg`} />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-4">
            <div className={`${bar} h-40 w-full`} />
            <div className={`${bar} h-24 w-full`} />
            <div className={`${bar} h-24 w-full`} />
          </div>
          <div className={`${bar} h-72 w-full`} />
        </div>
      </div>
    </section>
  );
}
