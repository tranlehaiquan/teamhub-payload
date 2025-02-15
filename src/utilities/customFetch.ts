/**
 * This function is used to make a fetch request with the cookies attached to the headers.
 * Can use both in the client and server side.
 * @param url
 * @param options
 * @returns
 */
export const customFetch = async (
  url: string | URL | globalThis.Request,
  options?: RequestInit,
) => {
  let headers = {};

  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();

    headers = {
      Cookie: cookieStore.toString(),
    };
  }

  return await fetch(url, {
    headers,
    credentials: 'include',
    ...options,
  });
};
