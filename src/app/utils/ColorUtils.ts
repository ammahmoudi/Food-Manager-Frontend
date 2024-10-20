// utils/ColorUtils.ts

export const getThemeColorFromImage = (imageUrl: string): string => {
    // A function that generates a color based on the image URL (simplified logic)
    const hash = imageUrl.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
  
    const color = `#${(hash & 0x00ffffff).toString(16).padStart(6, "0")}`;
    return color;
  };
  
  export const getLighterColorBasedOnRating = (color: string, ratio: number): string => {
    const amt = Math.round(2.55 * (100 - ratio * 100));
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);
  
    R = (R + amt > 255) ? 255 : (R + amt < 0 ? 0 : R + amt);
    G = (G + amt > 255) ? 255 : (G + amt < 0 ? 0 : G + amt);
    B = (B + amt > 255) ? 255 : (B + amt < 0 ? 0 : B + amt);
  
    return `rgb(${R},${G},${B})`;
  };
  
  /**
 * Determines whether the background color is light or dark
 * and returns an appropriate text color (either white or black).
 * @param backgroundColor - The background color in hex format
 * @returns - A readable text color based on the background color
 */
// utils/ColorUtils.ts
export const getReadableTextColor = (backgroundColor: string): string => {
	// Check if the color is in rgb format
	let r, g, b;

	if (backgroundColor.startsWith("rgb")) {
		// Extract the RGB values from the rgb() string
		[r, g, b] = backgroundColor
			.match(/\d+/g)
			?.map(Number) || [0, 0, 0]; // Default to black if parsing fails
	} else {
		// Handle hex format (assuming a hex input like "#3498db")
		r = parseInt(backgroundColor.substring(1, 3), 16);
		g = parseInt(backgroundColor.substring(3, 5), 16);
		b = parseInt(backgroundColor.substring(5, 7), 16);
	}

	// Calculate luminance to decide if the text should be light or dark
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

	// If luminance is high, return dark text, otherwise return white
	return luminance > 0.5 ? "#000" : "#FFF";
};
