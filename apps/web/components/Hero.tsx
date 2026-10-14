import Subscriber from "./Subscriber";

function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl dark:text-white">
            Stories, <span className="text-amber-900">ideas</span>, and
            perspectives that matter.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg dark:text-neutral-400">
            Explore practical insights, technology, programming, and ideas that
            help you learn, grow, and see things differently.
          </p>
          <Subscriber />
        </div>
      </div>
    </section>
  );
}

export default Hero;
