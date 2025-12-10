import Button from "./Button";

const About = () => {
  return (
    <section className="bg-[#0F0F0F]">
      <div className="w-full max-w-[1260px] mx-auto px-3 py-20 text-white flex flex-col  gap-8">
        <h2 className="story-lead-text">
          Golf4Community <br />
          <span>Connects</span> golf lovers.
        </h2>

        <div className="flex items-center flex-col justify-center lg:flex-row gap-4 mt-10 border py-10">
          <div className="flex flex-col w-full gap-8">
            <h4 className="story-title">ABOUT US</h4>
            <p className="story-description">
              Golf4Community is built for{" "}
              <span>
                golf <br /> lovers
              </span>{" "}
              who want more than just a round
            </p>
            <p className="story-text">
              We connect players, build local communities, and{" "}
              <br className="hidden lg:flex" /> support youth golf development.
              Whether you&apos;re a <br className="hidden lg:flex" /> casual
              weekend player or a competitive golfer, G4C{" "}
              <br className="hidden lg:flex" /> gives you a place to belong,
              compete, and give back.
            </p>

            <Button
              href="#"
              label="Read Full Story"
              width="186px"
              borderColor="#FFD700"
              backgroundColor="#FFD700"
              textColor="#0D1101"
              height="59px"
              className="join-community-now-btn mt-10"
            />
          </div>

          <div
            className="bg-cover bg-center"
            style={{ backgroundImage: "url('/website/hero.jpg')" }}
          ></div>
          <div></div>
        </div>
      </div>
    </section>
  );
};

export default About;
