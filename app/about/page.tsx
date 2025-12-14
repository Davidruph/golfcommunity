import Button from '@/components/website/Button'
import Rating from '@/components/website/Rating'
import Why from '@/components/website/Why'
import Image from 'next/image'
import React from 'react'

const About = () => {
  return (
    <>
      <section
        className="w-full flex justify-center h-[614px] bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0, 0, 0, 0) -86.07%, rgba(0, 0, 0, 0.5) 100%), url('/website/abouthero.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'bottom 27% center',
        }}
      >
        <div className="z-10 w-full max-w-[1259px] flex items-center justify-center px-3">
          <div className="flex flex-col gap-6 md:gap-6 text-white items-center text-center">
            <h1 className="hero-text-lead text-[40px] md:text-[60px] lg:text-[88px]">
              Building Stronger
              <span>Communities</span> <br className="hidden lg:flex" />
              Through the Game of Golf
            </h1>

            <p className="hero-description text-[16px] md:text-[20px]">
              Golf4Community is a platform that connects golfers, empowers neighborhoods, and
              supports <br className="hidden lg:flex" />
              youth by creating a space where the game inspires connection, confidence, and positive
              change.
            </p>
          </div>
        </div>
      </section>

      <Rating />
      <Why />

      <section className="w-full bg-[#0F0F0F] -mt-55 mb-10">
        <div className="flex justify-center px-3">
          <div className="w-full max-w-[1259px] py-20 flex flex-col mt-30">
            <p className="steps-header">What We Stand For</p>

            <div className="w-full flex flex-col md:flex-row mt-20 items-start justify-center gap-5">
              <div className="flex flex-col gap-4 w-full max-w-[396px] bg-white p-3">
                <Image
                  src="/website/aboutstepimage1.svg"
                  alt="step card 1"
                  width={500}
                  height={300}
                />
                <p className="about-steps-card-title">Community First.</p>
                <div className="flex justify-between">
                  <p className="about-steps-card-desc">
                    We help golfers find each other, connect by ZIP code, join local groups, and
                    build meaningful relationships.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full max-w-[396px] bg-white p-3">
                <p className="about-steps-card-title">Youth Empowerment.</p>
                <div className="flex justify-between">
                  <p className="about-steps-card-desc">
                    A portion of G4C&apos;s mission is dedicated to helping kids learn the game,
                    build confidence, and access equipment through sponsorships.
                  </p>
                </div>
                <Image
                  src="/website/aboutstepimage2.svg"
                  alt="step card 1"
                  width={500}
                  height={300}
                />
              </div>

              <div className="flex flex-col gap-4 w-full max-w-[396px] bg-white p-3">
                <Image
                  src="/website/aboutstepimage3.svg"
                  alt="step card 3"
                  width={500}
                  height={300}
                />
                <p className="about-steps-card-title">Growth Through Play.</p>
                <div className="flex justify-between">
                  <p className="about-steps-card-desc">
                    We encourage learning, friendly competition, and personal development through
                    score tracking, badges, events, and challenges.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-25 items-center justify-center flex flex-col">
              <p className="steps-header mb-3">How G4C Works</p>
              <p className="steps-works-desc">
                G4C makes golf accessible and engaging through a simple, community-driven approach.
              </p>

              <div className="flex flex-col items-center justify-center my-15 gap-5 lg:flex-row">
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
          </div>
        </div>
      </section>

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

      <section className="w-full bg-[#EEEBE5] my-15">
        <div className="flex justify-center px-3">
          <div className="w-full max-w-[1259px] py-20 flex flex-col">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
              <div className="flex w-full">
                <Image
                  src="/website/futureimage.svg"
                  alt="future Image"
                  width={622}
                  height={640}
                  className="w-full h-auto"
                />
              </div>
              <div className="w-full flex flex-col gap-5 p-10">
                <p className="future-head">Our Vision for the Future</p>
                <p className="future-desc">
                  We&apos;re building the model state by state. As communities grow, G4C will roll
                  out across the country with stronger features, more opportunities, and deeper
                  community impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default About
