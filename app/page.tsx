import Testimonial from "@/components/website/Testimonial";
import NotificationBar from "@/components/website/NotificationBar";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <NotificationBar />
      <section
        className="w-full min-h-screen flex flex-col items-center bg-cover bg-center"
        style={{ backgroundImage: "url('/website/hero.jpg')" }}
      >
        <div className="absolute z-10 w-full h-full flex items-end justify-start pb-16 pl-4 md:pl-8">
          <div className="w-full max-w-[1260px] bg-amber-50">
            {/* Add your hero content here */}dd
          </div>
        </div>
      </section>
      <Testimonial />
    </>
  );
}
