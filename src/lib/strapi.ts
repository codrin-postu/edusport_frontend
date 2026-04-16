const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

async function strapiRequest(path: string, params?: string, revalidate: number | false = 3600) {
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
}

export async function fetchStrapi<T>(
  path: string,
  params?: string,
  revalidate: number | false = 3600,
): Promise<T> {
  const json = await strapiRequest(path, params, revalidate);
  return json.data as T;
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export async function fetchStrapiPaginated<T>(
  path: string,
  params?: string,
  revalidate: number | false = 3600,
): Promise<{ data: T; meta: { pagination: StrapiPagination } }> {
  const json = await strapiRequest(path, params, revalidate);
  return { data: json.data as T, meta: json.meta };
}
