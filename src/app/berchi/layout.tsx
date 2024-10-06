'use client';

// src/app/berchi/layout.tsx
import { useTheme } from '@/context/ThemeContext';
import useFcmToken from '@/hooks/useFcmToken';
import { useEffect } from 'react';

const BerchiLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { switchTheme } = useTheme();
	const { notificationPermissionStatus } = useFcmToken();
	console.log('notification status:',notificationPermissionStatus);
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
