export function publicUrl(path: string): string {
  return new URL(
    path.replace(/^\/+/, ""),
    window.location.origin + import.meta.env.BASE_URL
  ).toString();
}

export const gradients = [
  "linear-gradient(180deg, rgba(254, 159, 65, 0.20) 0%, rgba(254, 159, 65, 0.10) 100%), #FFF",
  "linear-gradient(180deg, rgba(70, 209, 0, 0.20) 0%, rgba(70, 209, 0, 0.06) 100%), #FFF",
  "linear-gradient(180deg, rgba(0, 122, 255, 0.20) 0%, rgba(0, 122, 255, 0.05) 100%), #FFF",
  "linear-gradient(180deg, rgba(255, 71, 71, 0.20) 0%, rgba(255, 71, 71, 0.05) 100%), #FFF",
];
