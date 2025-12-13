import Image from 'next/image'
import Button from './Button'
import { FaPlay } from 'react-icons/fa'

const Community = () => {
  return (
    <section className="w-full bg-[#EEEBE5]">
      <div className="flex justify-center px-3">
        <div className="w-full max-w-[1259px] py-10 flex flex-col">
          <p className="community-header">
            A community built on <br className="hidden lg:flex" /> the love of golf
          </p>

          <div className="flex flex-col md:flex-row gap-16 items-center justify-start my-8">
            <Image src="/website/community1.svg" alt="Community" width={500} height={300} />
            <div className="flex flex-col gap-5">
              <Image src="/website/community2.svg" alt="Community" width={500} height={300} />

              <p className="community-text-desc">
                Golf4Community makes it easy to join, play, connect, and give back.
                <br className="hidden lg:flex" /> Follow these simple steps to be a part of our
                growing community
                <br className="hidden lg:flex" /> and impact youth golf in your area.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-5 items-center justify-start mt-10 mb-5">
            <div
              className="relative bg-cover bg-center w-full h-[672px] max-w-[684px]"
              style={{
                backgroundImage:
                  "linear-gradient(181.38deg, rgba(13, 17, 1, 0) 46.7%, #0D1101 98.82%), url('/website/community3.jpg')",
              }}
            >
              <div className="absolute bottom-8 gap-2 w-full flex flex-col justify-center items-center">
                <p className="community-card-header">Play & Compete Locally</p>
                <p className="community-card-desc">
                  Join golfers in your area, track scores, and climb{' '}
                  <br className="hidden lg:flex" /> community leaderboards.
                </p>

                <Button
                  href="#"
                  label=""
                  width="56px"
                  borderColor="#474842"
                  backgroundColor="#474842"
                  textColor="#fff"
                  height="56px"
                />
              </div>
            </div>

            <div
              className="relative bg-cover bg-center w-full h-[672px] max-w-[684px]"
              style={{
                backgroundImage:
                  "linear-gradient(181.38deg, rgba(13, 17, 1, 0) 46.7%, #0D1101 98.82%), url('/website/community4.jpg')",
              }}
            >
              <div className="absolute bottom-8 gap-2 w-full flex flex-col justify-center items-center">
                <p className="community-card-header">Community Clubs & Teams</p>
                <p className="community-card-desc">
                  Create or join golf groups by ZIP code, skill level, or shared{' '}
                  <br className="hidden lg:flex" /> interests captains included.
                </p>

                <Button
                  href="#"
                  label=""
                  width="56px"
                  borderColor="#474842"
                  backgroundColor="#474842"
                  textColor="#fff"
                  height="56px"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-5 items-center justify-start mb-5">
            <div
              className="relative bg-cover bg-center w-full h-[672px] max-w-[684px]"
              style={{
                backgroundImage:
                  "linear-gradient(181.38deg, rgba(13, 17, 1, 0) 46.7%, #0D1101 98.82%), url('/website/community5.jpg')",
              }}
            >
              <div className="absolute bottom-8 gap-2 w-full flex flex-col justify-center items-center">
                <p className="community-card-header">Member Profiles & Stats</p>
                <p className="community-card-desc">
                  Showcase your game. Track progress, badges earned,{' '}
                  <br className="hidden lg:flex" />
                  events played, and points collected.
                </p>

                <Button
                  href="#"
                  label=""
                  width="56px"
                  borderColor="#474842"
                  backgroundColor="#474842"
                  textColor="#fff"
                  height="56px"
                />
              </div>
            </div>

            <div
              className="relative bg-cover bg-center w-full h-[672px] max-w-[684px]"
              style={{
                backgroundImage:
                  "linear-gradient(181.38deg, rgba(13, 17, 1, 0) 46.7%, #0D1101 98.82%), url('/website/community6.jpg')",
              }}
            >
              <div className="absolute bottom-8 gap-2 w-full flex flex-col justify-center items-center">
                <p className="community-card-header">Give Back Through the Game</p>
                <p className="community-card-desc">
                  Earn points, support youth golf programs, sponsor kids, and{' '}
                  <br className="hidden lg:flex" />
                  help grow the next generation of players.
                </p>

                <Button
                  href="#"
                  label=""
                  width="56px"
                  borderColor="#474842"
                  backgroundColor="#474842"
                  textColor="#fff"
                  height="56px"
                />
              </div>
            </div>
          </div>

          <div
            className="bg-cover bg-center w-full h-[400px] md:h-[689px] max-w-[1260px] mt-20 flex items-center justify-center"
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

export default Community
