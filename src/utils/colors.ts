export function blendColors(background: string, overlay: string): string {
  const bg = parseColor(background);

  const [ol, alpha] = parseColorWithAlpha(overlay);

  const r = Math.round(bg.r * (1 - alpha) + ol.r * alpha);
  const g = Math.round(bg.g * (1 - alpha) + ol.g * alpha);
  const b = Math.round(bg.b * (1 - alpha) + ol.b * alpha);

  return rgbToHex(r, g, b);
}

function parseColor(color: string) {
  color = color.replace(/\s/g, "").replace("#", "");

  if (color.match(/^[0-9A-Fa-f]{6}$/)) {
    return {
      r: parseInt(color.slice(0, 2), 16),
      g: parseInt(color.slice(2, 4), 16),
      b: parseInt(color.slice(4, 6), 16),
    };
  }

  if (color === "white") return { r: 255, g: 255, b: 255 };
  if (color === "black") return { r: 0, g: 0, b: 0 };

  return { r: 0, g: 0, b: 0 };
}

function parseColorWithAlpha(
  color: string
): [{ r: number; g: number; b: number }, number] {
  const parts = color.split("/");
  const baseColor = parseColor(parts[0]);
  const alpha = parts.length > 1 ? parseInt(parts[1]) / 100 : 1;
  return [baseColor, alpha];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, "0"))
      .join("")
  );
}
