/**
 * Converts a hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  hex = hex.replace('#', '');

  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Converts RGB color name to RGB values
 */
function colorNameToRgb(colorName: string): { r: number; g: number; b: number } | null {
  const colorMap: Record<string, { r: number; g: number; b: number }> = {
    red: { r: 255, g: 0, b: 0 },
    green: { r: 0, g: 128, b: 0 },
    blue: { r: 0, g: 0, b: 255 },
    yellow: { r: 255, g: 255, b: 0 },
    orange: { r: 255, g: 165, b: 0 },
    purple: { r: 128, g: 0, b: 128 },
    pink: { r: 255, g: 192, b: 203 },
    cyan: { r: 0, g: 255, b: 255 },
    magenta: { r: 255, g: 0, b: 255 },
    lime: { r: 0, g: 255, b: 0 },
    black: { r: 0, g: 0, b: 0 },
    white: { r: 255, g: 255, b: 255 },
    gray: { r: 128, g: 128, b: 128 },
    grey: { r: 128, g: 128, b: 128 },
  };

  return colorMap[colorName.toLowerCase()] || null;
}

/**
 * Parses RGB/RGBA color string
 */
function parseRgbColor(rgbString: string): { r: number; g: number; b: number } | null {
  const match = rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return match
    ? {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
      }
    : null;
}

/**
 * Calculates the relative luminance of a color
 * Based on WCAG 2.1 guidelines
 */
function getLuminance(r: number, g: number, b: number): number {
  // Convert to sRGB
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  // Calculate relative luminance
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Determines the appropriate text color (black or white) based on background color
 * @param backgroundColor - The background color in hex, rgb, rgba, or color name format
 * @returns 'white' or 'black' for optimal contrast
 */
export function getContrastColor(backgroundColor: string): 'white' | 'black' {
  if (!backgroundColor) return 'black';

  let rgb: { r: number; g: number; b: number } | null = null;

  // Try different color formats
  if (backgroundColor.startsWith('#')) {
    rgb = hexToRgb(backgroundColor);
  } else if (backgroundColor.startsWith('rgb')) {
    rgb = parseRgbColor(backgroundColor);
  } else {
    rgb = colorNameToRgb(backgroundColor);
  }

  // Fallback to black if color parsing fails
  if (!rgb) return 'black';

  // Calculate luminance
  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);

  // WCAG recommendation: use white text on dark backgrounds (luminance < 0.5)
  // and black text on light backgrounds (luminance >= 0.5)
  return luminance < 0.5 ? 'white' : 'black';
}
