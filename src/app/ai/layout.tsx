'use client';
// src/app/ai/layout.tsx
import { useTheme } from '@/context/ThemeContext';
import { useEffect } from 'react';

const AILayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { switchTheme } = useTheme();

	useEffect(() => {
		switchTheme('ai'); // Switch to the AI theme when this layout is used
	}, [switchTheme]);

	return (
		<div className="bg-ai-background min-h-screen">
			{children}
		</div>
	);
};

export default AILayout;
