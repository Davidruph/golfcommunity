import Button from '@/components/website/Button'
import planicon from '@/public/website/planicon.svg'
import tick from '@/public/website/tick.svg'

import Image from 'next/image'
const Plans = () => {
  return (
    <section className="bg-[#EEEBE5] flex justify-center py-20">
      <div className="z-10 w-full max-w-[1259px] flex flex-col items-center justify-center px-3">
        <h1 className="membership-plans-title pb-3">Membership Plan</h1>
        <p className="membership-desc">
          Flexible options designed to fit your lifestyle and golfing needs.
        </p>

        <div className="flex flex-col md:flex-row gap-5 mt-14 w-full justify-center">
          <div className="w-full h-[473px] max-w-[404px] bg-white p-5 flex flex-col justify-start items-start">
            <div className="plan-title border border-[#4748421F] h-35px] w-auto px-[16px] py-[4px]">
              Regular Membership
            </div>

            <div className="w-full items-end flex mt-10 justify-between">
              <p className="plan-price">
                $20 <span className="ml-0 pl-0">/month</span>
              </p>
              <p className="plan-billed flex items-center gap-2">
                <Image src={planicon} alt="Plan Icon" />
                billed annually
              </p>
            </div>

            <div className="bg-[#F6F7F9] w-full h-[188px] mt-5 p-5 flex flex-col justify-center items-start gap-4 mb-5">
              <div className="flex items-center gap-2 justify-start plan-features">
                <Image src={tick} alt="Tick Icon" /> Access to the platform
              </div>
              <div className="flex items-center gap-2 justify-start plan-features">
                <Image src={tick} alt="Tick Icon" /> Member profile & basic features
              </div>
              <div className="flex items-center gap-2 justify-start plan-features">
                <Image src={tick} alt="Tick Icon" /> Community participation
              </div>
              <div className="flex items-center gap-2 justify-start plan-features">
                <Image src={tick} alt="Tick Icon" /> $5 supports children in your ZIP code
              </div>
            </div>

            <Button
              href="#"
              label="Get Started Now"
              width="100%"
              borderColor="#FFD700"
              backgroundColor="#FFD700"
              textColor="#0D1101"
              height="48px"
              className="join-community-now-btn"
            />
          </div>

          <div className="w-full h-[473px] max-w-[404px] bg-white p-5 flex flex-col justify-start items-start">
            <div className="plan-title border border-[#4748421F] h-35px] w-auto px-[16px] py-[4px]">
              Business & Church Membership
            </div>

            <div className="w-full items-end flex mt-10 justify-between">
              <p className="plan-price">
                $50 <span className="ml-0 pl-0">/month</span>
              </p>
              <p className="plan-billed flex items-center gap-2">
                <Image src={planicon} alt="Plan Icon" />
                billed annually
              </p>
            </div>

            <div className="bg-[#F6F7F9] w-full h-[188px] mt-5 p-5 flex flex-col justify-center items-start gap-4 mb-5">
              <div className="flex items-center gap-2 justify-start plan-features">
                <Image src={tick} alt="Tick Icon" /> Business or church listing
              </div>
              <div className="flex items-center gap-2 justify-start plan-features">
                <Image src={tick} alt="Tick Icon" /> Community visibility & engagement
              </div>
              <div className="flex items-center gap-2 justify-start plan-features">
                <Image src={tick} alt="Tick Icon" /> Access to platform features
              </div>
              <div className="flex items-center gap-2 justify-start plan-features">
                <Image src={tick} alt="Tick Icon" /> $10 supports children in your ZIP code
              </div>
            </div>

            <Button
              href="#"
              label="Get Started Now"
              width="100%"
              borderColor="#FFD700"
              backgroundColor="#FFD700"
              textColor="#0D1101"
              height="48px"
              className="join-community-now-btn"
            />
          </div>

          <div className="w-full h-[473px] max-w-[404px] bg-white p-5 flex flex-col justify-start items-start">
            <div className="plan-title border border-[#4748421F] h-35px] w-auto px-[16px] py-[4px]">
              Golf Instructor
            </div>

            <div className="w-full items-end flex mt-10 justify-between">
              <p className="plan-price">
                $50 <span className="ml-0 pl-0"></span>
              </p>
              <p className="plan-billed flex items-center gap-2">
                <Image src={planicon} alt="Plan Icon" />
                One Time
              </p>
            </div>

            <div className="bg-[#F6F7F9] w-full h-[188px] mt-5 p-5 flex flex-col justify-center items-start gap-4 mb-5">
              <div className="flex items-center gap-2 justify-start plan-features">
                <Image src={tick} alt="Tick Icon" /> Get discovered by golfers
              </div>
              <div className="flex items-center gap-2 justify-start plan-features">
                <Image src={tick} alt="Tick Icon" /> Build credibility.
              </div>
              <div className="flex items-center gap-2 justify-start plan-features">
                <Image src={tick} alt="Tick Icon" /> Grow your reach
              </div>
              <div className="flex items-center gap-2 justify-start plan-features">
                <Image src={tick} alt="Tick Icon" /> Visibility to serious golfers
              </div>
            </div>

            <Button
              href="#"
              label="Get Started Now"
              width="100%"
              borderColor="#FFD700"
              backgroundColor="#FFD700"
              textColor="#0D1101"
              height="48px"
              className="join-community-now-btn"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Plans
