import Image from "next/image";

const AboutCoverSection = () => {
  return (
    <section className="w-full md:h-[75vh] border-b-2 border-dark dark:border-neutral-800 flex flex-col md:flex-row items-center justify-center text-dark dark:text-light">
      {/* Image Side */}
      <div className="w-full md:w-1/2 h-full border-r-2 border-dark dark:border-neutral-800 flex justify-center">
        <Image
          width={400}
          height={400}
          src="/character-removebg-preview.png"
          alt="Leowave"
          className="w-4/5 xs:w-3/4 md:w-full h-full object-contain object-center"
        />
      </div>

      {/* Text Side */}
      <div className="w-full md:w-1/2 flex flex-col items-start justify-center px-5 xs:p-10 pb-10 lg:px-16">
        <h2 className="font-bold capitalize text-4xl xs:text-5xl sxl:text-6xl text-center lg:text-left">
          Full-Stack Developer 💻
        </h2>
        <p className="font-medium capitalize mt-4 text-sm lg:text-xl">
          I&apos;m Leonard, a developer who enjoys turning ideas into real,
          working products. I build web applications, work with frontend and
          backend technologies, and enjoy solving problems through code.
          I&apos;m always learning, trying new things, and finding better ways
          to build software that people can actually use. For me, every project
          is an opportunity to improve my skills and create something
          meaningful.
        </p>
      </div>
    </section>
  );
};

export default AboutCoverSection;
