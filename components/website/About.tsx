import Image from "next/image";
import Button from "./Button";
import { MdOutlineArrowOutward } from "react-icons/md";


const About = () => {
  return (
    <section className="w-full bg-[#0F0F0F]">
      <div className="flex justify-center px-3">
        <div className="w-full max-w-[1259px] py-20 text-white flex flex-col gap-8">
          <h2 className="story-lead-text text-[40px] lg:text-[60px] font-semibold leading-[110%]">
            Golf4Community <br className="hidden lg:flex" />
            <span>Connects</span> golf lovers.
          </h2>

          <div className="flex items-center flex-col justify-center lg:flex-row gap-16 mt-10 py-10">
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
                <br className="hidden lg:flex" /> support youth golf
                development. Whether you&apos;re a{" "}
                <br className="hidden lg:flex" /> casual weekend player or a
                competitive golfer, G4C <br className="hidden lg:flex" /> gives
                you a place to belong, compete, and give back.
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
              className="relative bg-cover bg-center w-full h-[650px] max-w-[420px]"
              style={{ backgroundImage: "url('/website/story-bg.svg')" }}
            >
              <div className="absolute top-5 left-5 flex gap-2 px-3">
                <div className="flex flex-col gap-3">
                  <p className="story-bg-header">Building Stronger Golf Communities</p>
                  <p className="story-bg-desc">Powered by passion, connection, and purpose.</p>
                </div>

                <Button
                href="#"
                label=""
                width="60px"
                borderColor="#fff"
                backgroundColor="#fff"
                textColor="#0D1101"
                height="60px"
                icon={<MdOutlineArrowOutward color="#0D1101" size={30} />}
              />
              </div>
            </div>

            <div className="w-full flex flex-col gap-10">
              <div className="flex flex-col gap-5">
                <Image src="/website/storyicon1.svg" alt="Story Icon 1" width={60} height={60} />
                <p className="story-icon-text">Connect in Real Time</p>
                <p className="story-icon-description">Follow updates, join nearby golf groups, and stay in sync with your local community, all from one platform.</p>
              </div>

              <hr className="border border-[gray] w-full"/>

              <div className="flex flex-col gap-5">
                <Image src="/website/storyicon2.svg" alt="Story Icon 2" width={60} height={60} />
                <p className="story-icon-text">Fuelling the Future of Golf</p>
                <p className="story-icon-description">Every membership helps sponsor young golfers, expand access, and grow the game for the next generation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
