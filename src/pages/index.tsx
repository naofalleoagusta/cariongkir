import ShippingCost from "@/components/ShippingCost";
import { courierNames } from "@/constants";
import { type NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <section className="h-[300px]">
        <div className="flex h-full w-full items-end">
          <h1 className="inline-block max-h-full w-full overflow-hidden text-5xl font-bold tracking-tighter md:text-6xl">
            Cek Ongkos / Tarif
            <span className="flex-start mt-1 flex flex-wrap">
              <span className="mr-3 h-full">Pengiriman</span>
              <span className="mt-1 max-h-[60px] overflow-hidden sm:mt-0 md:max-h-[70px]">
                <span className="-mt-2 flex h-full animate-shuffleMobile flex-col md:animate-shuffle">
                  {courierNames.map((courierName, idx) => (
                    <span
                      key={`${courierName}-${idx}`}
                      className="bg-gradient-to-r from-pink-500 via-blue-500 to-purple-600 bg-clip-text py-2 text-transparent"
                    >
                      {courierName}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </h1>
        </div>
      </section>
      <section className="pt-12 md:pt-16">
        <ShippingCost />
      </section>
    </>
  );
};

export default Home;
