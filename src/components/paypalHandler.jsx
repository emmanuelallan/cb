"use client";

import { useState, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import Confetti from "react-confetti";
import { X } from "lucide-react";
import Image from "next/image";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export default function PaypalHandler({
  isPaymentModalOpen,
  setIsPaymentModalOpen,
  config,
  onSuccess,
}) {
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCloseModal = () => {
    setIsPaymentModalOpen(false);
    setIsPaymentSuccessful(false);
    if (isPaymentSuccessful) {
      onSuccess();
    }
  };

  const handlePaypalPayment = async (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: config.amount,
          },
        },
      ],
    });
  };

  const onPaypalApprove = async (data, actions) => {
    setIsProcessing(true);
    try {
      const details = await actions.order.capture();
      const transactionData = {
        name: config.customer.name || "",
        email: config.customer.email,
        message: config.message || "",
        amount: config.amount,
        chaiCount: config.chaiCount,
        isPrivate: config.isPrivate,
        paypalEmail: details.payer.email_address,
        transactionId: details.id,
        paymentMethod: "paypal",
      };

      const response = await axios.post("/api/transactions", transactionData);

      if (response.status === 200 && response.data.success) {
        setIsPaymentSuccessful(true);
        toast.success("PayPal payment successful! 🎉");
      } else {
        throw new Error("Transaction failed on server");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(
        error.response?.data?.error ||
          "An error occurred during payment. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentSuccess = () => (
    <div className="text-center mt-6">
      <h2 className="text-xl font-semibold text-green-600">
        Thank you for your support! 🎉
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        You have successfully paid ${config.amount}. Please check your email for
        the receipt.
      </p>
      <button
        onClick={handleCloseModal}
        className="mt-4 inline-flex justify-center items-center gap-x-2 w-full rounded-full border border-transparent bg-dark px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-dark/90 focus:outline-none focus:ring-2 focus:ring-dark focus:ring-offset-2"
      >
        Close
      </button>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="mt-5">
      <div className="py-8 text-dark/50 font-regular text-xs tracking-widest flex items-center justify-center">
        <span className="block w-full bg-[#e5e5e5] h-px"></span>
        <span className="bg-white p-2 absolute">PAY WITH</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key="paypal"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID }}>
            <PayPalButtons
              createOrder={handlePaypalPayment}
              onApprove={onPaypalApprove}
              style={{ layout: "vertical" }}
              disabled={isProcessing}
            />
          </PayPalScriptProvider>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <Transition appear show={isPaymentModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto transition-all duration-500">
          {isPaymentSuccessful && <Confetti />}
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
              <DialogPanel className="w-full max-w-md transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all relative">
                <div className="bg-white rounded-3xl mt-8 xs:pt-8 xs:rounded-b-none xs:mt-20 p-8 xs:p-4">
                  <div className="flex justify-center mb-6">
                    <Image
                      src="/images/profile.webp"
                      alt="emmanuelallan"
                      width={100}
                      height={100}
                      className="object-cover bg-cover border-4 border-white rounded-full absolute -top-6 xs:top-6"
                    />
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="cursor-pointer rounded-full flex items-center justify-center tw-scale-on-hover close-bg-transition hover:before:bg-dark/5 w-8 h-8 absolute right-4 top-4 xs:top-24 xs:top-22"
                  >
                    <X />
                  </button>

                  <DialogTitle as="div" className="text-center mb-4">
                    <div className="text-2xl text-dark font-cr-book">
                      {isPaymentSuccessful ? (
                        <div className="flex flex-col gap-y-2">
                          <span className="font-semibold">
                            Congratulations! 🎉
                          </span>
                          <span className="font-semibold text-xl">
                            We&apos;ve received your support of ${config.amount}
                          </span>
                        </div>
                      ) : (
                        <>
                          Support{" "}
                          <span className="font-semibold">Emmanuel Allan</span>
                        </>
                      )}
                    </div>
                    <div className="text-sm text-grey71 font-cr-book mt-1">
                      {isPaymentSuccessful ? (
                        <div className="mx-auto">
                          <Image
                            src="/images/success.svg"
                            alt="checkmark"
                            width={80}
                            height={80}
                            className="h-20 w-20 mx-auto"
                          />
                        </div>
                      ) : (
                        <>
                          You&apos;ll be charged{" "}
                          <span className="font-cr-medium">
                            ${config.amount}
                          </span>
                        </>
                      )}
                    </div>
                  </DialogTitle>

                  {isPaymentSuccessful
                    ? renderPaymentSuccess()
                    : renderPaymentForm()}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
