// "use client";
//
// import { useState, Fragment } from "react";
// import { useForm } from "react-hook-form";
// import {
//   Dialog,
//   DialogPanel,
//   DialogTitle,
//   RadioGroup,
//   Transition,
// } from "@headlessui/react";
// import { AnimatePresence, motion } from "framer-motion";
// import axios from "axios";
// import { toast } from "sonner";
// import Confetti from "react-confetti";
// import { CreditCard, X } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
//
// const paymentMethods = [
//   { title: "card", image: "card.svg" },
//   { title: "paypal", image: "paypal.svg" },
//   { title: "mpesa", image: "mpesa.svg" },
// ];
//
// const validateEmail = (email) => {
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   return emailRegex.test(email);
// };
//
// const CARD_PATTERNS = {
//   visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
//   mastercard:
//     /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
//   amex: /^3[47][0-9]{13}$/,
// };
//
// const validateCardNumber = (cardNumber) => {
//   const cleanedNumber = cardNumber.replace(/\D/g, "");
//
//   // Check if the card number matches any of the patterns
//   const isValidPattern = Object.values(CARD_PATTERNS).some((pattern) =>
//     pattern.test(cleanedNumber),
//   );
//   if (!isValidPattern) return false;
//
//   // Luhn algorithm
//   let sum = 0;
//   let isEven = false;
//   for (let i = cleanedNumber.length - 1; i >= 0; i--) {
//     let digit = parseInt(cleanedNumber.charAt(i), 10);
//     if (isEven) {
//       digit *= 2;
//       if (digit > 9) {
//         digit -= 9;
//       }
//     }
//     sum += digit;
//     isEven = !isEven;
//   }
//   return sum % 10 === 0;
// };
//
// const formatCardNumber = (value) => {
//   const cleanedValue = value.replace(/\D/g, "");
//   let formattedValue = "";
//
//   if (CARD_PATTERNS.amex.test(cleanedValue)) {
//     // Format for American Express: XXXX XXXXXX XXXXX
//     formattedValue = cleanedValue.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3");
//   } else {
//     // Format for Visa and Mastercard: XXXX XXXX XXXX XXXX
//     formattedValue = cleanedValue.replace(/(\d{4})(?=\d)/g, "$1 ");
//   }
//
//   return formattedValue.trim();
// };
//
// const getCardType = (cardNumber) => {
//   const cleanedNumber = cardNumber.replace(/\D/g, "");
//   if (CARD_PATTERNS.visa.test(cleanedNumber)) return "visa";
//   if (CARD_PATTERNS.mastercard.test(cleanedNumber)) return "mastercard";
//   if (CARD_PATTERNS.amex.test(cleanedNumber)) return "amex";
//   return "unknown";
// };
//
// const formatExpiryDate = (value) => {
//   const cleanedValue = value.replace(/[^\d]/g, "");
//   if (cleanedValue.length <= 2) return cleanedValue;
//   return `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2, 4)}`;
// };
//
// const validateExpiry = (expiry) => {
//   const [month, year] = expiry.split("/");
//   const currentYear = new Date().getFullYear() % 100;
//   const currentMonth = new Date().getMonth() + 1;
//
//   if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
//   if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) return false;
//   if (parseInt(year, 10) < currentYear) return false;
//   return !(
//     parseInt(year, 10) === currentYear && parseInt(month, 10) < currentMonth
//   );
// };
//
// const validateCVC = (cvc) => {
//   return /^\d{3,4}$/.test(cvc);
// };
//
// const validateMpesaPhone = (phone) => {
//   return /^[17]\d{8}$/.test(phone);
// };
//
// const InputField = ({ label, name, register, error, ...props }) => (
//   <label className="block text-sm">
//     {label}
//     <input
//       name={name}
//       {...register}
//       className={`bg-form border mt-2 font-sans font-semibold border-gray-300 focus:ring-0 focus:ring-offset-0 text-dark text-base h-[46px] leading-6 transition-all rounded-lg outline-none focus:border-dark block w-full py-2 px-4 placeholder:font-normal placeholder:text-sm ${
//         error ? "border-red-500" : "border-gray-300"
//       }`}
//       {...props}
//     />
//     {error && <p className="mt-2 text-sm text-red-500">{error.message}</p>}
//   </label>
// );
//
// const PhoneInputField = ({ label, name, register, error, ...props }) => {
//   return (
//     <label className="block text-sm">
//       {label}
//       <div className="relative mt-2">
//         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//           <Image
//             src="/images/kenya-flag.svg"
//             alt="Kenya Flag"
//             width={20}
//             height={15}
//           />
//           <span className="ml-2 text-gray-500 font-semibold">+254</span>
//         </div>
//         <input
//           type="tel"
//           inputMode="numeric"
//           {...register}
//           className={`bg-form border font-sans font-semibold border-gray-300 focus:ring-0 focus:ring-offset-0 text-dark text-base h-[46px] leading-6 transition-all rounded-lg outline-none focus:border-dark block w-full py-2 pl-24 pr-4 placeholder:font-normal placeholder:text-sm ${
//             error ? "border-red-500" : "border-gray-300"
//           }`}
//           {...props}
//         />
//       </div>
//       {error && <p className="mt-2 text-sm text-red-500">{error.message}</p>}
//     </label>
//   );
// };
//
// export default function PaymentMethod({
//   isPaymentModalOpen,
//   setIsPaymentModalOpen,
//   config,
// }) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     trigger,
//   } = useForm({
//     defaultValues: {
//       email: "",
//       cardNumber: "",
//       expiry: "",
//       cvc: "",
//       mpesaPhone: "",
//       paypalEmail: "",
//     },
//   });
//
//   const [formData, setFormData] = useState({
//     amount: config.amount,
//     message: config.message,
//     isPrivate: config.isPrivate,
//     name: config.name,
//     chaiCount: config.chaiCount,
//     paymentMethod: "card",
//   });
//
//   const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
//   const router = useRouter();
//
//   const handlePaypalPayment = async (paymentData) => {
//     try {
//       const response = await axios.post("/api/paypal", paymentData);
//
//       if (response.data.approvalUrl) {
//         router.push(response.data.approvalUrl);
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "An error occurred during PayPal payment",
//       );
//     }
//   };
//
//   const onSubmit = async (data) => {
//     try {
//       let paymentData = {
//         email: data.email,
//         amount: formData.amount,
//         paymentMethod: formData.paymentMethod,
//         name: formData.name,
//         message: formData.message,
//         isPrivate: formData.isPrivate,
//         chaiCount: formData.chaiCount,
//       };
//
//       switch (formData.paymentMethod) {
//         case "card":
//           paymentData.cardDetails = {
//             cardNumber: data.cardNumber,
//             expiry: data.expiry,
//             cvc: data.cvc,
//           };
//           break;
//         case "mpesa":
//           paymentData.mpesaPhone = data.mpesaPhone;
//           break;
//         case "paypal":
//           paymentData.paypalEmail = data.paypalEmail;
//           const paypalResponse = await handlePaypalPayment(paymentData);
//           if (paypalResponse.error) throw new Error(paypalResponse.error);
//           break;
//
//         default:
//           toast.error("Invalid payment method selected");
//       }
//
//       setIsPaymentSuccessful(true);
//       toast.success("Payment successful! 🎉");
//       clearFormFields();
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "An error occurred during payment",
//       );
//     }
//   };
//
//   const clearFormFields = () => {
//     setValue("email", "");
//     setValue("cardNumber", "");
//     setValue("expiry", "");
//     setValue("cvc", "");
//     setValue("mpesaPhone", "");
//     setValue("paypalEmail", "");
//   };
//
//   const renderPaymentMethodFields = () => {
//     return (
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={formData.paymentMethod}
//           initial={{ opacity: 0, height: 0 }}
//           animate={{ opacity: 1, height: "auto" }}
//           exit={{ opacity: 0, height: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           {formData.paymentMethod === "card" && (
//             <div className="mt-4 space-y-4 grid gap-x-2">
//               <InputField
//                 label="Card Number"
//                 name="cardNumber"
//                 register={register("cardNumber", {
//                   required: "Card number is required",
//                   validate: (value) =>
//                     validateCardNumber(value) || "Invalid card number",
//                   onChange: (e) => {
//                     const value = e.target.value.replace(/\D/g, "");
//                     const formattedValue = formatCardNumber(value);
//                     setValue("cardNumber", formattedValue);
//                     trigger("cardNumber");
//                   },
//                 })}
//                 error={errors.cardNumber}
//                 placeholder="1234 5678 9123 0000"
//                 maxLength={19}
//                 type="text"
//                 inputMode="numeric"
//                 pattern="[0-9\s]*"
//               />
//               <div className="grid grid-cols-2 gap-x-2">
//                 <InputField
//                   label="Expiry Date"
//                   name="expiry"
//                   register={register("expiry", {
//                     required: "Expiry date is required",
//                     validate: (value) =>
//                       validateExpiry(value) || "Invalid expiry date",
//                     onChange: (e) => {
//                       setValue("expiry", formatExpiryDate(e.target.value));
//                       trigger("expiry");
//                     },
//                   })}
//                   error={errors.expiry}
//                   placeholder="MM/YY"
//                   maxLength={5}
//                 />
//                 <InputField
//                   label="CVC"
//                   name="cvc"
//                   register={register("cvc", {
//                     required: "CVC is required",
//                     validate: (value) => validateCVC(value) || "Invalid CVC",
//                     onChange: (e) => {
//                       const value = e.target.value.replace(/[^\d]/g, "");
//                       setValue("cvc", value);
//                       trigger("cvc");
//                     },
//                   })}
//                   error={errors.cvc}
//                   placeholder="CVC"
//                   maxLength={4}
//                   type="text"
//                   inputMode="numeric"
//                   pattern="[0-9]*"
//                 />
//               </div>
//             </div>
//           )}
//           {formData.paymentMethod === "mpesa" && (
//             <PhoneInputField
//               label="M-Pesa Phone Number"
//               name="mpesaPhone"
//               register={register("mpesaPhone", {
//                 required: "M-Pesa phone number is required",
//                 validate: (value) =>
//                   validateMpesaPhone(value) || "Invalid M-Pesa phone number",
//                 onChange: (e) => {
//                   const value = e.target.value.replace(/\D/g, "").slice(0, 9);
//                   setValue("mpesaPhone", value);
//                   trigger("mpesaPhone");
//                 },
//               })}
//               error={errors.mpesaPhone}
//               placeholder="712345678"
//               maxLength={9}
//             />
//           )}
//           {formData.paymentMethod === "paypal" && (
//             <InputField
//               label="PayPal Email"
//               name="paypalEmail"
//               register={register("paypalEmail", {
//                 required: "PayPal email is required",
//                 validate: (value) =>
//                   validateEmail(value) || "Invalid PayPal email",
//               })}
//               error={errors.paypalEmail}
//               placeholder="your-email@example.com"
//             />
//           )}
//         </motion.div>
//       </AnimatePresence>
//     );
//   };
//
//   return (
//     <>
//       <Transition appear show={isPaymentModalOpen} as={Fragment}>
//         <Dialog
//           as="div"
//           className="relative z-10"
//           onClose={() => {
//             setIsPaymentModalOpen(false);
//             setIsPaymentSuccessful(false); // Stop confetti
//           }}
//         >
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black bg-opacity-50" />
//           </Transition.Child>
//
//           <div className="fixed inset-0 overflow-y-auto transition-all duration-500">
//             {isPaymentSuccessful && <Confetti />}
//             <div className="flex min-h-full items-center justify-center p-4 text-center">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <DialogPanel className="w-full max-w-md transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all relative">
//                   <div className="bg-white rounded-3xl mt-8 xs:pt-8 xs:rounded-b-none xs:mt-20 p-8 xs:p-4">
//                     <div className="flex justify-center mb-6">
//                       <Image
//                         src="/images/profile.webp"
//                         alt="emmanuelallan"
//                         width={100}
//                         height={100}
//                         className="object-cover bg-cover border-4 border-white rounded-full absolute -top-6 xs:top-6"
//                       />
//                     </div>
//                     <button
//                       onClick={() => {
//                         setIsPaymentModalOpen(false);
//                         setIsPaymentSuccessful(false); // Stop confetti
//                         clearFormFields();
//                       }}
//                       className="cursor-pointer rounded-full flex items-center justify-center tw-scale-on-hover close-bg-transition hover:before:bg-dark/5 w-8 h-8 absolute right-4 top-4 xs:top-24 xs:top-22"
//                     >
//                       <X />
//                     </button>
//
//                     <DialogTitle as="div" className="text-center mb-4">
//                       <div className="text-2xl text-dark font-cr-book">
//                         {isPaymentSuccessful ? (
//                           <div className="flex flex-col gap-y-2">
//                             <span className="font-semibold">
//                               Congratulations! 🎉
//                             </span>
//                             <span className="font-semibold text-xl">
//                               We&apos;ve received your support of $
//                               {config.amount}
//                             </span>
//                           </div>
//                         ) : (
//                           <>
//                             Support{" "}
//                             <span className="font-semibold">
//                               Emmanuel Allan
//                             </span>
//                           </>
//                         )}
//                       </div>
//                       <div className="text-sm text-grey71 font-cr-book mt-1">
//                         {isPaymentSuccessful ? (
//                           <div className="mx-auto">
//                             <Image
//                               src="/images/success.svg"
//                               alt="checkmark"
//                               width={80}
//                               height={80}
//                               className="h-20 w-20 mx-auto"
//                             />
//                           </div>
//                         ) : (
//                           <>
//                             You&apos;ll be charged{" "}
//                             <span className="font-cr-medium">
//                               ${config.amount}
//                             </span>
//                           </>
//                         )}
//                       </div>
//                     </DialogTitle>
//
//                     {isPaymentSuccessful ? (
//                       <div className="text-center mt-6">
//                         <h2 className="text-xl font-semibold text-green-600">
//                           Thank you for your support! 🎉
//                         </h2>
//                         <p className="mt-2 text-sm text-gray-600">
//                           You have successfully paid ${config.amount}. Please
//                           check your email for the receipt.
//                         </p>
//                         <button
//                           onClick={() => {
//                             setIsPaymentModalOpen(false);
//                             setIsPaymentSuccessful(false); // Stop confetti
//                           }}
//                           className="mt-4 inline-flex justify-center items-center gap-x-2 w-full rounded-full border border-transparent bg-dark px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-dark/90 focus:outline-none focus:ring-2 focus:ring-dark focus:ring-offset-2"
//                         >
//                           Close
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="mt-5">
//                         <InputField
//                           label="Email"
//                           name="email"
//                           register={register("email", {
//                             required: "Email is required",
//                             validate: (value) =>
//                               validateEmail(value) || "Invalid email address",
//                           })}
//                           error={errors.email}
//                         />
//
//                         <div className="py-8 text-dark/50 font-regular text-xs tracking-widest flex items-center justify-center">
//                           <span className="block w-full bg-[#e5e5e5] h-px"></span>
//                           <span className="bg-white p-2 absolute">
//                             PAY WITH
//                           </span>
//                         </div>
//
//                         <RadioGroup
//                           value={formData.paymentMethod}
//                           onChange={(value) =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               paymentMethod: value,
//                             }))
//                           }
//                           className="space-x-2 grid grid-cols-3 gap-x-2 flex-wrap mb-4"
//                         >
//                           {paymentMethods.map((method) => (
//                             <RadioGroup.Option
//                               key={method.title}
//                               value={method.title}
//                               className={({ active, checked }) =>
//                                 `group relative flex flex-col cursor-pointer items-center text-sm rounded-lg py-2 px-5 text-dark/70 border border-border transition focus:outline-none ${
//                                   active
//                                     ? "ring-2 ring-offset-2 ring-primary"
//                                     : ""
//                                 } ${
//                                   checked ? "border-primary bg-primary/20" : ""
//                                 }`
//                               }
//                             >
//                               {({ checked }) => (
//                                 <motion.div
//                                   initial={false}
//                                   animate={{ scale: checked ? 1.05 : 1 }}
//                                   transition={{ duration: 0.2 }}
//                                   className="flex flex-col items-center"
//                                 >
//                                   <div className={`relative mx-auto h-8 w-20`}>
//                                     <Image
//                                       src={`/images/${method.image}`}
//                                       alt={method.title}
//                                       fill
//                                       objectFit="contain"
//                                     />
//                                   </div>
//                                   <RadioGroup.Label
//                                     as="p"
//                                     className="text-xs mt-1 sr-only"
//                                   >
//                                     {method.title}
//                                   </RadioGroup.Label>
//                                 </motion.div>
//                               )}
//                             </RadioGroup.Option>
//                           ))}
//                         </RadioGroup>
//
//                         {renderPaymentMethodFields()}
//                       </div>
//                     )}
//
//                     {!isPaymentSuccessful && (
//                       <div className="mt-6">
//                         <button
//                           type="button"
//                           className={`inline-flex justify-center items-center gap-x-2 w-full rounded-full border border-transparent bg-dark px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-dark/90 focus:outline-none focus:ring-2 focus:ring-dark focus:ring-offset-2`}
//                           onClick={handleSubmit(onSubmit)}
//                         >
//                           {formData.paymentMethod === "card" ? (
//                             <span className="flex items-center gap-x-2 font-semibold text-base">
//                               <CreditCard />
//                               Pay
//                             </span>
//                           ) : formData.paymentMethod === "mpesa" ? (
//                             <span className="flex items-center gap-x-2 font-semibold text-base">
//                               <Image
//                                 src="/images/mp.svg"
//                                 alt="mpesa"
//                                 width={15}
//                                 height={20}
//                               />
//                               Pay
//                             </span>
//                           ) : (
//                             <span className="flex items-center gap-x-2 font-semibold text-base">
//                               <Image
//                                 src="/images/pp.svg"
//                                 alt="PayPal"
//                                 width={20}
//                                 height={20}
//                               />
//                               Pay
//                             </span>
//                           )}
//                         </button>
//                       </div>
//                     )}
//
//                     <div className="mx-auto text-xs text-center w-11/12 font-cr-book text-grey71 mt-5">
//                       Payment secured by{" "}
//                       <span className="font-bold">Paystack</span>. You&apos;ll
//                       be taken to a thank you page after the payment.{" "}
//                       <a
//                         href="/terms"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="underline capitalize"
//                       >
//                         Terms
//                       </a>{" "}
//                       and{" "}
//                       <a
//                         href="/privacy-policy"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="underline capitalize"
//                       >
//                         Privacy
//                       </a>
//                       .
//                     </div>
//                   </div>
//                 </DialogPanel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//     </>
//   );
// }

export default function PaymentMethod() {
  return <div>Payment Method</div>;
}
