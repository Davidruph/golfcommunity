'use client'
import Image from 'next/image'
import Button from './Button'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { FaBars, FaTimes } from 'react-icons/fa'

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <section className="bg-[#EEEBE5] p-5 sticky top-0 z-50 flex justify-center">
      <div className="w-full max-w-[1259px] flex justify-between items-center">
        <div className="flex gap-[60px] items-center">
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
          {/* Desktop Menu */}
          <nav className="hidden lg:flex gap-8 menu-links text-[#52582E]">
            <Link
              href="/"
              className={`nav-link transition-all duration-300 relative group ${
                pathname === '/' ? 'text-[#000000]' : 'hover:text-[#000000]'
              }`}
            >
              Home
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-[#000000] transition-all duration-300 ${
                  pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              ></span>
            </Link>
            <Link
              href="/about"
              className={`nav-link transition-all duration-300 relative group ${
                pathname === '/about' ? 'text-[#000000]' : 'hover:text-[#000000]'
              }`}
            >
              About
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-[#000000] transition-all duration-300 ${
                  pathname === '/about' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              ></span>
            </Link>
            <Link
              href="/membership"
              className={`nav-link transition-all duration-300 relative group ${
                pathname === '/membership' ? 'text-[#000000]' : 'hover:text-[#000000]'
              }`}
            >
              Membership
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-[#000000] transition-all duration-300 ${
                  pathname === '/membership' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              ></span>
            </Link>
            <Link
              href="/contact"
              className={`nav-link transition-all duration-300 relative group ${
                pathname === '/contact' ? 'text-[#000000]' : 'hover:text-[#000000]'
              }`}
            >
              Contact
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-[#000000] transition-all duration-300 ${
                  pathname === '/contact' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              ></span>
            </Link>
          </nav>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex gap-3 items-center">
          <Button
            href="#"
            label="Login"
            width="102px"
            borderColor="#474842"
            backgroundColor="#EEEBE5"
            textColor="#0D1101"
            height="49px"
            className="login-btn"
          />

          <Button
            href="#"
            label="Join a community"
            width="206px"
            borderColor="#000000"
            backgroundColor="#000000"
            textColor="#FFFFFF"
            height="49px"
            className="join-community-btn"
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-2xl text-[#52582E] transition-transform duration-300 hover:scale-110"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#EEEBE5] border-t border-[#52582E] shadow-lg mobile-menu">
            <nav className="flex flex-col gap-4 p-6 menu-links text-[#52582E]">
              <Link
                href="/"
                className={`nav-link py-2 px-4 transition-all duration-300 rounded-lg ${
                  pathname === '/' ? 'bg-[#D4D0CB] pl-6' : 'hover:bg-[#D4D0CB] hover:pl-6'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`nav-link py-2 px-4 transition-all duration-300 rounded-lg ${
                  pathname === '/about' ? 'bg-[#D4D0CB] pl-6' : 'hover:bg-[#D4D0CB] hover:pl-6'
                }`}
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/membership"
                className={`nav-link py-2 px-4 transition-all duration-300 rounded-lg ${
                  pathname === '/membership' ? 'bg-[#D4D0CB] pl-6' : 'hover:bg-[#D4D0CB] hover:pl-6'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Membership
              </Link>
              <Link
                href="/contact"
                className={`nav-link py-2 px-4 transition-all duration-300 rounded-lg ${
                  pathname === '/contact' ? 'bg-[#D4D0CB] pl-6' : 'hover:bg-[#D4D0CB] hover:pl-6'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-[#52582E]">
                <Button
                  href="#"
                  label="Login"
                  width="100%"
                  borderColor="#474842"
                  backgroundColor="#EEEBE5"
                  textColor="#0D1101"
                  height="40px"
                  className="login-btn text-sm"
                />

                <Button
                  href="#"
                  label="Join a community"
                  width="100%"
                  borderColor="#000000"
                  backgroundColor="#000000"
                  textColor="#FFFFFF"
                  height="40px"
                  className="join-community-btn text-sm"
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </section>
  )
}

export default Nav
