import Image from 'next/image'
import Button from './Button'

const Steps = () => {
  return (
    <section className="w-full bg-[#0F0F0F] -mt-45">
      <div className="flex justify-center px-3">
        <div className="w-full max-w-[1259px] py-20 flex flex-col mt-30">
          <p className="steps-header">
            Start by joining a <br className="hidden lg:flex" />
            community
          </p>

          <div className="w-full flex flex-col md:flex-row mt-20 items-center justify-center gap-5">
            <div className="flex flex-col gap-4 w-full max-w-[396px]">
              <Image src="/website/stepscard1.svg" alt="step card 1" width={500} height={300} />
              <p className="steps-card-title">Captains</p>
              <div className="flex justify-between">
                <p className="steps-card-desc">
                  Meet inspiring community captains <br className="hidden lg:flex" /> leading the
                  way.
                </p>
                <Button
                  href="#"
                  label=""
                  width="24px"
                  borderColor="#000"
                  backgroundColor="#000"
                  textColor="#fff"
                  height="24px"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-[396px]">
              <p className="steps-card-title">Locations</p>
              <div className="flex justify-between">
                <p className="steps-card-desc">
                  Discover clubs and communities <br className="hidden lg:flex" />
                  across the region.
                </p>
                <Button
                  href="#"
                  label=""
                  width="24px"
                  borderColor="#000"
                  backgroundColor="#000"
                  textColor="#fff"
                  height="24px"
                />
              </div>
              <Image src="/website/stepscard2.svg" alt="step card 1" width={500} height={300} />
            </div>

            <div className="flex flex-col gap-4 w-full max-w-[396px]">
              <Image src="/website/stepscard3.svg" alt="step card 3" width={500} height={300} />
              <p className="steps-card-title">Involvement.</p>
              <div className="flex justify-between">
                <p className="steps-card-desc">
                  Connect and join with a click to grow <br className="hidden lg:flex" />
                  community golf.
                </p>
                <Button
                  href="#"
                  label=""
                  width="24px"
                  borderColor="#000"
                  backgroundColor="#000"
                  textColor="#fff"
                  height="24px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Steps
