'use client';

// src/app/berchi/layout.tsx
import { useTheme } from '@/context/ThemeContext';
import { useEffect } from 'react';

const BerchiLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { switchTheme } = useTheme();
	useEffect(() => {
		switchTheme('berchi'); // Switch to the Berchi theme when this layout is used
	}, []);

	return (
		<div className="bg-berchi-background min-h-screen">
			{children}
		</div>
	);
};

export default BerchiLayout;
