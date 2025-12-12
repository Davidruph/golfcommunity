import Testimonial from "@/components/website/Testimonial";
import NotificationBar from "@/components/website/NotificationBar";
import Image from "next/image";
import Button from "@/components/website/Button";
import Partners from "@/components/website/Partners";
import About from "@/components/website/About";
import Rating from "@/components/website/Rating";

export default function Home() {
  return (
    <>
      <NotificationBar />
      <section
        className="w-full min-h-screen flex justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/website/hero.jpg')" }}
      >
        <div className="relative z-10 w-full max-w-[1259px] flex items-end justify-start pb-32 pl-4 md:pl-8">
          <div className="flex flex-col gap-6 md:gap-6 text-white">
            <h1 className="hero-text-lead text-[40px] md:text-[60px] lg:text-[88px]">
              Connecting Golfers. <br />
              <span>Empowering</span> Communities
            </h1>

            <p className="hero-description text-[16px] md:text-[20px]">
              Join a growing network of passionate golfers shaping{" "}
              <br className="hidden md:flex" /> the future of community golf.
            </p>

            <div className="flex flex-col md:flex-row gap-3 w-full">
              <Button
                href="#"
                label="Join a community"
                width="206px"
                borderColor="#FFD700"
                backgroundColor="#FFD700"
                textColor="#0D1101"
                height="59px"
                className="join-community-now-btn"
              />

              <Button
                href="#"
                label="Sponsor Youth Golf"
                width="206px"
                borderColor="#FFFFFF"
                backgroundColor="transparent"
                textColor="#FFFFFF"
                height="59px"
                className="join-community-now-btn"
              />
            </div>
          </div>
        </div>
      </section>

      <Partners />
      <About />
      <Rating />
      <Testimonial />
    </>
  );
}
