"use client";

import { useState, Fragment, useEffect } from "react";
import { toast } from "sonner";
import { Copy, LinkIcon, X } from "lucide-react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Link from "next/link";

export default function Goal() {
  const [stats, setStats] = useState({
    target: 0,
    current: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const response = await fetch("/api/goals");
        if (!response.ok) {
          throw new Error("Failed to fetch goal");
        }
        const data = await response.json();
        setStats({
          target: data.target,
          current: data.current,
        });
      } catch (error) {
        console.error("Error fetching goal:", error);
        toast.error("Failed to load goal data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoal();
  }, []);

  const calcPercent = () => {
    return ((stats.current / stats.target) * 100).toFixed(2);
  };

  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const shareOn = (platform) => {
    const shareUrl = "https://remotask.org";
    if (platform === "copy") {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?url=${shareUrl}&text=Healing%20Waves:%20A%20Lo-Fi%20Afrobeat%20Journey!`,
        "_blank"
      );
    } else if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        "_blank"
      );
    } else if (platform === "reddit") {
      window.open(
        `https://www.reddit.com/submit?url=${shareUrl}&title=Support%20Emmanuel%20Allan%20on%20Ko-fi`,
        "_blank"
      );
    } else if (platform === "discord") {
      window.open(`https://discord.com/channels/@me`, "_blank");
    }
  };

  return (
    <div className="relative max-w-[550px] h-auto w-full md:transform-none bottom-auto top-0 will-change-transform translate-z lg:w-full lg:max-w-[550px] lg:block md:max-w-[vw] md:h-auto md:contents">
      <div className="m-0 md:contents">
        <div className="mb-4 md:max-w-[510px] md:w-full md:py-0 md:px-2.5 md:order-2">
          <div className="text-center rounded-3xl p-6 w-full bg-card">
            <div className="w-full">
              <div className="float-right">
                <button
                  type="button"
                  className="btn-default bg-secondary text-dark rounded-lg transition-all flex justify-between items-center gap-x-2"
                  onClick={openModal}
                >
                  Share <i className="fa-regular fa-share-from-square"></i>
                </button>
              </div>

              <div className="mb-6">
                <div className="text-left font-bold text-base">
                  Help Ambros Get Critical Medical Care
                </div>
              </div>

              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuenow={calcPercent()}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ paddingTop: 9, width: `${calcPercent()}%` }}
                >
                  {calcPercent()}%
                </div>
              </div>

              <div className="text-left mb-2">
                <span className="font-bold">{calcPercent()}% </span>
                <span className="text-base">of ${stats.target} goal</span>
              </div>

              <div className="mb-4 items-center flex-col justify-center flex medium:hidden">
                <div className="items-center justify-between flex w-full">
                  <Link
                    href="#donate"
                    className="btn-primary bg-primary border-primary text-base h-[46px] rounded-[100px] w-full justify-center font-sans cursor-pointer"
                  >
                    <span>Donate</span>
                  </Link>
                </div>
              </div>

              <div className="w-full max-w-[600px] min-w-[240px] flex justify-start flex-col items-start">
                <p className="mb-2.5 mt-0 text-left whitespace-pre-line w-full overflow-hidden para-control text-sm">
                  Your donation can make a difference
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Share Emmanuel Allan&apos;s Ko-fi Goal
                  </DialogTitle>
                  <div
                    className="absolute top-4 right-4 hover:bg-disabled rounded-full h-8 w-8 flex items-center justify-center"
                    onClick={closeModal}
                  >
                    <X />
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Help Emmanuel Allan by sharing their Ko-fi goal!
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col gap-4">
                    <div className="flex justify-around">
                      <button
                        className="flex flex-col items-center"
                        onClick={() => shareOn("twitter")}
                      >
                        <i className="fab fa-twitter text-xl"></i>
                        <span className="text-xs mt-1">Twitter</span>
                      </button>

                      <button
                        className="flex flex-col items-center"
                        onClick={() => shareOn("facebook")}
                      >
                        <i className="fab fa-facebook text-xl"></i>
                        <span className="text-xs mt-1">Facebook</span>
                      </button>

                      <button
                        className="flex flex-col items-center"
                        onClick={() => shareOn("reddit")}
                      >
                        <i className="fab fa-reddit text-xl"></i>
                        <span className="text-xs mt-1">Reddit</span>
                      </button>

                      <button
                        className="flex flex-col items-center"
                        onClick={() => shareOn("discord")}
                      >
                        <i className="fab fa-discord text-xl"></i>
                        <span className="text-xs mt-1">Discord</span>
                      </button>
                    </div>

                    <p className="text-sm mt-4 mb-2">Or copy link</p>

                    <div className="w-full rounded-md border border-gray-300 p-2 flex justify-between items-center py-2">
                      <LinkIcon className="mx-2" />

                      <input
                        className="w-full outline-0 focus:ring-0 focus:ring-offset-0 bg-transparent text-sm border-none"
                        type="text"
                        value="https://remotask.org"
                        readOnly
                      />

                      <button
                        className="bg-secondary text-dark text-sm rounded-md px-4 transition-all duration-300 py-2 mr-2 hover:bg-dark hover:text-white"
                        onClick={() => shareOn("copy")}
                      >
                        <Copy />
                      </button>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
