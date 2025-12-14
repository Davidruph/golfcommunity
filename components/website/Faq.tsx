'use client'
import { FaPlus } from 'react-icons/fa'
import { FaMinus } from 'react-icons/fa'
import { useState } from 'react'

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const faqData = [
    {
      question: 'How do I become a member of Golf4Community?',
      answer:
        'To become a member, simply sign up on our website and choose a membership plan that suits your needs. We offer various tiers to accommodate golfers of all levels, from casual players to serious enthusiasts.',
    },
    {
      question: 'What benefits do I get with a membership?',
      answer:
        'Members enjoy exclusive access to tournaments, community events, and special discounts on golf gear. You&apos;ll also gain access to our network of partner courses and priority booking for tee times.',
    },
    {
      question: 'Can I upgrade or downgrade my membership at any time?',
      answer:
        'Yes, you can upgrade or downgrade your membership at any time through your account settings. Changes will take effect at your next billing cycle.',
    },
    {
      question: 'Are memberships available for all ages?',
      answer:
        'Our memberships are open to all ages, and we encourage families to join. We have special youth programs and junior memberships to help young golfers develop their skills and passion for the game.',
    },
  ]

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <div className="mt-30 w-full flex flex-col lg:flex-row gap-8 items-start justify-center">
      <div className="flex flex-col gap-3 w-full max-w-[549px]">
        <p className="faq-header">
          Frequently Asked <br className="hidden lg:flex" />
          Questions
        </p>
        <p className="faq-desc">
          Everything you need to know about becoming a <br className="hidden lg:flex" />
          G4C member and getting started.
        </p>
      </div>
      <div className="w-full flex-col flex gap-5">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="w-full flex flex-col gap-3 p-5 bg-[#0F0F0F] border-[1.5px] border-[#4748421F] transition-all duration-300"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="flex justify-between items-start md:items-center w-full cursor-pointer"
            >
              <p className="faq-accordion-question text-[14px] md:text-[20px]">{item.question}</p>
              <div className="text-white transition-transform duration-300 hover:text-gray-300">
                {openIndex === index ? <FaMinus /> : <FaPlus />}
              </div>
            </button>
            {openIndex === index && (
              <p className="faq-accordion-answer animate-in fade-in duration-300">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Faq
