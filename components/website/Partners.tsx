import Image from "next/image";

const Partners = () => {
  return (
    <section className="hidden w-full partners-bg h-[100px] md:flex items-center justify-center overflow-hidden">
      <div className="marquee flex items-center">
        <span className="marquee-text">
          <Image
            src="/website/partner1.svg"
            alt="Partner Logo 1"
            width={178.54827880859375}
            height={36.29032516479492}
          />
        </span>
        <span className="marquee-text">
          <Image
            src="/website/partner2.svg"
            alt="Partner Logo 2"
            width={178.54827880859375}
            height={36.29032516479492}
          />
        </span>
        <span className="marquee-text">
          <Image
            src="/website/partner3.svg"
            alt="Partner Logo 3"
            width={178.54827880859375}
            height={36.29032516479492}
          />
        </span>
        <span className="marquee-text">
          <Image
            src="/website/partner4.svg"
            alt="Partner Logo 4"
            width={178.54827880859375}
            height={36.29032516479492}
          />
        </span>
        <span className="marquee-text">
          <Image
            src="/website/partner5.svg"
            alt="Partner Logo 5"
            width={178.54827880859375}
            height={36.29032516479492}
          />
        </span>
        <span className="marquee-text">
          <Image
            src="/website/partner6.svg"
            alt="Partner Logo 6"
            width={178.54827880859375}
            height={36.29032516479492}
          />
        </span>
        <span className="marquee-text">
          <Image
            src="/website/partner7.svg"
            alt="Partner Logo 7"
            width={178.54827880859375}
            height={36.29032516479492}
          />
        </span>
      </div>
    </section>
  );
};

export default Partners;
