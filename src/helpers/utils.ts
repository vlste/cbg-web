import { BASE_URL } from "@/api/api";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateWithTime(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function oneLetterAvatar(firstName: string, size: number = 16) {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" rx="8" fill="#8E8E93"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="${Math.floor(
      size / 2
    )}" font-family="system-ui" font-weight="bold">${
      firstName?.[0] || "?"
    }</text></svg>`
  )}`;
}

export function avatarUrl(telegramId: string) {
  return `${BASE_URL}/tg/user/${telegramId}/photo`;
}
