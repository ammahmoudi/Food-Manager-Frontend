// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface Theme {
	key: 'ai' | 'berchi';
}

interface ThemeContextType {
	currentTheme: Theme;
	switchTheme: (themeKey: 'ai' | 'berchi') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const pathName = usePathname();
	const [currentTheme, setCurrentTheme] = useState<Theme>({ key: 'ai' }); // Default to AI theme

	const switchTheme = (themeKey: 'ai' | 'berchi') => {
		setCurrentTheme({ key: themeKey });
		document.body.className = themeKey; // Set body class for Tailwind
	};

	useEffect(() => {
		// Automatically switch theme based on the current path
		const themeFromPath = pathName.startsWith('/humaani') ? 'ai' : 'berchi';
		switchTheme(themeFromPath as 'ai' | 'berchi');
	}, [pathName]); // Update theme on path change

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
