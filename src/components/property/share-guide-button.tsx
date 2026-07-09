"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Share2 } from "lucide-react";

export function ShareGuideButton({
  propertyCode,
  propertyName,
}: {
  propertyCode: string;
  propertyName: string;
}) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleShare() {
    const url = new URL(`/${propertyCode}`, window.location.origin).toString();
    const shareData = {
      title: `${propertyName} guest guide`,
      text: `Open the guest guide for ${propertyName}.`,
      url,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex w-fit items-center gap-2 rounded-field border border-white/25 bg-white/12 px-4 py-2.5 text-sm font-semibold text-white shadow-card backdrop-blur transition hover:border-white/50 hover:bg-white/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/70"
      aria-label={copied ? "Guide link copied" : "Share guide link"}
    >
      {copied ? (
        <Check className="h-4 w-4" aria-hidden />
      ) : (
        <Share2 className="h-4 w-4" aria-hidden />
      )}
      {copied ? "Link copied" : "Share guide"}
    </button>
  );
}
