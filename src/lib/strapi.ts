import { cache } from "react";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

const strapiRequest = cache(async(path: string, params?: string, revalidate: number | false = 1800) => {
  const url = `${STRAPI_URL}/api/${path}${params ? `?${params}` : ""}`;
  const res = await fetch(url, {
    headers: STRAPI_TOKEN
      ? { Authorization: `Bearer ${STRAPI_TOKEN}` }
      : {},
    next: revalidate === false ? { revalidate: 0 } : { revalidate },
  });

  if (!res.ok) {
    throw new Error(`Strapi fetch failed: ${res.status} ${url}`);
  }

  return res.json();
});

export const fetchStrapi = cache(async <T>(
  path: string,
  params?: string,
  revalidate: number | false = 1800,
): Promise<T> => {
  const json = await strapiRequest(path, params, revalidate);
  return json.data as T;
});

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export const fetchStrapiPaginated = cache(async <T>(
  path: string,
  params?: string,
  revalidate: number | false = 1800,
): Promise<{ data: T; meta: { pagination: StrapiPagination } }> => {
  const json = await strapiRequest(path, params, revalidate);
  return { data: json.data as T, meta: json.meta };
});
