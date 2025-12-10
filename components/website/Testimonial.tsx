import Image from "next/image";

const Testimonial = () => {
  return (
    <section className="w-full bg-[#EEEBE5]">
      <div className="flex flex-col items-center justify-center gap-8 w-full max-w-[984px] mx-auto pt-20 pb-30 px-4 text-center">
        <h1 className="testimonial-text text-[24px] md:text-[48px] lg:text-[72px]">
          “I love that it&apos;s more than just a game here. Every match helps
          support youth golf.”
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-8 mt-4 justify-center flex-wrap">
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="relative group">
              <Image
                className="h-[94px] w-20 md:w-24 object-cover rounded-lg"
                src="/website/testimonial1.jpg"
                alt="Testimonial from Sarah W."
                width={88}
                height={94}
              />
              <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"></div>
            </div>
            <div>
              <div className="testimonial-name">Sarah W.</div>
              <div className="testimonial-location">Atlanta</div>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="relative group">
              <Image
                className="h-[94px] w-20 md:w-24 object-cover rounded-lg"
                src="/website/testimonial2.jpg"
                alt="Testimonial"
                width={88}
                height={94}
              />
              <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"></div>
            </div>
            <div>
              <div className="testimonial-name">John D.</div>
              <div className="testimonial-location">Chicago</div>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="relative group">
              <Image
                className="h-[94px] w-20 md:w-24 object-cover rounded-lg"
                src="/website/testimonial3.jpg"
                alt="Testimonial"
                width={88}
                height={94}
              />
              <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"></div>
            </div>
            <div>
              <div className="testimonial-name">Mike T.</div>
              <div className="testimonial-location">Austin</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
