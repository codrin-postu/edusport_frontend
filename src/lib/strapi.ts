import { cache } from "react";

import { STRAPI_BASE } from "./strapi-base";

const STRAPI_URL = STRAPI_BASE;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

const strapiRequest = cache(async(path: string, params?: string, revalidate: number | false = 1800, tags?: string[]) => {
  const url = `${STRAPI_URL}/api/${path}${params ? `?${params}` : ""}`;
  const res = await fetch(url, {
    headers: STRAPI_TOKEN
      ? { Authorization: `Bearer ${STRAPI_TOKEN}` }
      : {},
    // `tags` is optional and additive: callers that pass one can be purged on
    // demand through /api/revalidate?tag=..., the rest keep expiring on time.
    next:
      revalidate === false
        ? { revalidate: 0, tags }
        : { revalidate, tags },
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
  tags?: string[],
): Promise<T> => {
  const json = await strapiRequest(path, params, revalidate, tags);
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
