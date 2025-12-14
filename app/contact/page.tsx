import { IoMail } from 'react-icons/io5'
import { ImLocation } from 'react-icons/im'
import { IoCall } from 'react-icons/io5'
import Faq from '@/components/website/Faq'

const Contact = () => {
  return (
    <section className="w-full flex justify-center bg-[#EEEBE5] py-20">
      <div className="z-10 w-full max-w-[1259px] flex flex-col items-center justify-center px-3">
        <div className="w-full flex flex-col gap-6 items-start justify-center lg:flex-row lg:gap-20">
          <div className="w-full flex flex-col gap-5">
            <h1 className="contact-header">Get In Touch</h1>
            <p className="contact-desc">
              We&apos;d love to hear from you! Whether you&apos;re planning your next round of
              <br className="hidden lg:flex" /> golf, inquiring about membership, or hosting a
              special event, our team is <br className="hidden lg:flex" />
              here to assist you.
            </p>
          </div>

          <div className="w-full">
            <form className="w-full flex flex-col gap-10">
              <div className="flex flex-col gap-10 w-full lg:flex-row lg:gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="flex-1 bg-transparent focus:border-b focus:border-b-[#000000] outline-none px-2 py-2 transition-colors duration-300 w-full"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="flex-1 bg-transparent focus:border-b focus:border-b-[#000000] outline-none px-2 py-2 transition-colors duration-300 w-full"
                />
              </div>
              <input
                type="text"
                placeholder="Phone"
                className="bg-transparent focus:border-b focus:border-b-[#000000] outline-none px-2 py-2 transition-colors duration-300"
              />
              <input
                type="text"
                placeholder="Email Address"
                className="bg-transparent focus:border-b focus:border-b-[#000000] outline-none px-2 py-2 transition-colors duration-300"
              />

              <textarea
                placeholder="Write your requirement"
                className="bg-transparent focus:border-b focus:border-b-[#000000] outline-none px-2 py-2 transition-colors duration-300 resize-none"
              />
              <button className="contact-btn w-full">Subscribe Now</button>
            </form>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row justify-center items-center mt-30 gap-10">
          <div className="flex flex-col w-full gap-8 max-w-[404px]">
            <IoMail size={24} />
            <div className="flex flex-col gap-1">
              <p className="contact-mail-title">Mail us here</p>
              <p className="contact-mail-desc">hello@glofory.com</p>
            </div>
          </div>

          <div className="flex flex-col w-full gap-8 max-w-[404px]">
            <ImLocation size={24} />
            <div className="flex flex-col gap-1">
              <p className="contact-mail-title">Our Address</p>
              <p className="contact-mail-desc">2464 Royal Ln. Mesa, New Jersey 45463</p>
            </div>
          </div>

          <div className="flex flex-col w-full gap-8 max-w-[404px]">
            <IoCall size={24} />
            <div className="flex flex-col gap-1">
              <p className="contact-mail-title">Phone</p>
              <p className="contact-mail-desc">(603) 555-0123</p>
            </div>
          </div>
        </div>

        <Faq />
      </div>
    </section>
  )
}

export default Contact
