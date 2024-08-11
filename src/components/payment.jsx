import Image from "next/image";

export default function Payment() {
    return (
        <div className="md:contents lg:max-w-[400px] lg:w-screen space-y-4 max-w-[400px] w-[400px] min-w-[285px] md:max-w-[550px] md:min-w-[285px]">
                  {/* Tiers Section */}
                  <div className="col-span-1 before:table">
                    <div className="h-auto max-w-screen w-full min-w-[285px] p-4 m-auto bg-card rounded-2xl shadow-none">
                      <div className="flex flex-col w-full">
                        <div className="mb-4 flex items-start justify-between">
                          <span className="font-bold text-base text-limit-one-line">
                            Make a pledge without a reward
                          </span>
                        </div>

                        <form className="w-full">
                          <div className="flex justify-start flex-row items-center my-2">
                            <div className="w-full flex justify-between items-center">
                              <div className="w-auto justify-start mb-4 flex flex-row items-center">
                                <Image
                                  src="/images/cup-border.webp"
                                  alt="alter"
                                  className="mr-2 object-cover bg-[50%_50%] align-middle"
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
                                  className="w-[46px] h-[46px] bg-primary/30 text-primary text-[20px] flex justify-center items-center rounded-full font-semibold cursor-pointer disabled:bg-disabled disabled:border-border disabled:border disabled:text-dark"
                                  disabled
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  maxlength="5"
                                  min="1"
                                  max="99999"
                                  id="qty"
                                  inputmode="numeric"
                                  name="qty"
                                  step="1"
                                  className="bg-card text-dark my-0 mx-0.5 inline-block align-top text-[18px] leading-[30px] py-2 px-0.5 max-w-[55px] min-w-[70px] border-[0.5px] border-border rounded-[100px] text-center bg-none shadow-none transition-all outline-none focus:border-dark ap-none"
                                ></input>
                                <button className="w-[46px] h-[46px] bg-primary/30 text-primary text-[20px] flex justify-center items-center rounded-full font-semibold cursor-pointer disabled:bg-disabled disabled:border-border disabled:border disabled:text-dark">
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
                                  className="bg-form border font-semibold border-border font-sans text-dark text-base h-[46px] leading-6 transition-all rounded-lg outline-none focus:border-dark block w-full ps-7 py-2 px-4"
                                  defaultValue={5}
                                  placeholder="5"
                                />
                              </div>
                              <p className="mt-2 hidden text-sm text-red-400">
                                Please enter at least $5
                              </p>
                            </div>

                            <div className="max-w-full mx-auto">
                              <label htmlFor="name" className="sr-only">
                                Your Name
                              </label>
                              <input
                                type="text"
                                id="name"
                                className="bg-form border font-semibold border-border font-sans text-dark text-base h-[46px] leading-6 transition-all rounded-lg outline-none focus:border-dark block w-full py-2 px-4 placeholder:font-normal"
                                placeholder="Your name or nickname"
                              />
                            </div>

                            <div className="max-w-full mx-auto">
                              <label htmlFor="message" className="sr-only">
                                Message
                              </label>
                              <textarea
                                id="message"
                                className="bg-form border font-semibold border-border font-sans text-dark text-base h-auto leading-6 transition-all rounded-lg outline-none focus:border-dark block w-full py-2 px-4 placeholder:font-normal"
                                rows={2}
                                placeholder="Your message"
                                maxLength={280}
                              ></textarea>
                            </div>

                            <div className="flex items-center">
                              <input
                                id="link-checkbox"
                                type="checkbox"
                                value=""
                                className="w-4 h-4 text-dark bg-form border-border rounded outline-none"
                              />
                              <label
                                for="link-checkbox"
                                className="ms-2 text-base text-dark font-semibold"
                              >
                                Private message?{" "}
                                <i className="fa-solid fa-circle-info text-muted"></i>
                              </label>
                            </div>

                            <button className="btn-primary bg-primary text-white rounded-full w-full flex items-center justify-center font-semibold font-sans border-none">
                              Donate $5
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="p-4 rounded-[18px] w-full bg-card space-y-4">
                      <div
                        className="w-full bg-green-200 rounded-lg aspect-video bg-cover bg-[50%_50%]"
                        style={{ backgroundImage: "url(/images/vinyl.webp)" }}
                      />
                      <div className="mb-4 flex justify-between items-center">
                        <span className="font-semibold text-xl max-w-[50%] font-sans">
                          Double Gatefold, White Vinyl Pack
                        </span>
                        <span className="font-semibold text-2xl font-sans">
                          $34.99
                        </span>
                      </div>

                      <div className="w-full max-w-[600px] min-w-[240px] mb-2">
                        <p className="w-full overflow-hidden para-control !line-clamp-3">
                          Limited edition Double Gatefold, White Vinyl Pack of
                          Obsession - including the Original single by
                          Ultra-sonic and the remixes by Mark Sherry, Bryan
                          Kearney, James Allan, GBX & Paul Keenan, Steven Brown,
                          Chris Connolly....Vocals by Heather Finnie
                        </p>
                      </div>

                      <div className="flex w-full justify-between items-center">
                        <button
                          type="button"
                          className="btn-primary text-dark border-border border"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          className="btn-primary bg-primary border-none font-semibold text-center text-white rounded-full"
                        >
                          Pledge $34.99
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="p-4 rounded-[18px] w-full bg-card space-y-4">
                      <div
                        className="w-full bg-green-200 rounded-lg aspect-video bg-cover bg-[50%_50%]"
                        style={{ backgroundImage: "url(/images/disk.webp)" }}
                      />
                      <div className="mb-4 flex justify-between items-center">
                        <span className="font-semibold text-xl max-w-[50%] font-sans">
                          Chillhop Essentials - Winter 2019 CD - Limited Edition
                        </span>
                        <span className="font-semibold text-2xl font-sans">
                          $16.75
                        </span>
                      </div>

                      <div className="w-full max-w-[600px] min-w-[240px] mb-2">
                        <p className="w-full overflow-hidden para-control !line-clamp-3">
                          Limited edition Double Gatefold, White Vinyl Pack of
                          Obsession - including the Original single by
                          Ultra-sonic and the remixes by Mark Sherry, Bryan
                          Kearney, James Allan, GBX & Paul Keenan, Steven Brown,
                          Chris Connolly....Vocals by Heather Finnie
                        </p>
                      </div>

                      <div className="flex w-full justify-between items-center">
                        <button
                          type="button"
                          className="btn-primary text-dark border-border border"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          className="btn-primary bg-primary border-none font-semibold text-center text-white rounded-full"
                        >
                          Pledge $16.75
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="p-4 rounded-[18px] w-full bg-card space-y-4">
                      <div
                        className="w-full bg-green-200 rounded-lg aspect-video bg-cover bg-[50%_50%]"
                        style={{ backgroundImage: "url(/images/tape.webp)" }}
                      />
                      <div className="mb-4 flex justify-between items-center">
                        <span className="font-semibold text-xl max-w-[50%] font-sans">
                          Chillhop Essentials - Summer 2023 Cassette Tape -
                          Limited Edition
                        </span>
                        <span className="font-semibold text-2xl font-sans">
                          $18.24
                        </span>
                      </div>

                      <div className="w-full max-w-[600px] min-w-[240px] mb-2">
                        <p className="w-full overflow-hidden para-control !line-clamp-3">
                          Limited edition Double Gatefold, White Vinyl Pack of
                          Obsession - including the Original single by
                          Ultra-sonic and the remixes by Mark Sherry, Bryan
                          Kearney, James Allan, GBX & Paul Keenan, Steven Brown,
                          Chris Connolly....Vocals by Heather Finnie
                        </p>
                      </div>

                      <div className="flex w-full justify-between items-center">
                        <button
                          type="button"
                          className="btn-primary text-dark border-border border"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          className="btn-primary bg-primary border-none font-semibold text-center text-white rounded-full"
                        >
                          Pledge $18.24
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
    )
}