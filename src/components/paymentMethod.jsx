"use client";

import { useState, Fragment, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  RadioGroup,
  Transition,
} from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import Confetti from "react-confetti";
import { CreditCard, X } from "lucide-react";
import Image from "next/image";

const paymentMethods = [
  { title: "card", image: "card.svg" },
  { title: "paypal", image: "paypal.svg" },
  { title: "mpesa", image: "mpesa.svg" },
];

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(" ");
  } else {
    return value;
  }
};

const formatExpiryDate = (value) => {
  const cleanedValue = value.replace(/[^\d]/g, "");
  if (cleanedValue.length <= 2) return cleanedValue;
  return `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2, 4)}`;
};

const validateCardNumber = (cardNumber) => {
  // Remove spaces and dashes
  const cleanedNumber = cardNumber.replace(/[\s-]/g, "");

  // Check if it's a valid card number using Luhn algorithm
  let sum = 0;
  let isEven = false;
  for (let i = cleanedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanedNumber.charAt(i), 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
};

const validateCardType = (cardNumber) => {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cardNumber)) {
      return type;
    }
  }
  return null;
};

const validateExpiry = (expiry) => {
  const [month, year] = expiry.split("/");
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;

  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
  if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) return false;
  if (parseInt(year, 10) < currentYear) return false;
  return !(
    parseInt(year, 10) === currentYear && parseInt(month, 10) < currentMonth
  );
};

const validateCVC = (cvc) => {
  return /^\d{3,4}$/.test(cvc);
};

