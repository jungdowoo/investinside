"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function CookieConsent() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("investinfo-cookie-consent") !== "true";
  });

  if (!show) return null;

  const handleAccept = () => {
    localStorage.setItem("investinfo-cookie-consent", "true");
    setShow(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/95 p-5 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/95 sm:flex-row sm:p-6">
        <div className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          <strong>쿠키 및 개인정보 수집 안내:</strong> 본 사이트는 서비스 제공, 트래픽 분석 및 맞춤형 광고(Google AdSense) 제공을 위해 쿠키(Doubleclick DART 쿠키 포함)를 사용합니다. 서비스를 계속 이용하시면 쿠키 사용에 동의한 것으로 간주됩니다. 자세한 내용은 <a href="/privacy" className="font-semibold text-zinc-900 underline dark:text-zinc-100">개인정보처리방침</a>을 확인해주세요.
        </div>
        <div className="flex w-full shrink-0 items-center justify-end gap-3 sm:w-auto">
          <button onClick={() => setShow(false)} className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300" aria-label="닫기">
            <X className="size-5" />
          </button>
          <button onClick={handleAccept} className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
            동의 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
