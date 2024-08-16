"use client";

import { useState, Fragment, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Info, X } from "lucide-react";
import { toast } from "sonner";
import PaymentMethod from "./paymentMethod";

const PRODUCTS = [
  {
    id: 1,
    title: "Double Gatefold, White Vinyl Pack",
    price: 3699,
    description:
      "Limited edition Double Gatefold, White Vinyl Pack of Obsession...",
    imageUrl: "/images/vinyl.webp",
  },
  {
    id: 2,
    title: "Chillhop Essentials - Winter 2019 CD - Limited Edition",
    price: 1875,
    description:
      "Limited edition Double Gatefold, White Vinyl Pack of Obsession...",
    imageUrl: "/images/disk.webp",
  },
  {
    id: 3,
    title: "Chillhop Essentials - Summer 2023 Cassette Tape - Limited Edition",
    price: 2224,
    description:
      "Limited edition Double Gatefold, White Vinyl Pack of Obsession...",
    imageUrl: "/images/tape.webp",
  },
];

const MIN_CHAI = 1;
const MAX_CHAI = 3333;
const CHAI_PRICE = 5;

export default function Payment() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    chaiCount: MIN_CHAI,
    amount: MIN_CHAI * CHAI_PRICE,
    name: "",
    message: "",
    isPrivate: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (shouldScrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setShouldScrollToTop(false);
    }
  }, [shouldScrollToTop]);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  const handleChaiChange = (amount) => {
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
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "amount") {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const chaiCount = Math.floor(numValue / CHAI_PRICE);
        setFormData((prev) => ({
          ...prev,
          chaiCount: Math.max(MIN_CHAI, Math.min(MAX_CHAI, chaiCount)),
          amount: numValue,
        }));

        // Validate and set error
        const error = validateAmount(numValue);
        setFormErrors((prev) => ({ ...prev, amount: error }));
      } else {
        setFormData((prev) => ({ ...prev, amount: value }));
        setFormErrors((prev) => ({
          ...prev,
          amount: "Please enter a valid number",
        }));
      }
    } else if (name === "chaiCount") {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        const newChaiCount = Math.max(MIN_CHAI, Math.min(MAX_CHAI, numValue));
        const newAmount = newChaiCount * CHAI_PRICE;
        setFormData((prev) => ({
          ...prev,
          chaiCount: newChaiCount,
          amount: newAmount,
        }));

        // Validate and set error
        const error = validateAmount(newAmount);
        setFormErrors((prev) => ({ ...prev, amount: error }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleProductPledge = (product) => {
    const chaiCount = Math.floor(product.price / (CHAI_PRICE * 100));
    setFormData((prev) => ({
      ...prev,
      chaiCount: chaiCount,
        amount: chaiCount * CHAI_PRICE,
    }));

    setShouldScrollToTop(true);

    toast.success(
      `Pledge amount updated to ${chaiCount} chai ($${(
        chaiCount * CHAI_PRICE
      ).toFixed(2)})`
    );
  };

  const validateForm = () => {
    const errors = {};
    // Add any other form validations here
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAmount = (amount) => {
    if (amount < CHAI_PRICE) {
      return `Please enter an amount of at least $${CHAI_PRICE}`;
    } else if (amount > MAX_CHAI * CHAI_PRICE) {
      return `The maximum amount is $${MAX_CHAI * CHAI_PRICE}`;
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {

      setIsPaymentModalOpen(true);
    }
  };

  const config = {
    reference: new Date().getTime().toString(),
    amount: formData.chaiCount * CHAI_PRICE,
    currency: "USD",
  };

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
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-card p-6 text-left align-middle shadow-xl transition-all relative">
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
    <>
      <div className="md:contents lg:max-w-[400px] lg:w-screen space-y-4 max-w-[400px] w-[400px] min-w-[285px] md:max-w-[550px] md:min-w-[285px]">
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
                        src="/images/cup-border.webp"
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
                        min={CHAI_PRICE}
                        max={MAX_CHAI * CHAI_PRICE}
                        step="0.01"
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
      <PaymentMethod
        isPaymentModalOpen={isPaymentModalOpen}
        setIsPaymentModalOpen={setIsPaymentModalOpen}
        config={config}
      />
    </>
  );
}