const validateMpesaPhone = (phone) => {
  return /^(?:\+254|0)[17]\d{8}$/.test(phone);
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  ...props
}) => (
  <label className="block text-sm">
    {label}
    <input
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`bg-form border mt-2 font-sans font-semibold border-gray-300 focus:ring-0 focus:ring-offset-0 text-dark text-base h-[46px] leading-6 transition-all rounded-lg outline-none focus:border-dark block w-full py-2 px-4 placeholder:font-normal placeholder:text-sm ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      {...props}
    />
    {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
  </label>
);

export default function PaymentMethod({
  isPaymentModalOpen,
  setIsPaymentModalOpen,
  config,
}) {
  const [formData, setFormData] = useState({
    amount: config.amount,
    email: "",
    message: config.message,
    isPrivate: config.isPrivate,
    name: config.name,
    chaiCount: config.chaiCount,
    paymentMethod: "card",
    cardDetails: { cardNumber: "", expiry: "", cvc: "" },
    mpesaPhone: "+254",
    paypalEmail: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [touched, setTouched] = useState({});

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleCardDetailsChange = useCallback((e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (name === "expiry") {
      formattedValue = formatExpiryDate(value);
    }

    setFormData((prev) => ({
      ...prev,
      cardDetails: {
        ...prev.cardDetails,
        [name]: formattedValue,
      },
    }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.email || !validateEmail(formData.email))
      errors.email = "Invalid email address";

    const methodValidations = {
      card: () => {
        if (
          !formData.cardDetails.cardNumber ||
          !validateCardNumber(formData.cardDetails.cardNumber)
        ) {
          errors.cardNumber = "Invalid card number";
        } else {
          const cardType = validateCardType(formData.cardDetails.cardNumber);
          if (!cardType) errors.cardNumber = "Unsupported card type";
        }
        if (
          !formData.cardDetails.expiry ||
          !validateExpiry(formData.cardDetails.expiry)
        )
          errors.expiry = "Invalid expiry date";
        if (!formData.cardDetails.cvc || !validateCVC(formData.cardDetails.cvc))
          errors.cvc = "Invalid CVC";
      },
      mpesa: () => {
        if (!formData.mpesaPhone || !validateMpesaPhone(formData.mpesaPhone))
          errors.mpesaPhone = "Invalid M-Pesa phone number";
      },
      paypal: () => {
        if (!formData.paypalEmail || !validateEmail(formData.paypalEmail))
          errors.paypalEmail = "Invalid PayPal email";
      },
    };

    methodValidations[formData.paymentMethod]?.();

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handlePaymentSubmit = async () => {
    if (!validateForm()) return;

    try {
      let paymentData = {
        email: formData.email,
        amount: formData.amount * 100,
        paymentMethod: formData.paymentMethod,
      };

      switch (formData.paymentMethod) {
        case "card":
          paymentData.cardDetails = formData.cardDetails;
          break;
        case "mpesa":
          paymentData.mpesaPhone = formData.mpesaPhone;
          break;
        case "paypal":
          paymentData.paypalEmail = formData.paypalEmail;
          break;
      }

      const response = await axios.post("/api/payment", paymentData);

      if (response.status === 200) {
        setIsPaymentSuccessful(true);
        toast.success("Payment successful!");
        clearFormFields();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during payment"
      );
    }
  };

  const clearFormFields = () => {
    setFormData({
      amount: config.amount,
      email: "",
      message: config.message,
      isPrivate: config.isPrivate,
      name: config.name,
      chaiCount: config.chaiCount,
      paymentMethod: "card",
      cardDetails: { cardNumber: "", expiry: "", cvc: "" },
      mpesaPhone: "+254",
      paypalEmail: "",
    });
    setTouched({});
    setFormErrors({});
  };

  const renderPaymentMethodFields = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={formData.paymentMethod}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {formData.paymentMethod === "card" && (
            <div className="mt-4 space-y-4 grid gap-x-2">
              <InputField
                label="Card Number"
                name="cardNumber"
                value={formData.cardDetails.cardNumber}
                onChange={handleCardDetailsChange}
                error={touched.cardNumber ? formErrors.cardNumber : ""}
                placeholder="1234 5678 9123 0000"
                maxLength={19}
              />
              <div className="grid grid-cols-2 gap-x-2">
                <InputField
                  label="Expiry Date"
                  name="expiry"
                  value={formData.cardDetails.expiry}
                  onChange={handleCardDetailsChange}
                  error={touched.expiry ? formErrors.expiry : ""}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                <InputField
                  label="CVC"
                  name="cvc"
                  value={formData.cardDetails.cvc}
                  onChange={handleCardDetailsChange}
                  error={touched.cvc ? formErrors.cvc : ""}
                  placeholder="CVC"
                  maxLength={4}
                />
              </div>
            </div>
          )}
          {formData.paymentMethod === "mpesa" && (
            <InputField
              label="M-Pesa Phone Number"
              name="mpesaPhone"
              value={formData.mpesaPhone}
              onChange={handleInputChange}
              error={touched.mpesaPhone ? formErrors.mpesaPhone : ""}
              placeholder="+254 712 345 678"
            />
          )}
          {formData.paymentMethod === "paypal" && (
            <InputField
              label="PayPal Email"
              name="paypalEmail"
              value={formData.paypalEmail}
              onChange={handleInputChange}
              error={touched.paypalEmail ? formErrors.paypalEmail : ""}
              placeholder="your-email@example.com"
            />
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <>
      <Transition appear show={isPaymentModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsPaymentModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto transition-all duration-500">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all relative">
                  {/* Modal content */}
                  <div className="bg-white rounded-3xl mt-8 xs:pt-8 xs:rounded-b-none xs:mt-20 p-8 xs:p-4">
                    {/* Profile picture and close button */}
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
                      onClick={() => {
                        setIsPaymentModalOpen(false);
                        clearFormFields();
                      }}
                      className="cursor-pointer rounded-full flex items-center justify-center tw-scale-on-hover close-bg-transition hover:before:bg-dark/5 w-8 h-8 absolute right-4 top-4 xs:top-24 xs:top-22"
                    >
                      <X />
                    </button>

                    {/* Dialog title */}
                    <DialogTitle as="div" className="text-center mb-4">
                      <div className="text-2xl text-dark font-cr-book">
                        Support{" "}
                        <span className="font-semibold">Emmanuel Allan</span>
                      </div>
                      <div className="text-sm text-grey71 font-cr-book mt-1">
                        You&apos;ll be charged{" "}
                        <span className="font-cr-medium">${config.amount}</span>
                      </div>
                    </DialogTitle>

                    {/* Form fields */}
                    <div className="mt-5">
                      <InputField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={formErrors.email}
                      />

                      <div className="py-8 text-dark/50 font-regular text-xs tracking-widest flex items-center justify-center">
                        <span className="block w-full bg-[#e5e5e5] h-px"></span>
                        <span className="bg-white p-2 absolute">PAY WITH</span>
                      </div>

                      {/* Payment method selection */}
                      <RadioGroup
                        value={formData.paymentMethod}
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            paymentMethod: value,
                          }))
                        }
                        className="space-x-2 grid grid-cols-3 gap-x-2 flex-wrap mb-4"
                      >
                        {paymentMethods.map((method) => (
                          <RadioGroup.Option
                            key={method.title}
                            value={method.title}
                            className={({ active, checked }) =>
                              `group relative flex flex-col cursor-pointer items-center text-sm rounded-lg py-2 px-5 text-dark/70 border border-border transition focus:outline-none ${
                                active
                                  ? "ring-2 ring-offset-2 ring-primary"
                                  : ""
                              } ${
                                checked ? "border-primary bg-primary/20" : ""
                              }`
                            }
                          >
                            {({ checked }) => (
                              <motion.div
                                initial={false}
                                animate={{ scale: checked ? 1.05 : 1 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col items-center"
                              >
                                <div className={`relative mx-auto h-8 w-20`}>
                                  <Image
                                    src={`/images/${method.image}`}
                                    alt={method.title}
                                    fill
                                    objectFit="contain"
                                  />
                                </div>
                                <RadioGroup.Label
                                  as="p"
                                  className="text-xs mt-1 sr-only"
                                >
                                  {method.title}
                                </RadioGroup.Label>
                              </motion.div>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </RadioGroup>

                      {/* Render payment method specific fields */}
                      {renderPaymentMethodFields()}
                    </div>

                    {/* Submit button */}
                    <div className="mt-6">
                      <button
                        type="button"
                        className={`inline-flex justify-center items-center gap-x-2 w-full rounded-full border border-transparent bg-dark px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-dark/90 focus:outline-none focus:ring-2 focus:ring-dark focus:ring-offset-2 ${
                          isSubmitDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={handlePaymentSubmit}
                        disabled={isSubmitDisabled}
                      >
                        {formData.paymentMethod === "card" ? (
                          <span className="flex items-center gap-x-2 font-semibold text-base">
                            <CreditCard />
                            Pay
                          </span>
                        ) : formData.paymentMethod === "mpesa" ? (
                          <span className="flex items-center gap-x-2 font-semibold text-base">
                            <Image
                              src="/images/mp.svg"
                              alt="mpesa"
                              width={15}
                              height={20}
                            />
                            Pay
                          </span>
                        ) : (
                          <span className="flex items-center gap-x-2 font-semibold text-base">
                            <Image
                              src="/images/pp.svg"
                              alt="PayPal"
                              width={20}
                              height={20}
                            />
                            Pay
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Footer text */}
                    <div className="mx-auto text-xs text-center w-11/12 font-cr-book text-grey71 mt-5">
                      Payment secured by{" "}
                      <span className="font-bold">Paystack</span>. You&apos;ll
                      be taken to a thank you page after the payment.{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline capitalize"
                      >
                        Terms
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline capitalize"
                      >
                        Privacy
                      </a>
                      .
                    </div>
                  </div>
                </DialogPanel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {isPaymentSuccessful && <Confetti />}
    </>
  );
}
