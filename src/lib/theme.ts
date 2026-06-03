/** Converts a hex color string to "H S% L%" (the format Tailwind CSS vars expect). */
function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r: h = (((g - b) / d) % 6 + 6) % 6; break;
      case g: h = (b - r) / d + 2;              break;
      case b: h = (r - g) / d + 4;              break;
    }
  }

  return `${Math.round(h * 60)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/** Returns the WCAG relative luminance of a hex color. */
function luminance(hex: string): number {
  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return (
    0.2126 * toLinear(parseInt(hex.slice(1, 3), 16) / 255) +
    0.7152 * toLinear(parseInt(hex.slice(3, 5), 16) / 255) +
    0.0722 * toLinear(parseInt(hex.slice(5, 7), 16) / 255)
  );
}

/** Picks white or near-black foreground based on background luminance. */
function autoForeground(bgHex: string): string {
  return luminance(bgHex) > 0.25 ? "0 0% 9%" : "0 0% 100%";
}

// ─────────────────────────────────────────────────────────────────────────────

export interface ThemeColors {
  primary: string;
  background: string;
  foreground: string;
  card: string;
  muted: string;
  mutedForeground: string;
  border: string;
  sidebarBackground: string;
}

export interface Theme {
  light: ThemeColors;
  dark: ThemeColors;
  radius: string;
}

function buildVars(colors: ThemeColors, radius?: string): Record<string, string> {
  const primaryHsl    = hexToHsl(colors.primary);
  const primaryFg     = autoForeground(colors.primary);
  const fgHsl         = hexToHsl(colors.foreground);
  const bgHsl         = hexToHsl(colors.background);
  const cardHsl       = hexToHsl(colors.card);
  const mutedHsl      = hexToHsl(colors.muted);
  const mutedFgHsl    = hexToHsl(colors.mutedForeground);
  const borderHsl     = hexToHsl(colors.border);
  const sidebarBgHsl  = hexToHsl(colors.sidebarBackground);

  const vars: Record<string, string> = {
    "--brand":                        primaryHsl,
    "--primary":                      primaryHsl,
    "--primary-foreground":           primaryFg,
    "--background":                   bgHsl,
    "--foreground":                   fgHsl,
    "--card":                         cardHsl,
    "--card-foreground":              fgHsl,
    "--popover":                      cardHsl,
    "--popover-foreground":           fgHsl,
    "--secondary":                    mutedHsl,
    "--secondary-foreground":         fgHsl,
    "--muted":                        mutedHsl,
    "--muted-foreground":             mutedFgHsl,
    "--accent":                       primaryHsl,
    "--accent-foreground":            primaryFg,
    "--border":                       borderHsl,
    "--input":                        borderHsl,
    "--ring":                         primaryHsl,
    "--sidebar-background":           sidebarBgHsl,
    "--sidebar-foreground":           fgHsl,
    "--sidebar-primary":              primaryHsl,
    "--sidebar-primary-foreground":   primaryFg,
    "--sidebar-accent":               mutedHsl,
    "--sidebar-accent-foreground":    fgHsl,
    "--sidebar-border":               borderHsl,
    "--sidebar-ring":                 primaryHsl,
    "--nav-link-color":               mutedFgHsl,
  };

  if (radius) vars["--radius"] = radius;
  return vars;
}

function varsToDeclarations(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
}

/**
 * Generates a complete CSS string with :root and .dark blocks derived from the theme JSON.
 * Inject this into a <style> tag in the root layout for server-side, FOUC-free theming.
 */
export function generateThemeCss(theme: Theme): string {
  const lightVars = buildVars(theme.light, theme.radius);
  const darkVars  = buildVars(theme.dark);

  return [
    `:root {\n${varsToDeclarations(lightVars)}\n}`,
    `.dark {\n${varsToDeclarations(darkVars)}\n}`,
  ].join("\n\n");
}
