import AudioPlayer from "@/components/audioPlayer";
import Payment from "@/components/payment";
import Footer from "@/components/footer";
import Goal from "@/components/goal";
import Info from "@/components/info";

export default function Home() {
  return (
    <main>
      <div className="max-w-[1500px] min-h-[80vh] w-full md:m-0 md:p-0 m-auto px-0">
        <div>
          {/* Cover Page */}
          <div className="md:py-0 md:px-2.5">
            <section
              className="profile-header"
              style={{ backgroundImage: "url('/images/cover_image.png')" }}
            />
          </div>

          <section className="w-full flex justify-center items-center">
            <div className="w-screen max-w-none my-0 mx-auto pt-4 pb-10 min-h-screen">
              <div className="md:flex md:flex-col md:justify-center md:items-center md:w-full md:m-auto md:max-w-[518px] md:gap-0 gap-4 flex flex-row justify-center items-start mx-auto px-0 large:max-w-[990px] large:w-full">
                <div className="block sticky top-8 will-change-[height] md:py-0 md:px-4 md:h-auto md:w-screen md:max-w-[550px] md:min-w-[285px] md:contents w-screen max-w-[550px] min-w-[285px]">
                  <Goal />
                  <Info />
                  <AudioPlayer />
                </div>
                <Payment />
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </div>
    </main>
  );
}
