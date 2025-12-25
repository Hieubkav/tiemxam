"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect } from "react";

export default function DynamicMetadata() {
  const settings = useQuery(api.settings.get);
  const faviconUrl = useQuery(
    api.files.getUrl,
    settings?.faviconStorageId
      ? { storageId: settings.faviconStorageId as Id<"_storage"> }
      : "skip"
  );

  useEffect(() => {
    if (settings?.seoTitle) {
      document.title = settings.seoTitle;
    }
  }, [settings?.seoTitle]);

  useEffect(() => {
    if (faviconUrl) {
      let link: HTMLLinkElement | null =
        document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [faviconUrl]);

  return null;
}
