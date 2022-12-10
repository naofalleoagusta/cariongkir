import fetch from "node-fetch";

import { env } from "../src/env/server.mjs";
import { prisma } from "../src/server/db/client";

export type QueryResType = Record<string, string>;

export type StatusResType = {
  code: number;
  description: string;
};

export type CitiesResType = {
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

export type SubdistrictsResType = {
  rajaongkir: {
    query: QueryResType | QueryResType[];
    status: StatusResType;
    results: Array<{
      subdistrict_id: string;
      subdistrict_name: string;
      city_id: string;
      province_id: string;
      province: string;
      type: string;
      city: string;
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
  const citiesRes = await fetchRajaOngkir("city");
  const cities = (await citiesRes.json()) as CitiesResType;
  for (const city of cities.rajaongkir.results) {
    const subdistrictsRes = await fetchRajaOngkir(
      `subdistrict?city=${city.city_id}`
    );
    const subdistricts = (await subdistrictsRes.json()) as SubdistrictsResType;
    for (const subdistrict of subdistricts.rajaongkir.results) {
      await prisma.subdistricts.create({
        data: {
          name: subdistrict.subdistrict_name,
          cityId: parseInt(subdistrict.city_id),
          cityName: subdistrict.city,
          provinceName: subdistrict.province,
          provinceId: parseInt(subdistrict.province_id),
          type: subdistrict.type,
          id: parseInt(subdistrict.subdistrict_id),
        },
      });
    }
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
