"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Info() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mb-4 md:w-full md:px-2.5">
      <div className="p-6 rounded-3xl w-full bg-card">
        <div className="mb-4 flex justify-between items-center">
          <span className="font-semibold sr-only">Info</span>
        </div>

        <div className="w-full max-w-[600px] min-w-[240px] mb-2 space-y-4">
          <h1 className="w-full overflow-hidden para-control !text-center font-semibold">
            Help Ambros Breathe Easy Again – A Special LoFi-Afrobeat EP for a
            Cause
          </h1>
          <p className="w-full overflow-hidden para-control">
            Hey everyone, my name is Emmanuel Allan, also know us my dear
            shelter and I’m a music producer with a passion for creating soulful
            Afrobeat tunes. Today, I’m reaching out not just as a musician, but
            as a friend in need of your support.
          </p>

          <p className="w-full overflow-hidden para-control">
            My dear friend Ambros, just 22 and still in university, recently
            started experiencing shortness of breath. What was supposed to be a
            routine checkup turned into a heart-wrenching discovery. The doctors
            found fluid in his lungs, suspecting it could be tuberculosis (TB)
            or, even more frightening, a cancerous growth. 😔
          </p>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isExpanded
                ? "max-h-[1000px] opacity-100 space-y-4"
                : "max-h-0 opacity-0"
            }`}
          >
            <p className="w-full overflow-hidden para-control">
              This is serious. Ambros needs an in-depth examination at Aga Khan
              Hospital, but the test costs $1500, and that’s just the beginning.
              We’re still unsure of the treatment costs that might follow.
            </p>

            <p className="w-full overflow-hidden para-control">
              Like many, I don’t have $1500 readily available. But I believe in
              the power of community, music, and standing together in tough
              times. So, I’ve decided to do what I do best – create something
              meaningful. I’m crafting a 10-song LoFi-Afrobeat EP to raise the
              funds Ambros needs.
            </p>

            <p className="w-full overflow-hidden para-control">
              Now, the EP is still under construction, but I’ve got two preview
              tracks ready for you to listen to on the music player below. 🎧
              These tracks will give you a taste of what’s coming, and I can’t
              wait for you to hear the full project.
            </p>

            <p className="w-full overflow-hidden para-control">
              Here’s how you can help while enjoying some great music:
            </p>

            <p className="w-full overflow-hidden para-contro font-semibold">
              🎶 Vinyl Record (10-song EP) – $36.99
            </p>

            <p className="w-full overflow-hidden para-control font-semibold">
              🎶 CD Disk (10-song EP) – $18.75
            </p>

            <p className="w-full overflow-hidden para-control font-semibold">
              🎶 Cassette Tape (10-song EP) – $22.24
            </p>

            <p className="w-full overflow-hidden para-control">
              I’m also collecting emails so I can notify you the moment the full
              EP is out. As a special thank you, I’ll send you a code that
              deducts your donation amount from your purchase, no matter how
              much you donate. 💌
            </p>

            <p className="w-full overflow-hidden para-control">
              Every dollar counts, and every beat has a purpose. Not only will
              you be helping Ambros get the critical medical care he needs, but
              you’ll also be supporting an artist committed to making a
              difference through music.
            </p>

            <p className="w-full overflow-hidden para-control">
              Let’s unite to help Ambros breathe easy again. Your generosity
              means the world, and it comes with some incredible music to uplift
              your spirits. 🎧✨
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
    </div>
  );
}
