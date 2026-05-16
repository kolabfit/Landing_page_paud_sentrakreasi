type CmsResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export type CmsSettings = {
  site_name?: string;
  site_tagline?: string;
  site_logo?: string;
};

export type CmsPost = {
  id: number;
  title: string;
  slug: string;
  category?: string;
  excerpt?: string;
  featured_image?: string;
  created_at?: string;
  content?: Array<{
    featured_image?: string;
  }>;
};

export type CmsPostDetail = CmsPost & {
  content?: Array<{
    id?: string;
    type?: string;
    data?: Record<string, unknown>;
  }>;
};

export type CmsPage = {
  id: number;
  title: string;
  slug: string;
  status?: string;
};

export type CmsPageDetail = CmsPage & {
  content?: Array<{
    id?: string;
    type?: string;
    data?: Record<string, unknown>;
  }>;
};

const CMS_BASE_URL =
  import.meta.env.VITE_CMS_BASE_URL ||
  "https://uni-verse-headless-cms.onrender.com";
const CMS_API_KEY = import.meta.env.VITE_CMS_API_KEY || "";

async function fetchCms<T>(path: string): Promise<T> {
  if (!CMS_API_KEY) {
    throw new Error("CMS API key is missing. Check VITE_CMS_API_KEY in .env.");
  }

  const response = await fetch(`${CMS_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "x-api-key": CMS_API_KEY,
    },
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `CMS request failed: ${response.status} ${response.statusText} ${details}`.trim(),
    );
  }

  const payload = (await response.json()) as CmsResponse<T> | T;
  if (typeof payload === "object" && payload !== null && "success" in payload) {
    const wrapped = payload as CmsResponse<T>;
    if (!wrapped.success || wrapped.data === undefined) {
      throw new Error(wrapped.message || "CMS response invalid");
    }
    return wrapped.data;
  }

  return payload as T;
}

export function getSettings() {
  return fetchCms<CmsSettings>("/api/v1/public/settings");
}

export function getPosts() {
  return fetchCms<CmsPost[]>("/api/v1/public/posts");
}

export function getPostBySlug(slug: string) {
  return fetchCms<CmsPostDetail>(`/api/v1/public/posts/${slug}`);
}

export function getPages() {
  return fetchCms<CmsPage[]>("/api/v1/public/pages");
}

export function getPageBySlug(slug: string) {
  return fetchCms<CmsPageDetail>(`/api/v1/public/pages/${slug}`);
}

export async function sendInquiry(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!CMS_API_KEY) {
    throw new Error("CMS API key is missing.");
  }

  const response = await fetch(`${CMS_BASE_URL}/api/v1/inquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CMS_API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Gagal mengirim pesan: ${response.statusText}`);
  }

  return response.json();
}

