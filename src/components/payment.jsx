"use client";

import { useState, Fragment } from "react";
import Image from "next/image";
import { usePaystackPayment } from "react-paystack";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X } from "lucide-react";
import { toast } from "sonner";

const PRODUCTS = [
  {
    id: 1,
    title: "Double Gatefold, White Vinyl Pack",
    price: 3499,
    description:
      "Limited edition Double Gatefold, White Vinyl Pack of Obsession...",
    imageUrl: "/images/vinyl.webp",
    pledgeText: "Pledge $34.99",
  },
  {
    id: 2,
    title: "Chillhop Essentials - Winter 2019 CD - Limited Edition",
    price: 1675,
    description:
      "Limited edition Double Gatefold, White Vinyl Pack of Obsession...",
    imageUrl: "/images/disk.webp",
    pledgeText: "Pledge $16.75",
  },
  {
    id: 3,
    title: "Chillhop Essentials - Summer 2023 Cassette Tape - Limited Edition",
    price: 1824,
    description:
      "Limited edition Double Gatefold, White Vinyl Pack of Obsession...",
    imageUrl: "/images/tape.webp",
    pledgeText: "Pledge $18.24",
  },
];

const MIN_PLEDGE = 500;
const MAX_PLEDGE = 9999900;

export default function Payment() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    pledge: MIN_PLEDGE,
    name: "",
    email: "",
    message: "",
    isPrivate: false,
  });
  const [formErrors, setFormErrors] = useState({});

  const isBrowser = () => typeof window !== "undefined";

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  const handlePledgeChange = (amount) => {
    setFormData((prev) => ({
      ...prev,
      pledge: Math.max(MIN_PLEDGE, Math.min(MAX_PLEDGE, prev.pledge + amount)),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProductPledge = (product) => {
    setFormData((prev) => ({
      ...prev,
      pledge: product.price,
    }));

    isBrowser() && window.scrollTo({ top: 0, behavior: "smooth" });
    toast.success(
      `Pledge amount updated to $${(product.price / 100).toFixed(2)}`
    );
  };

  const validateForm = () => {
    const errors = {};
    if (formData.pledge < MIN_PLEDGE || formData.pledge > MAX_PLEDGE) {
      errors.pledge = `Please enter an amount between $${
        MIN_PLEDGE / 100
      } and $${MAX_PLEDGE / 100}`;
    }
    if (!formData.email.includes("@")) {
      errors.email = "Please enter a valid email address";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      initializePayment(onSuccess, onClose);
    }
  };

  const config = {
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: formData.pledge,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  };

  const onSuccess = (reference) => {
    console.log("Payment successful. Reference:", reference);
    toast.success("Payment successful! Thank you for your pledge.");
    // Here you would typically send the payment details to your server
  };

  const onClose = () => {
    console.log("Payment window closed");
    toast.error(
      "Payment cancelled. Please try again if you wish to complete your pledge."
    );
  };

  const initializePayment = usePaystackPayment(config);

  const ProductModal = ({ product, isOpen, onClose }) => (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                  className="text-lg font-medium leading-6 text-gray-900 max-w-[92%]"
                >
                  {product.title}
                </DialogTitle>
                <button
                  className="absolute top-4 right-4 hover:bg-gray-100 rounded-full h-8 w-8 flex items-center justify-center"
                  onClick={onClose}
                >
                  <X />
                </button>
                <div className="mt-4">
                  <div
                    className="w-full bg-green-200 rounded-lg aspect-video bg-cover bg-center"
                    style={{ backgroundImage: `url(${product.imageUrl})` }}
                  />
                  <p className="text-base text-gray-500 mt-4">
                    {product.description}
                  </p>
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      className="bg-primary text-white py-2 px-4 rounded-full w-full"
                      onClick={() => {
                        handleProductPledge(product);
                        onClose();
                      }}
                    >
                      Pledge ${product.price / 100}
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );

  return (
    <div className="md:contents lg:max-w-[400px] lg:w-screen space-y-4 max-w-[400px] w-[400px] min-w-[285px] md:max-w-[550px] md:min-w-[285px]">
      <div className="col-span-1 before:table">
        <div className="h-auto max-w-screen w-full min-w-[285px] p-4 m-auto bg-card rounded-2xl shadow-none">
          <div className="flex flex-col w-full">
            <div className="mb-4 flex items-start justify-between">
              <span className="font-bold text-base text-limit-one-line">
                Make a pledge without a reward
              </span>
            </div>

            <form className="w-full" onSubmit={handleSubmit}>
              <div className="flex justify-start flex-row items-center my-2">
                <div className="w-full flex justify-between items-center">
                  <div className="w-auto justify-start mb-4 flex flex-row items-center">
                    <Image
                      src="/images/cup-border.webp"
                      alt="Donation cup"
                      className="mr-2 object-cover bg-center align-middle"
                      width={43}
                      height={28}
                    />
                    <div className="w-auto">
                      <div className="max-w-20 break-words text-base">
                        $5 each
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mb-2 gap-x-1">
                    <button
                      type="button"
                      className="w-[46px] h-[46px] bg-primary/30 text-primary text-[20px] flex justify-center items-center rounded-full font-semibold cursor-pointer disabled:bg-gray-200 disabled:border-gray-300 disabled:border disabled:text-gray-400"
                      onClick={() => handlePledgeChange(-500)}
                      disabled={formData.pledge <= MIN_PLEDGE}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={MIN_PLEDGE / 100}
                      max={MAX_PLEDGE / 100}
                      name="pledge"
                      value={formData.pledge / 100}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: "pledge",
                            value: Math.min(
                              MAX_PLEDGE,
                              Math.max(MIN_PLEDGE, e.target.value * 100)
                            ),
                          },
                        })
                      }
                      className="bg-card text-dark my-0 mx-0.5 inline-block align-top text-[18px] leading-[30px] py-2 px-0.5 max-w-[55px] min-w-[70px] border-[0.5px] border-gray-300 rounded-[100px] text-center bg-none shadow-none transition-all outline-none focus:border-dark ap-none"
                    />
                    <button
                      type="button"
                      className="w-[46px] h-[46px] bg-primary/30 text-primary text-[20px] flex justify-center items-center rounded-full font-semibold cursor-pointer disabled:bg-gray-200 disabled:border-gray-300 disabled:border disabled:text-gray-400"
                      onClick={() => handlePledgeChange(500)}
                      disabled={formData.pledge >= MAX_PLEDGE}
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
                      name="pledge"
                      value={formData.pledge / 100}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: "pledge",
                            value: Math.min(
                              MAX_PLEDGE,
                              Math.max(MIN_PLEDGE, e.target.value * 100)
                            ),
                          },
                        })
                      }
                      className="bg-form border font-semibold border-gray-300 font-sans text-dark text-base h-[46px] leading-6 transition-all rounded-lg outline-none focus:border-dark block w-full ps-7 py-2 px-4"
                      placeholder="5"
                    />
                  </div>
                  {formErrors.pledge && (
                    <p className="mt-2 text-sm text-red-400">
                      {formErrors.pledge}
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
                    className="bg-form border font-semibold border-gray-300 font-sans text-dark text-base h-[46px] leading-6 transition-all rounded-lg outline-none focus:border-dark block w-full py-2 px-4 placeholder:font-normal"
                    placeholder="Your name or nickname"
                  />
                </div>

                <div className="max-w-full mx-auto">
                  <label htmlFor="email" className="sr-only">
                    Your Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-form border font-semibold border-gray-300 font-sans text-dark text-base h-[46px] leading-6 transition-all rounded-lg outline-none focus:border-dark block w-full py-2 px-4 placeholder:font-normal"
                    placeholder="Your email"
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
                    className="bg-form border font-semibold border-gray-300 font-sans text-dark text-base h-auto leading-6 transition-all rounded-lg outline-none focus:border-dark block w-full py-2 px-4 placeholder:font-normal"
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
                    className="w-4 h-4 text-dark bg-form border-gray-300 rounded outline-none"
                  />
                  <label
                    htmlFor="isPrivate"
                    className="ms-2 text-base text-dark font-semibold"
                  >
                    Private message?{" "}
                    <span
                      className="text-muted"
                      title="Only you and the creator will see this message"
                    >
                      ℹ️
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="bg-primary text-white rounded-full w-full flex items-center justify-center font-semibold font-sans border-none py-2 px-4"
                >
                  Donate ${(formData.pledge / 100).toFixed(2)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Products Section */}
      {PRODUCTS.map((product) => (
        <div key={product.id} className="col-span-1">
          <div className="p-4 rounded-[18px] w-full bg-card space-y-4">
            <div
              className="w-full bg-green-200 rounded-lg aspect-video bg-cover bg-center"
              style={{ backgroundImage: `url(${product.imageUrl})` }}
            />
            <div className="mb-4 flex justify-between items-center">
              <span className="font-semibold text-xl max-w-[50%] font-sans">
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
                className="btn-primary text-dark border-gray-300 border"
                onClick={() => openProductModal(product)}
              >
                Details
              </button>
              <button
                type="button"
                className="btn-primary bg-primary border-none font-semibold text-center text-white rounded-full"
                onClick={() => handleProductPledge(product)}
              >
                {product.pledgeText}
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
  );
}
