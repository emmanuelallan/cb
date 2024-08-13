"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Info() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="p-4 rounded-[18px] w-full bg-card">
      <div className="mb-4 flex justify-between items-center">
        <span className="font-semibold sr-only">Info</span>
      </div>

      <div className="w-full max-w-[600px] min-w-[240px] mb-2 space-y-4">
        <h1 className="w-full overflow-hidden para-control !text-center font-semibold">
          Help Ambros Breathe Easy Again – A Special LoFi-Afrobeat EP for a
          Cause
        </h1>
        <p className="w-full overflow-hidden para-control">
          Hey everyone, my name is Emmanuel Allan, and I’m a music producer with
          a passion for creating soulful Afrobeat tunes. Today, I’m reaching out
          not just as a musician, but as a friend in need of your support.
        </p>

        <p className="w-full overflow-hidden para-control">
          I have a dear friend, Ambros, who is just 22 years old and still in
          university. Recently, he started experiencing shortness of breath, so
          he went in for what he thought would be a routine checkup. But life
          threw a curveball, and things took a sudden turn. The doctors found
          fluid in his lungs, which is never a good sign. They suspect it could
          be a form of tuberculosis (TB) or, even more frightening, a cancerous
          growth. 😞
        </p>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <p className="w-full overflow-hidden para-control">
            This isn’t just a minor issue; it’s serious, and the doctors have
            ordered an in-depth examination to get to the bottom of what’s going
            on. Unfortunately, this essential test comes with a hefty price tag
            – $1500 – and it needs to be done at Aga Khan Hospital.
          </p>

          <p className="w-full overflow-hidden para-control">
            That’s just for the checkup, and we’re still in the dark about how
            much the treatment might cost once we have the full picture.
          </p>

          <p className="w-full overflow-hidden para-control">
            Now, like many of us, I don’t have $1500 sitting around. But I
            believe in the power of community, music, and coming together for a
            good cause. So, I’ve decided to do what I do best – create something
            meaningful. I’ve put together a 10-song LoFi-Afrobeat EP that I’m
            offering to help raise the funds Ambros needs.
          </p>

          <p className="w-full overflow-hidden para-control">
            Here’s how you can get involved and enjoy some fresh tunes while
            making a difference:
          </p>

          <p className="w-full overflow-hidden para-control">
            🎶 $5 – Get a 3-song EP and vibe to some smooth Afrobeat grooves.
          </p>

          <p className="w-full overflow-hidden para-control">
            🎶 $10 – Get a 5-song EP and enjoy even more beats that blend LoFi
            chill with African rhythms.
          </p>

          <p className="w-full overflow-hidden para-control">
            🎶 $15 – Get an 8-song EP and lose yourself in the music.
          </p>

          <p className="w-full overflow-hidden para-control">
            🎶 $20 – Get the full 10-song EP and experience the entire journey,
            from start to finish.
          </p>

          <p className="w-full overflow-hidden para-control">
            💖 Custom Donation – If you’d like to give more (or less), you can
            donate any amount and still receive the music as a token of my
            appreciation.
          </p>

          <p className="w-full overflow-hidden para-control">
            Every dollar counts and every beat has a purpose. Not only will you
            be helping Ambros get the critical medical care he needs, but you’ll
            also be supporting an artist trying to make a positive impact
            through music.
          </p>

          <p className="w-full overflow-hidden para-control">
            Let’s come together to help Ambros breathe easy again. Your
            generosity means the world, and it comes with some seriously good
            music to brighten your day. 🎧✨
          </p>

          <p className="w-full overflow-hidden para-control">
            Thank you for your kindness, support, and love. Let’s make this
            happen – for Ambros, for the music, and for the community.
          </p>

          <p className="w-full overflow-hidden para-control">Much love,</p>

          <p className="w-full overflow-hidden para-control">
            Emmanuel Allan 🎶
          </p>
        </div>

        <button
          onClick={toggleExpand}
          className="flex items-center justify-center w-full py-2 text-primary hover:text-dark transition-colors duration-200"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="ml-1" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
