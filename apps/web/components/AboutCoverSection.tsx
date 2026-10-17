const AboutCoverSection = () => {
  return (
    <section className="w-full border-b-2 border-dark dark:border-neutral-800 text-dark dark:text-light">
      <div className="mx-auto max-w-4xl px-5 xs:px-10 py-16 md:py-28 flex flex-col items-start">
        <h2 className="font-bold text-4xl xs:text-5xl md:text-6xl sxl:text-7xl leading-tight">
          Full-Stack Developer
        </h2>

        <p className="mt-8 text-base md:text-xl leading-relaxed max-w-2xl opacity-90">
          Hey, I&apos;m Ebisi Chinecherem Leonard, but you can call me Leo.
          I&apos;m a full-stack developer interested in building scalable web
          applications and designing systems that can handle growth without
          compromising performance or reliability. I work across the stack, from
          creating clean, intuitive interfaces to developing APIs, managing
          databases, and designing the backend architecture that brings
          everything together.
        </p>
        <p className="mt-8 text-base md:text-xl leading-relaxed max-w-2xl opacity-90">
          I enjoy understanding how systems work, making thoughtful technical
          decisions, and finding practical solutions to complex problems. Beyond
          writing code, I care about system design, maintainability, security,
          and building software that can evolve as its users and requirements
          grow. I&apos;m continuously improving my skills and exploring better
          ways to engineer reliable software that solves real problems and
          creates lasting value.
        </p>
      </div>
    </section>
  );
};

export default AboutCoverSection;
