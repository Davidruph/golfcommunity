import Image from "next/image";
import Button from "./Button";
import Link from "next/link";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="w-full flex flex-col items-center px-3">
      <div className="w-full max-w-[1260px] relative aspect-video">
        <Image
          src="/website/footer-bg.svg"
          alt="Footer Background"
          fill
          className="w-full h-full object-cover"
          priority
          loading="eager"
        />
        {/* Middle Content Div */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white w-full max-w-[410px] p-5 md:p-8 flex flex-col gap-5">
            <h2 className="footer-question text-[30px] md:text-[48px]">
              Ready to connect?
            </h2>

            <p className="footer-question-follow-up">
              We connect players, build local communities, and support youth
              golf development.
            </p>

            <Button
              href="#"
              label="Join Now"
              width="142px"
              borderColor="#FFD700"
              backgroundColor="#FFD700"
              textColor="#0D1101"
              height="59px"
              className="join-community-now-btn"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full mt-10 px-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full max-w-[1260px]">
          <div className="flex flex-col gap-5 w-full md:w-auto md:max-w-[474px]">
            <Link href="/">
              <Image
                src="/placeholder-logo.svg"
                alt="Logo"
                width={134}
                height={36}
                loading="eager"
                className="w-[134px] h-9 cursor-pointer"
              />
            </Link>
            <p className="footer-question-follow-up">
              Golf4Community is a platform built for golfers who believe the
              game is bigger than a scorecard. We connect players, grow local
              communities, and empower youth through the love of golf
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="bg-[#0D1101] text-[#FFD700] p-2 flex items-center justify-center"
                aria-label="Facebook"
              >
                <FaFacebookF size={20} className="text-[#FFD700]" />
              </Link>
              <Link
                href="#"
                className="bg-[#0D1101] text-[#FFD700]  p-2 flex items-center justify-center"
                aria-label="X Twitter"
              >
                <FaXTwitter size={20} className="text-[#FFD700]" />
              </Link>
              <Link
                href="#"
                className="bg-[#0D1101] text-[#FFD700]  p-2 flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={20} className="text-[#FFD700]" />
              </Link>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-8 lg:gap-16 mt-8 md:mt-0">
            <nav className="flex flex-col gap-6 menu-links text-[#52582E] items-start">
              <Link
                href="#"
                className="nav-link transition-all duration-300 hover:text-[#000000] relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#000000] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#"
                className="nav-link transition-all duration-300 hover:text-[#000000] relative group"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#000000] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#"
                className="nav-link transition-all duration-300 hover:text-[#000000] relative group"
              >
                Membership
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#000000] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#"
                className="nav-link transition-all duration-300 hover:text-[#000000] relative group"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#000000] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            <nav className="flex flex-col gap-8 menu-links text-[#52582E] items-start">
              <Link
                href="#"
                className="nav-link transition-all duration-300 hover:text-[#000000] relative group"
              >
                Privacy policy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#000000] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#"
                className="nav-link transition-all duration-300 hover:text-[#000000] relative group"
              >
                Terms conditions
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#000000] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <hr className="border border-[#63635C1F] mt-10 w-full max-w-[1260px] px-3 md:px-0" />

      <p className="footer-copyright my-6 flex text-start w-full max-w-[1260px] px-3 md:px-0">
        © 2025 G4C, Inc. All rights reserved
      </p>
    </div>
  );
};

export default Footer;
