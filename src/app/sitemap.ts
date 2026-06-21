import type { MetadataRoute } from "next";
import { learnPosts } from "@/content/learn/posts";
import { siteConfig } from "@/lib/config";
export default function sitemap(): MetadataRoute.Sitemap { const paths = ["", "/investors", "/overlap", "/stocks", "/learn", "/about", "/contact", "/privacy", "/disclaimer"]; return [...paths.map((path) => ({ url: `${siteConfig.url}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : .7 })), ...learnPosts.map((post) => ({ url: `${siteConfig.url}/learn/${post.slug}`, changeFrequency: "monthly" as const, priority: .6 }))]; }
