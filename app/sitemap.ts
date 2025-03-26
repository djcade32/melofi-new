import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/home`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/home#about`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/home#contact`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/home#features`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/home#pricing`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portal`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/legal/terms-and-conditions`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/legal/privacy-policy`,
    },
  ];
}
