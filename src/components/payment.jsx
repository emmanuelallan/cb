"use client";

import { useState, useCallback, useMemo, Fragment } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Info, X } from "lucide-react";
import { toast } from "sonner";
import PaypalHandler from "@/components/paypalHandler";
import { PRODUCTS, MIN_CHAI, MAX_CHAI, CHAI_PRICE } from "@/utils/payment";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Payment() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    chaiCount: MIN_CHAI,
    amount: MIN_CHAI * CHAI_PRICE,
    name: "",
    email: "",
    message: "",
    isPrivate: false,
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChaiChange = useCallback((amount) => {
    setFormData((prev) => {
      const newChaiCount = Math.max(
        MIN_CHAI,
        Math.min(MAX_CHAI, prev.chaiCount + amount)
      );
      return {
        ...prev,
        chaiCount: newChaiCount,
        amount: newChaiCount * CHAI_PRICE,
      };
    });
  }, []);

  const validateAmount = useCallback((amount) => {
    if (amount < 5) return `Please enter an amount of at least \$5`;
    if (amount > MAX_CHAI * CHAI_PRICE)
      return `The maximum amount is $${MAX_CHAI * CHAI_PRICE}`;
    return null;
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      let newState = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "amount") {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
          newState = {
            ...newState,
            amount: numValue,
            chaiCount: Math.max(MIN_CHAI, Math.floor(numValue / CHAI_PRICE)),
          };
        }
      } else if (name === "chaiCount") {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
          const newChaiCount = Math.max(MIN_CHAI, Math.min(MAX_CHAI, numValue));
          newState = {
            ...newState,
            chaiCount: newChaiCount,
            amount: newChaiCount * CHAI_PRICE,
          };
        }
      }

      return newState;
    });

    setFormErrors((prev) => {
      let newErrors = { ...prev };
      if (name === "email")
        newErrors.email = validateEmail(value)
          ? null
          : "Please enter a valid email address";
      return newErrors;
    });
  }, []);

  const handleProductPledge = useCallback((product) => {
    const chaiCount = Math.floor(product.price / (CHAI_PRICE * 100));
    setFormData((prev) => ({
      ...prev,
      chaiCount: chaiCount,
      amount: chaiCount * CHAI_PRICE,
    }));
    toast.success(
      `Pledge amount updated to ${chaiCount} chai ($${(chaiCount * CHAI_PRICE).toFixed(2)})`
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleAmountBlur = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      amount: Math.max(5, prev.amount),
    }));
    setFormErrors((prev) => ({
      ...prev,
      amount: validateAmount(Math.max(5, formData.amount)),
    }));
  }, [formData.amount, validateAmount]);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.email) errors.email = "At least an email address is required";
    else if (!validateEmail(formData.email))
      errors.email = "Please enter a valid email address";
    const amountError = validateAmount(formData.amount);
    if (amountError) errors.amount = amountError;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, validateAmount]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (validateForm()) setIsPaymentModalOpen(true);
    },
    [validateForm]
  );

  const config = useMemo(
    () => ({
      reference: new Date().getTime().toString(),
      amount: formData.chaiCount * CHAI_PRICE,
      currency: "USD",
      customer: {
        name: formData.name,
        email: formData.email,
      },
    }),
    [formData]
  );

  const clearForm = useCallback(() => {
    setFormData({
      chaiCount: MIN_CHAI,
      amount: MIN_CHAI * CHAI_PRICE,
      name: "",
      email: "",
      message: "",
      isPrivate: false,
    });
    setFormErrors({});
  }, []);

  const openProductModal = useCallback((product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  }, []);

  const closeProductModal = useCallback(() => {
    setSelectedProduct(null);
    setIsProductModalOpen(false);
  }, []);

  const ProductModal = ({ product, isOpen, onClose }) => {
    if (!product) return null;

    return (
      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={onClose} className="relative z-50">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl relative">
                  <DialogTitle className="text-lg font-medium text-gray-900">
                    {product.title}
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="cursor-pointer rounded-full flex items-center justify-center tw-scale-on-hover close-bg-transition hover:before:bg-dark/5 w-8 h-8 absolute right-4 top-4"
                  >
                    <X />
                  </button>

                  <div className="mt-4">
                    <div
                      className="aspect-video w-full rounded-lg bg-cover bg-center bg-green-200"
                      style={{ backgroundImage: `url(${product.imageUrl})` }}
                    />
                    <p className="mt-4 text-base text-gray-500">
                      {product.description}
                    </p>

                    {/* Price Section */}
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Price: ${product.price / 100}
                      </h3>
                    </div>

                    {/* Tracklist Section */}
                    {product.tracklist && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Tracklist
                        </h3>
                        <ul className="list-disc list-inside text-gray-500 mt-2">
                          {product.tracklist.map((track, index) => (
                            <li key={index}>{track}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Special Features Section */}
                    {product.specialFeatures && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Special Features
                        </h3>
                        <ul className="list-disc list-inside text-gray-500 mt-2">
                          {product.specialFeatures.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Purchase Button */}
                    <button
                      className="mt-4 w-full bg-primary text-white rounded-full flex items-center justify-center font-semibold font-sans border-none py-3 px-4"
                      onClick={() => {
                        handleProductPledge(product);
                        onClose();
                      }}
                    >
                      Pledge ${product.price / 100}
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  };

  return (
    <div id="donate" className="md:w-full md:py-0 md:px-2.5">
      <div className="space-y-4 md:contents lg:max-w-[400px] lg:w-screen max-w-[400px] w-[400px] min-w-[285px] md:max-w-[550px] md:min-w-[285px]">
        <div className="col-span-1 before:table">
          <div className="h-auto max-w-screen w-full min-w-[285px] p-6 m-auto bg-card rounded-3xl shadow-none">
            <div className="flex flex-col w-full">
              <div className="mb-4 flex items-start justify-between">
                <span className="font-bold text-base text-limit-one-line">
                  Make a pledge in chai without a reward
                </span>
              </div>

              <form className="w-full" onSubmit={handleSubmit}>
                <div className="flex justify-start flex-row items-center my-2">
                  <div className="w-full flex justify-between items-center">
                    <div className="w-auto justify-start mb-4 flex flex-row items-center">
                      <Image
                        src="/images/chai.svg"
                        alt="Donation cup"
                        className="mr-2 object-cover bg-center align-middle"
                        width={43}
                        height={28}
                      />
                      <div className="w-auto">
                        <div className="max-w-20 break-words text-base">
                          1 chai = ${CHAI_PRICE}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mb-2 gap-x-1">
                      <button
                        type="button"
                        className="w-[46px] h-[46px] bg-primary/30 text-primary text-[20px] flex justify-center items-center rounded-full font-semibold cursor-pointer disabled:bg-gray-200 disabled:border-gray-300 disabled:border disabled:text-gray-400"
                        onClick={() => handleChaiChange(-1)}
                        disabled={formData.chaiCount <= MIN_CHAI}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={MIN_CHAI}
                        max={MAX_CHAI}
                        name="chaiCount"
                        value={formData.chaiCount}
                        onChange={handleInputChange}
                        className="bg-card text-dark my-0 mx-0.5 inline-block align-top text-[18px] leading-[30px] py-2 px-0.5 max-w-[55px] min-w-[70px] border-[0.5px] border-gray-300 rounded-[100px] text-center bg-none shadow-none transition-all outline-none focus:border-dark ap-none"
                      />
                      <button
                        type="button"
                        className="w-[46px] h-[46px] bg-primary/30 text-primary text-[20px] flex justify-center items-center rounded-full font-semibold cursor-pointer disabled:bg-gray-200 disabled:border-gray-300 disabled:border disabled:text-gray-400"
                        onClick={() => handleChaiChange(1)}
                        disabled={formData.chaiCount >= MAX_CHAI}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="max-w-full mx-auto">
                    <label htmlFor="amount" className="sr-only">
                      Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none text-dark font-sans">
                        $
                      </div>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        onBlur={handleAmountBlur}
                        min={5}
                        max={MAX_CHAI * CHAI_PRICE}
                        step="1"
                        onKeyDown={(e) => {
                          if (e.key === "e" || e.key === ".") {
                            e.preventDefault();
                          }
                        }}
                        className="bg-form border font-semibold border-gray-300 focus:ring-0 focus:ring-offset-0 font-sans text-dark text-base h-[46px] leading-6 transition-all rounded-lg outline-none focus:border-dark block w-full ps-7 py-2 px-4"
                      />
                    </div>
                    {formErrors.amount && (
                      <p className="mt-2 text-sm text-red-400">
                        {formErrors.amount}
                      </p>
                    )}
                  </div>

                  <div className="max-w-full mx-auto">
                    <label htmlFor="name" className="sr-only">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-form border font-semibold border-gray-300 focus:ring-0 focus:ring-offset-0 font-sans text-dark text-base h-[46px] leading-6 transition-all rounded-lg outline-none focus:border-dark block w-full py-2 px-4 placeholder:font-normal"
                      placeholder="Your name or nickname"
                    />
                  </div>

                  <div className="max-w-full mx-auto">
                    <label htmlFor="email" className="sr-only">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`bg-form border font-semibold border-gray-300 focus:ring-0 focus:ring-offset-0 font-sans text-dark text-base h-[46px] leading-6 transition-all rounded-lg outline-none focus:border-dark block w-full py-2 px-4 placeholder:font-normal ${
                        formErrors.email ? "border-red-500" : ""
                      }`}
                      placeholder="Your email address"
                    />
                    {formErrors.email && (
                      <p className="mt-2 text-sm text-red-400">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="max-w-full mx-auto">
                    <label htmlFor="message" className="sr-only">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="bg-form border font-semibold border-gray-300 focus:ring-0 focus:ring-offset-0 font-sans text-dark text-base h-auto leading-6 transition-all rounded-lg outline-none focus:border-dark block w-full py-2 px-4 placeholder:font-normal"
                      rows={2}
                      placeholder="Your message (optional)"
                      maxLength={280}
                    ></textarea>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="isPrivate"
                      type="checkbox"
                      name="isPrivate"
                      checked={formData.isPrivate}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-dark bg-form focus:ring-0 focus:ring-offset-0 border-gray-300 rounded outline-none"
                    />
                    <label
                      htmlFor="isPrivate"
                      className="ms-2 text-base text-dark font-semibold inline-flex gap-x-2 h-4 w-4 rounded outline-none border-gray-300 whitespace-nowrap items-center"
                    >
                      Private message?{" "}
                      <span
                        className="text-muted"
                        title="Only you and the creator will see this message"
                      >
                        <Info size={20} />
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="bg-primary text-white rounded-full w-full flex items-center justify-center font-semibold font-sans border-none py-3 px-4"
                  >
                    Donate {formData.chaiCount} chai ($
                    {(formData.chaiCount * CHAI_PRICE).toFixed(2)})
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Products Section */}
        {PRODUCTS.map((product) => (
          <div key={product.id} className="col-span-">
            <div className="p-6 rounded-3xl bg-card w-full space-y-4">
              <div className="overflow-hidden rounded-lg group bg-accent">
                <div
                  className="w-full bg-green-200 rounded-lg aspect-video bg-cover bg-center h-auto relative z-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                  style={{ backgroundImage: `url(${product.imageUrl})` }}
                ></div>
              </div>
              <div className="mb-4 flex justify-between items-center">
                <span className="font-semibold text-xl max-w-[70%] font-sans line-clamp-2">
                  {product.title}
                </span>
                <span className="font-semibold text-2xl font-sans">
                  ${product.price / 100}
                </span>
              </div>
              <div className="w-full max-w-[600px] min-w-[240px] mb-2">
                <p className="w-full overflow-hidden para-control !line-clamp-3">
                  {product.description}
                </p>
              </div>
              <div className="flex w-full justify-between items-center">
                <button
                  type="button"
                  className="btn-primary text-dark border-gray-300 border rounded-lg"
                  onClick={() => openProductModal(product)}
                >
                  Details
                </button>
                <button
                  type="button"
                  className="btn-primary bg-primary border-none font-semibold text-center text-white rounded-full"
                  onClick={() => handleProductPledge(product)}
                >
                  {`Pledge $${product.price / 100}`}
                </button>
              </div>
            </div>
          </div>
        ))}

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            isOpen={isProductModalOpen}
            onClose={closeProductModal}
          />
        )}
      </div>
      <PaypalHandler
        isPaymentModalOpen={isPaymentModalOpen}
        setIsPaymentModalOpen={setIsPaymentModalOpen}
        config={config}
        onSuccess={clearForm}
      />
    </div>
  );
}
