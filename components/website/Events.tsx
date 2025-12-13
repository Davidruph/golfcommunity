import Image from 'next/image'
import Button from './Button'

const Events = () => {
  //gets totday's date
  const today = new Date()

  //formats date to month day, year
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const events = [
    {
      id: 1,
      title: 'Annual Golfory Championship Tournament',
    },
    {
      id: 2,
      title: 'Halloween Scramble Spooky Golf Fun',
    },
    {
      id: 3,
      title: 'Golfory Member Guest Tournament',
    },
    {
      id: 4,
      title: 'Holiday Charity Scramble',
    },
  ]

  return (
    <section className="w-full bg-[#000000] my-5">
      <div className="flex justify-center px-3">
        <div className="w-full max-w-[1259px] py-20 flex flex-col gap-8">
          <p className="events-header">
            Upcoming Events & <br className="hidden lg:flex" />
            Tournaments
          </p>

          <div className="flex justify-between w-full mt-10">
            <div className="flex flex-col gap-4 w-full">
              <Image src="/website/eventimage.svg" alt="Event Image" width={326} height={411} />

              <p className="events-date">{formattedDate}</p>
            </div>

            <div className="flex flex-col gap-5 w-full">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className={`flex justify-between h-[74.00006103515625px] relative group stagger-item-${(index % 4) + 1}`}
                >
                  <p className="events-title">
                    {event.id}. {event.title}
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
                  <div className="absolute bottom-0 left-0 w-1/2 group-hover:w-full border-b border-white transition-all duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Events
