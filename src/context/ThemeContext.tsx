// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Theme {
	colors: {
		background: string;
		primary: string;
		secondary: string;
	};
}

interface ThemeContextType {
	currentTheme: Theme;
	switchTheme: (themeKey: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const themes: Record<string, Theme> = {
		ai: {
			colors: {
				background: "#F0F8FF",
				primary: "#FF6347",
				secondary: "#4B0082",
			},
		},
		berchi: {
			colors: {
				background: "#F5FFFA",
				primary: "#4682B4",
				secondary: "#FFD700",
			},
		},
	};

	const [currentTheme, setCurrentTheme] = useState<Theme>(themes.ai); // Default to AI theme

	const switchTheme = (themeKey: string) => {
		const selectedTheme = themes[themeKey] || themes.ai; // Fallback to AI theme
		setCurrentTheme(selectedTheme);
		document.documentElement.style.setProperty('--tw-bg-opacity', selectedTheme.colors.background);
		document.documentElement.style.setProperty('--tw-primary', selectedTheme.colors.primary);
		document.documentElement.style.setProperty('--tw-secondary', selectedTheme.colors.secondary);
	};

	return (
		<ThemeContext.Provider value={{ currentTheme, switchTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
