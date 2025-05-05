export const fetchWithBase = (url: string, options?: RequestInit) => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    return fetch(`${base}${url}`, options);
};
  