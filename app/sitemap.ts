import { MetadataRoute } from "next";

const base_url = "https://melofi.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${base_url}/home`,
    },
    {
      url: `${base_url}`,
    },
    {
      url: `${base_url}/home#about`,
    },
    {
      url: `${base_url}/home#contact`,
    },
    {
      url: `${base_url}/home#features`,
    },
    {
      url: `${base_url}/home#pricing`,
    },
    {
      url: `${base_url}/portal`,
    },
    {
      url: `${base_url}/legal/terms-and-conditions`,
    },
    {
      url: `${base_url}/legal/privacy-policy`,
    },
  ];
}
