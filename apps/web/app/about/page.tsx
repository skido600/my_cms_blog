import AboutCoverSection from "../../components/AboutCoverSection";

import Me from "../../components/Me";
import Skills from "../../components/Skills";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "About Leo",
  description: "details about leo wave | Ebisi Leonard ",
};
function About() {
  return (
    <>
      <AboutCoverSection />;
      <Skills />
      <Me />
    </>
  );
}

export default About;
