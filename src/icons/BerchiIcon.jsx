export const BerchiIcon = ({ fill, size, height, width, ...props }) => {
	return (
		<svg
			width={size || width || 24}
			height={size || height || 24}
			viewBox="0 0 120 120"
			{...props}
		>
			<g
				fill={fill}
				stroke={fill}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={0}
			>
				<path fill={fill}  d="M56.9,113.77c-12.55,0-25.1.03-37.66-.01-11.24-.04-19.09-7.61-19.15-18.89C-.04,69.51-.02,44.16.09,18.81.13,7.96,7.68.23,18.67.15c25.48-.19,50.95-.2,76.43,0,11.15.09,18.58,7.87,18.61,19.03.08,25.1.09,50.21,0,75.31-.04,11.71-7.8,19.24-19.53,19.27-12.43.03-24.86,0-37.28,0ZM40.43,48.6c3.46-2.51,5.51-5.43,5.29-9.57-.27-5.05-3.9-10.11-9.65-10.77-8.45-.97-17.04-.77-25.57-.86-.59,0-1.72,1.63-1.72,2.5-.11,14.27-.12,28.54.04,42.81,0,.89,1.61,2.51,2.49,2.53,7.94.19,15.89.32,23.82,0,7.14-.28,12.35-4.48,13.87-10.38,1.7-6.65-.76-11.46-8.57-16.27ZM67.48,74.99c0-3.95-.13-8.02.03-12.07.33-8.46,5.59-12.01,13.18-9.04.21.08.49.01,1.03.01.73-2.21,1.72-4.5,2.15-6.88.17-.95-.6-2.56-1.45-3.13-4.39-2.96-8.41-2.21-11.75,1.96-.86,1.08-1.65,2.21-2.78,3.72-1.04-7.35-1.03-7.26-7.98-7.09-2.54.06-3.51.91-3.47,3.5.12,6.83.04,13.66.04,20.48q0,10.09,10.99,8.54ZM84.9,36.53c.41.14.82.29,1.22.43,1.21-.59,2.39-1.57,3.64-1.67,1.74-.14,4.13-.19,5.11.82.85.88.53,3.42.01,4.99-.81,2.44-2.36,4.63-3.33,7.03-1.52,3.74-1.39,7.58.52,11.13.5.92,2.05,1.53,3.21,1.71.45.07,1.27-1.36,1.71-2.22,1.49-2.93,2.87-5.92,4.34-8.87,1.9-3.83,4.35-7.49,5.61-11.51,1.2-3.82-.53-7.45-3.97-9.65-4.75-3.03-10.25-3.25-14.83-.55-2.02,1.19-2.21,5.49-3.23,8.37ZM101.24,69.68c0-3.34-3.09-6.47-6.43-6.49-3.38-.02-6.36,2.98-6.38,6.42-.03,3.45,2.91,6.45,6.31,6.46,3.36,0,6.5-3.08,6.5-6.4Z" />
				<path fill={fill}
					class="cls-1"
					d="M21.8,66.32v-11.28c3.74.35,7.47.26,10.92,1.21,1.47.4,3.23,2.98,3.22,4.56-.01,1.54-1.87,3.99-3.36,4.39-3.35.91-6.98.79-10.78,1.11Z"
				/>
				<path fill={fill}
					class="cls-1"
					d="M21.77,46.1v-9.3c3.57-.13,7.33-1.35,9.97,1.84.9,1.09,1.06,3.84.3,5.05-2.37,3.79-6.41,1.84-10.27,2.4Z"
				/>
			</g>
		</svg>
	);
};
