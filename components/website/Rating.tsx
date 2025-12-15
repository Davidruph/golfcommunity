'use client'

import { useEffect, useRef, useState } from 'react'

const CountUpNumber = ({
  end,
  duration = 2000,
  suffix = '',
}: {
  end: number
  duration?: number
  suffix?: string
}) => {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLParagraphElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true)
          setHasAnimated(true)
        }
      },
      { threshold: 0.1 }
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const currentCount = Math.floor(progress * end)
      setCount(currentCount)

      if (progress === 1) {
        clearInterval(interval)
      }
    }, 16)

    return () => clearInterval(interval)
  }, [isVisible, end, duration])

  return (
    <p ref={countRef} className="rating-active-golfers">
      {count}
      {suffix}
    </p>
  )
}

const Rating = () => {
  return (
    <section className="w-full bg-[#EEEBE5] border-t border-b border-[#00000029]">
      <div className="flex justify-center px-3">
        <div className="w-full max-w-[1259px] py-6 flex flex-col lg:flex-row items-center justify-center gap-5 lg:gap-0">
          <div className="flex flex-col w-full items-center">
            <CountUpNumber end={500} suffix="+" />
            <p className="rating-title">Active Golfers</p>
          </div>

          <div className="flex flex-col w-full items-center md:border-l md:border-r border-[#00000029]">
            <CountUpNumber end={50} suffix="+" />
            <p className="rating-title">Communities</p>
          </div>

          <div className="flex flex-col w-full items-center">
            <CountUpNumber end={100} suffix="K+" />
            <p className="rating-title">Youth Funding</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Rating
