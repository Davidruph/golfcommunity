import Image from 'next/image'
import { FaPlay } from 'react-icons/fa6'

const Why = () => {
  return (
    <section className="w-full bg-[#EEEBE5] py-5">
      <div className="flex justify-center px-3">
        <div className="w-full max-w-[1259px] py-20 flex flex-col gap-5 items-center justify-center">
          <div className="flex flex-col gap-5 items-center justify-center lg:flex-row">
            <div className="flex flex-col w-full justify-between gap-10 lg:gap-20">
              <div className="flex flex-col gap-5">
                <h2 className="why-header">Why?</h2>
                <p className="why-description">
                  Golf4Community exists to bring golfers together, strengthen{' '}
                  <br className="hidden lg:flex" />
                  neighborhoods, and support youth through the game we all love. We&apos;re
                  <br className="hidden lg:flex" /> building a place where connection, confidence,
                  and community grow with <br className="hidden lg:flex" />
                  every round.
                </p>
              </div>

              <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex flex-col gap-5 w-full">
                  <p className="mission-head">Our Vision</p>
                  <p className="mission-desc">
                    To create a welcoming and inspiring environment where golfers of all levels can
                    meet, play, grow, and give back to the communities they belong to.
                  </p>
                </div>

                <div className="flex flex-col gap-5 w-full">
                  <p className="mission-head">Our Value</p>
                  <p className="mission-desc">
                    To be a trusted home for community golf: blending connection, friendly
                    competition, and purpose while empowering players and uplifting youth.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <Image
                src="/website/whyimage.svg"
                alt="Why Image"
                width={599}
                height={634}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-20">
            <p className="mission-head-main bg-white rounded-[100px] py-2 px-[22px] mb-5">
              Our Mission
            </p>
            <p className="mission-desc-main">
              Our mission is to strengthen communities through golf by creating opportunities for
              connection, learning, and giving back. G4C is built to help golfers engage with each
              other, support local youth, and bring the spirit of togetherness back to the sport.
            </p>
          </div>

          <div
            className="bg-cover bg-center w-full h-[400px] md:h-[689px] max-w-[1260px] mt-24 flex items-center justify-center"
            style={{
              backgroundImage: "url('/website/community7.jpg')",
              backgroundColor: '#0D110147',
              backgroundBlendMode: 'darken',
            }}
          >
            <div className=" w-[221px] h-[125px] bg-white flex flex-col gap-4 items-center justify-center">
              <FaPlay color="#52582E" />
              <p className="community-video-text">Watch how it works</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Why
