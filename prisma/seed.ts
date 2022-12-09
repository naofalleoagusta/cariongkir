import fetch from "node-fetch";

import { env } from "../src/env/server.mjs";
import { prisma } from "../src/server/db/client";

type QueryResType = Record<string, string>;
type StatusResType = {
  code: number;
  description: string;
};

type ProvincesResType = {
  rajaongkir: {
    query: QueryResType | QueryResType[];
    status: StatusResType;
    results: Array<{ province_id: string; province: string }>;
  };
};

type CitiesResType = {
  rajaongkir: {
    query: QueryResType | QueryResType[];
    status: StatusResType;
    results: Array<{
      city_id: string;
      province_id: string;
      province: string;
      type: string;
      city_name: string;
    }>;
  };
};

type SubdistrictsResType = {
  rajaongkir: {
    query: QueryResType | QueryResType[];
    status: StatusResType;
    results: Array<{
      subdistrict_id: string;
      subdistrict_name: string;
      city_id: string;
    }>;
  };
};

const fetchRajaOngkir = async (param: string) => {
  return await fetch(`${env.RAJAONGKIR_API_URL}${param}`, {
    headers: {
      key: env.RAJAONGKIR_API_KEY,
    },
  });
};

async function main() {
  // const provincesRes = await fetchRajaOngkir("province");
  // const provinces = (await provincesRes.json()) as ProvincesResType;
  // for (const province of provinces.rajaongkir.results) {
  //   await prisma.provinces.create({
  //     data: {
  //       id: parseInt(province.province_id),
  //       name: province.province,
  //     },
  //   });
  // }

  const citiesRes = await fetchRajaOngkir("city");
  const cities = (await citiesRes.json()) as CitiesResType;
  for (const city of cities.rajaongkir.results) {
    await prisma.cities
      .create({
        data: {
          id: parseInt(city.city_id),
          name: city.city_name,
          provinceId: parseInt(city.province_id),
          type: city.type,
        },
      })
      .then(async () => {
        const subdistrictsRes = await fetchRajaOngkir(
          `subdistrict?city=${city.city_id}`
        );
        const subdistricts =
          (await subdistrictsRes.json()) as SubdistrictsResType;
        for (const subdistrict of subdistricts.rajaongkir.results) {
          await prisma.subdistricts.create({
            data: {
              name: subdistrict.subdistrict_name,
              cityId: parseInt(subdistrict.city_id),
              id: parseInt(subdistrict.subdistrict_id),
            },
          });
        }
      });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
