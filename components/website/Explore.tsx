import Image from 'next/image'
import Button from './Button'

const Explore = () => {
  return (
    <section className="w-full bg-[#EEEBE5]">
      <div className="flex justify-center px-3">
        <div className="w-full max-w-[1259px] py-20 flex flex-col gap-8">
          <div className="flex w-full gap-5 items-start md:items-end justify-between flex-col md:flex-row">
            <p className="explore-header">
              Explore top scorers and see <br className="hidden lg:flex" /> who&apos;s leading the
              way.
            </p>

            <p className="explore-view-all flex items-center gap-3">
              VIEW LEADERBOARD{' '}
              <Button
                href="#"
                label=""
                width="24px"
                borderColor="#fff"
                backgroundColor="#fff"
                textColor="#FE522D"
                height="24px"
              />
            </p>
          </div>

          <div className="flex flex-col w-full mt-14 pb-15">
            <div className="group flex justify-between items-center h-[164px] cursor-pointer transition-colors duration-300 animate-slide-in-up">
              <div className="flex gap-14 items-center">
                <Image src="/website/exploreimage1.svg" alt="explore 1" width={151} height={132} />

                <p className="explore-top-count group-hover:text-white transition-colors duration-300">
                  01 // <span>Sam Lee</span>
                </p>
              </div>

              <div className="hidden lg:flex">
                <Image
                  src="/website/exploretop1.svg"
                  alt="explore 2"
                  width={261}
                  height={162}
                  className="text-[#00000080]"
                />
              </div>
              <div className="gap-2 items-center hidden lg:flex">
                <Image src="/website/explorecrown.svg" alt="crown" width={28} height={28} />
                <span className="explore-points group-hover:text-white transition-colors duration-300">
                  {' '}
                  180 pts
                </span>
              </div>
            </div>

            <div
              className="group flex justify-between items-center bg-black h-[164px] hover:bg-opacity-80 cursor-pointer transition-colors duration-300 animate-slide-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="flex gap-14 items-center">
                <Image src="/website/exploreimage2.svg" alt="explore 2" width={151} height={132} />

                <p className="explore-top-counts group-hover:text-white transition-colors duration-300">
                  01 // <span className="text-white">Jasmine Clark</span>
                </p>
              </div>

              <div className="hidden lg:flex">
                <Image
                  src="/website/exploretop2.svg"
                  alt="explore 2"
                  width={261}
                  height={162}
                  className="text-[#00000080]"
                />
              </div>
              <div className="gap-2 items-center hidden lg:flex">
                <Image src="/website/explorecrown.svg" alt="crown" width={28} height={28} />
                <span className="explore-score text-white"> 172 pts</span>
              </div>
            </div>

            <div className="group flex justify-between items-center h-[164px]">
              <div className="flex gap-14 items-center">
                <Image src="/website/exploreimage3.svg" alt="explore 1" width={151} height={132} />

                <p className="explore-top-count group-hover:text-white">
                  03 // <span>Mike Ramos</span>
                </p>
              </div>

              <div className="hidden lg:flex">
                <Image
                  src="/website/exploretop3.svg"
                  alt="explore 2"
                  width={261}
                  height={162}
                  className="text-[#00000080]"
                />
              </div>
              <div className="gap-2 items-center hidden lg:flex">
                <Image src="/website/explorecrown.svg" alt="crown" width={28} height={28} />
                <span className="explore-points group-hover:text-white"> 180 pts</span>
              </div>
            </div>
          </div>

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
      </div>
    </section>
  )
}

export default Explore
