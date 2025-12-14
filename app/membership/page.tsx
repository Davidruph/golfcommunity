import Button from '@/components/website/Button'
import Rating from '@/components/website/Rating'
import Image from 'next/image'

const Membership = () => {
  return (
    <>
      <section
        className="w-full flex justify-center h-[614px] bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0, 0, 0, 0) -86.07%, rgba(0, 0, 0, 0.5) 100%), url('/website/membershiphero.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'bottom 53% center',
        }}
      >
        <div className="z-10 w-full max-w-[1259px] flex items-center justify-center px-3">
          <div className="flex flex-col gap-6 md:gap-6 text-white items-center text-center">
            <h1 className="hero-text-lead text-[40px] md:text-[60px] lg:text-[88px]">
              Join a Community That
              <br className="hidden lg:flex" />
              Plays With
              <span> Purpose</span>
            </h1>

            <p className="hero-description text-[16px] md:text-[20px]">
              Become a G4C member and unlock meaningful connections, friendly{' '}
              <br className="hidden lg:flex" />
              competition, and the chance to support youth golfers in your community.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#EEEBE5]">
        <div className="flex flex-col items-center justify-center my-20">
          <p className="mission-head-main">Our Mission</p>
          <p className="mission-desc-main">
            Our mission is to strengthen communities through golf by creating{' '}
            <br className="hidden lg:flex" />
            opportunities for connection, learning, and giving back. G4C is
            <br className="hidden lg:flex" /> built to help golfers engage with each other, support
            local youth,
            <br className="hidden lg:flex" /> and bring the spirit of togetherness back to the
            sport.
          </p>
        </div>

        <Rating />

        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-[1260px] relative aspect-video mt-20">
            <Image
              src="/website/explore-bg.png"
              alt="Footer Background"
              fill
              className="w-full h-full object-cover"
              priority
              loading="eager"
            />
            {/* Middle Content Div */}
            <div className="absolute bottom-10 right-10 flex items-center justify-center">
              <div className="bg-white w-full max-w-[580px] p-5 md:p-8 flex flex-col gap-5">
                <h2 className="footer-question text-[30px] md:text-[48px]">Sponsor Youth Golf</h2>

                <p className="footer-question-follow-up">
                  Support the next generation of golfers. Your sponsorship helps kids experience the
                  joy and opportunity of playing golf. When you sponsor a child, you help provide
                  equipment, coaching, and tournament access for deserving young athletes. Every
                  contribution makes an impact.
                </p>

                <Button
                  href="#"
                  label="Sponsor Today"
                  width="186px"
                  borderColor="#FFD700"
                  backgroundColor="#FFD700"
                  textColor="#0D1101"
                  height="59px"
                  className="join-community-now-btn"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0F0F0F] my-20">
        <div className="mt-25 items-center justify-center flex flex-col">
          <p className="steps-header mb-3 mt-20">How G4C Works</p>
          <p className="steps-works-desc">
            G4C makes golf accessible and engaging through a simple, community-driven approach.
          </p>

          <div className="flex flex-col items-center justify-center my-15 gap-5 lg:flex-row pb-20 p-5">
            <div className="w-[292.5px] h-52 bg-white items-center justify-center gap-5 flex flex-col">
              <Image src="/website/archive.svg" alt="step card 1" width={40} height={40} />
              <p className="works-card-text">
                Players join and create <br /> a profile
              </p>
            </div>
            <div className="w-[292.5px] h-52 bg-white items-center justify-center gap-5 flex flex-col">
              <Image src="/website/artboard.svg" alt="step card 1" width={40} height={40} />
              <p className="works-card-text">
                Connect with others by ZIP <br />
                code or community
              </p>
            </div>

            <div className="w-[292.5px] h-52 bg-white items-center justify-center gap-5 flex flex-col">
              <Image src="/website/adzan.svg" alt="step card 1" width={40} height={40} />
              <p className="works-card-text">
                Participate in tournaments, <br /> Track scores, earn badges
              </p>
            </div>

            <div className="w-[292.5px] h-52 bg-white items-center justify-center gap-5 flex flex-col">
              <Image src="/website/fav.svg" alt="step card 1" width={40} height={40} />
              <p className="works-card-text">
                Support youth golfers through <br /> sponsorship opportunities
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Membership
