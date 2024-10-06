export  const MaaniIcon = ({ fill, size, height, width, ...props }) => {
	return (
		<svg
			width={size || width || 24}
			height={size || height || 24}
			viewBox="0 0 180 180"
			{...props}
		>
			<g
			      fill={fill}
				  stroke={fill}
				  strokeLinecap="round"
				  strokeLinejoin="round"
				  strokeWidth={0}
			>
				<path fill={fill}
					d="M150.45,141.19l-.46-.65-.48.63c-4.4,5.78-8.98,7.87-13.63,6.27,8.05-2.24,8.12-2.28,8.2-2.31l1.31-.58-1.34-.5c-8.04-2.98-13.64-10.37-17.02-16.29,5.98-2.07,9.74-6.18,11.16-12.24.68-2.89.39-5.84-.82-8.3h0c-1.15-2.34-2.82-3.87-4.95-4.56-2.88-.93-6.54-.24-10.86,2.06l-3.1,1.65,3.46-.56c1.94-.32,4.91,1.16,5.48,3.27.58,2.12-1.43,4.18-5.66,5.83-.13.05-.28.09-.41.14-3.15-7.64-7.25-14.19-12.2-19.51,1.83-.81,1.84-1.01,1.84-1.35v-.16l-.08-.14c-.37-.63-.79-1.24-1.22-1.84,3.84-3.13,3.96-3.41,3.76-3.83-.29-1.21-.86-2.32-1.69-3.32,12.3-1.67,21.46-4.72,27.2-9.09h0c3.94-3,5.99-7.98,5.36-13-3.17-25.41-22.45-43.44-33.66-51.94l-.23-.18c-.59-.45-1.07-.77-1.55-1.04-10.7-6.15-25.84-6.39-36.71-5.51-.07-.03-.13-.06-.2-.09l-.05.11c-9.67.81-17.11,2.56-17.98,2.78-.25.08-.42.32-.42.58l.03.49c-2.61,2.93-16.44,18.86-25.31,38.28-.04.08-.08.15-.1.23-2.26,4.96-4.19,10.14-5.52,15.4-.02.04-.03.09-.03.13-.02.06-.03.11-.05.16-.01.06-.03.12-.04.17,0,.01,0,.02-.02.03h0c-.1.2-.55.7-.33,1.22.02.04.04.09.07.13.32.54,1.14,1.06,1.25,1.13,0,0,.01,0,.01,0,0,0,.05.03.13.1.02.02.05.03.07.05,1.63,1.22,12.44,9.29,20.98,14.49-5.49,1.43-8.71,3.99-9.58,7.6-.2.43-.08.7,3.76,3.83-.44.59-.85,1.2-1.22,1.83l-.08.14v.16c0,.35,0,.56,2.13,1.48-4.99,6.05-9.76,14.88-10,26.62-.03,1.22.06,2.56.28,4.07.63,4.53,1.75,19.82-10.55,26.39l-.84.45.78.54c.62.42,11.8,5.49,24.39,6.39,1.86,3.02,5.67,7.25,12.42,7.25,1.37,0,2.87-.18,4.5-.57,1.78-.44,3.48-1.33,4.91-2.58,2.26-1.99,3.86-4.89,4.87-8.86.02-.09.04-.2.07-.29,2.88-.64,7.64-1.15,15.35-.8.09.12.17.25.26.37l.18.24h0c1.31,1.78,2.7,3.32,4.13,4.56,5.2,4.52,10.97,6.95,16.07,6.95,1.87,0,3.65-.33,5.27-1,4.73-1.96,7.58-6.49,8.04-12.8h0c.04-.51.05-1.03.06-1.56.16.21.31.41.47.61h-.01s.53.67.53.67c0,0,0,.01.01.02l.24.3h0c5.3,6.65,10.22,10.13,15.03,10.62.4.04.8.06,1.2.06,1.49,0,2.96-.27,4.29-.81,4.88-1.94,8.02-5.12,9.31-9.43,1.59-5.33-.24-10.52-.44-10.82ZM128.53,108.77c-.54-1.98-2.52-3.43-4.5-3.95,3.19-1.39,5.88-1.75,8.04-1.05,1.82.59,3.25,1.92,4.26,3.97,1.09,2.23,1.35,4.9.73,7.53-1.37,5.87-5.09,9.78-11.05,11.63-1.87.59-3.97.96-6.22,1.11l-.27.02c-3.65.21-6.45-.27-6.49-.27-5.55-.8-10.58-3.47-15.09-7.23-8.61-7.17-15.3-18.31-19.94-28.02h0c-.36-.75-.7-1.5-1.03-2.22l-.13-.29v-.12s-.1-.09-.1-.09c-1.18-2.6-2.88-6.59-4.4-10.97l-.05-.14v-4.83s-1.15,4.79-1.15,4.79c-.45,1.88-.87,3.78-1.26,5.64-.35,1.66-.68,3.32-.97,4.95-.94,5.22-1.55,10.05-1.81,14.35-.12,1.99-.17,3.9-.15,5.66v.07c.17,11.64,3.39,19.17,9.58,22.38,3.15,1.62,6.95,2.08,11.31,1.36.28-.04.55-.1.83-.15v.02s.81-.19.81-.19c1.2-.27,2.3-.6,3.26-.92-.51.39-1.01.77-1.52,1.13-.05.03-.09.06-.14.09-.46.33-.92.65-1.37.95-.12.08-.23.16-.36.23-.29.18-.57.36-.85.53-1.16.71-2.32,1.35-3.47,1.91-1.92.93-3.82,1.63-5.67,2.1-2.88.74-5.62.92-8.15.54-1.49-.22-2.89-.63-4.15-1.22-1-.47-1.91-1.04-2.68-1.7-.71-.6-1.37-1.26-1.98-1.96-.69-.79-1.33-1.66-1.89-2.56h0c-7.63-12.26-3.68-33.5-.65-45.08.43-1.65.87-3.21,1.3-4.63.14-.47.28-.9.4-1.29l.08-.26c.1-.32.19-.6.27-.86l-1.1-.37-.88,2.55h0c-.47,1.35-1.01,2.9-1.56,4.42-1.06,2.96-1.86,5.03-2.36,6.15-.55,1.24-1.25,2.73-2,4.3-3.11,6.6-7.36,15.64-8.64,22.77-1.77,9.86,1.09,23.86,2.68,28.84-19.6-12.77-10.55-36.63-9.43-39.36.33-.8.71-1.64,1.12-2.5.1-.22.21-.44.33-.68.49-1.01,1.09-2.17,1.88-3.65.41-.76.83-1.54,1.27-2.32.17-.3.34-.61.51-.91l.19-.34c.1-.17.19-.35.3-.52l.34-.59c.21-.37.43-.75.64-1.12,1.09-1.9,2.31-3.95,3.61-6.11l.14-.24c.05-.09.11-.17.15-.25.16-.27.32-.53.48-.79l.66-1.07c.16-.27.32-.54.48-.79l1.81-2.92.33.12.25-.64c.19-.48.38-.96.55-1.44.01-.03.02-.06.03-.1.36-1.02.68-2.08.94-3.15.22-.88.4-1.81.56-2.76l.08-.51-.49-.14c-.15-.04-14.88-4.38-19.76-14.87-2.28-4.89-2.08-10.4.58-16.37.02-.04.04-.08.05-.11,1.06-2.16,5.12-9.63,13.13-15.26,11.25-7.9,25.1-8.91,41.14-2.99,2.97,1.24,11.97,6.21,20.84,13.69,7.91,7.35,12.91,13.6,14.41,15.56l-40.76,20.18-.47.23.2.56s.03.09.04.13l.55-.2-.52.26.04.13c.03.11.06.22.1.3l.07.23s0,0,0,0c.11.36.22.72.34,1.08h0l.16.46c.11.34.22.68.34,1.02.03.11.06.21.09.29l.41,1.23c.05.14.1.27.14.41v.31l.11.02.03.08h.01s.03.1.05.15h0s.28.77.28.77l.13.39h0c.14.39.28.78.42,1.16.06.16.12.32.18.48.13.35.26.7.4,1.05.07.17.13.34.2.51.14.35.27.69.41,1.03.06.14.12.29.17.43.19.47.38.93.57,1.39.03.06.05.13.08.19.17.39.33.78.5,1.16.06.15.13.29.19.44.13.3.27.6.4.89.07.15.14.3.21.45.14.31.28.61.42.9.06.12.11.24.17.36.19.41.39.81.59,1.2.04.08.08.16.12.24.16.31.32.63.47.93.07.13.14.26.2.39.13.26.27.51.4.76.07.13.14.26.21.39.15.27.3.54.44.8.05.09.1.18.15.27.2.35.39.69.59,1.02.05.08.1.17.15.25.15.25.3.5.45.75.07.11.14.22.21.33.14.22.27.44.41.65.07.11.13.21.2.32.16.24.32.48.47.72.04.06.08.13.13.19.2.3.4.58.6.87.05.08.11.15.16.22.15.21.3.41.44.62.07.09.14.19.21.28.14.19.28.37.42.55.07.08.13.17.2.25.17.22.35.44.52.66.03.03.05.06.08.1.2.25.4.49.6.72.06.07.11.13.17.2.14.17.29.34.43.5.07.08.13.15.2.22.14.16.28.31.42.46.06.07.12.13.18.2.19.2.38.41.58.6,0,0,0,0,.01.01.2.2.39.4.59.59.06.06.12.11.17.17.14.13.28.27.42.4.06.06.13.12.19.18.14.13.28.26.43.38.05.05.11.1.16.14.2.17.39.33.58.49,0,0,.02.01.03.02.18.15.37.3.55.44.06.04.11.09.17.13.14.11.28.21.42.31.06.04.12.09.18.13.14.1.29.21.43.31.05.03.1.07.14.1.19.13.38.26.57.38.02.01.04.03.06.04.17.11.33.21.5.31.06.03.11.07.17.1.13.08.27.16.4.24.06.03.11.06.17.1.15.08.29.16.44.24.04.02.07.04.11.06.18.1.37.19.55.28.03.01.06.03.09.04.15.07.3.15.45.21.05.02.1.05.15.07.13.06.26.12.39.17.05.02.1.04.15.06.15.06.3.12.44.18.03.01.05.02.08.03.18.07.35.13.52.19.03.01.06.02.1.03.14.05.28.09.41.14.05.02.1.03.15.05.12.04.25.08.37.11.04.01.09.03.13.04.15.04.31.08.46.12,0,0,.02,0,.03,0,.17.04.33.08.49.12.03,0,.06.01.09.02.13.03.26.05.38.08.04,0,.09.02.13.02.12.02.24.04.36.06.04,0,.07.01.11.02.31.05.61.09.91.12.03,0,.06,0,.09,0,.12.01.24.02.35.03.04,0,.07,0,.11,0,.12,0,.23.02.35.02.03,0,.05,0,.08,0,.26.01.51.02.76.02.01,0,.03,0,.04,0,.2,0,.39,0,.58-.01.05,0,.1,0,.15,0,.19,0,.37-.02.55-.03.03,0,.06,0,.08,0,.16-.01.32-.03.48-.05.04,0,.08,0,.12-.01.16-.02.32-.04.48-.07.04,0,.08-.01.12-.02.15-.03.31-.05.45-.08.02,0,.04,0,.07-.01.13-.03.25-.05.37-.08.04,0,.07-.02.11-.03.12-.03.24-.06.36-.09.04-.01.08-.02.11-.03.1-.03.19-.05.28-.08.02,0,.04,0,.05-.01l.61-.18v-.02c.12-.05.25-.08.38-.13,6.55-2.55,6.79-5.61,6.36-7.21ZM77.5,95.6c.21,1.12.43,2.27.76,3.4v.5h.15c3.05,10.29,8.13,27.3,9.85,32.28-.2.04-.4.08-.62.11-4.11.68-7.68.26-10.6-1.25-.05-.02-.09-.05-.13-.08-4.82-16.82-6.65-35.3-7.07-40.08.06-.35.12-.71.19-1.06.29-1.62.61-3.27.96-4.92.25-1.22.53-2.46.81-3.7,1.37,3.76,2.81,7.12,3.85,9.41v.13s.1.1.1.1l.14.31c.2.44.41.9.62,1.35l.39,1.32c.15.51.31,1.06.48,1.62.03.18.07.36.11.55ZM88.19,83.62s.08.02.12.03c.16.04.33.09.52.14.05.01.09.03.14.04.2.06.4.12.62.19.03.01.07.02.11.03.21.07.43.14.66.22.04.01.07.02.1.04.25.09.51.18.77.28.06.02.11.04.17.06.27.1.55.21.85.33.04.02.09.04.13.05.29.12.58.24.89.38.03.01.06.03.09.04.32.14.64.29.97.45.06.03.13.06.19.09.33.16.67.33,1.02.51.05.03.11.06.17.09.34.18.69.37,1.05.57.03.01.05.03.08.04.37.21.74.43,1.12.65.07.04.15.09.22.13.37.23.75.47,1.13.72.07.04.13.09.2.13.39.26.78.52,1.18.8.02.01.03.02.05.04.4.28.81.59,1.22.9.08.06.16.12.24.18.4.31.8.63,1.21.96.07.06.15.12.23.19.42.35.85.71,1.28,1.09.11.1.23.2.35.31.81.74,1.61,1.51,2.35,2.27.01.01.03.03.04.05l.35.41h.02c4.96,5.23,9.07,11.74,12.22,19.35-.02,0-.04.01-.07.02-.03,0-.07.02-.1.02-.05.01-.1.02-.15.03-.04,0-.09.02-.14.03-.04,0-.09.02-.13.03-.06.01-.11.02-.17.03-.04,0-.07.01-.11.02-.06.01-.13.02-.2.03-.03,0-.06.01-.09.02-.07.01-.15.02-.22.03-.03,0-.05,0-.08.01-.08.01-.17.02-.25.03-.02,0-.04,0-.06,0-.09.01-.19.02-.28.03-.01,0-.03,0-.04,0-.1,0-.21.02-.31.03,0,0,0,0,0,0-.92.06-1.97.05-3.11-.1-.02,0-.04,0-.06,0-.12-.02-.24-.03-.35-.05-.03,0-.07-.01-.1-.02-.11-.02-.22-.04-.33-.06-.04,0-.09-.02-.13-.02-.11-.02-.21-.04-.32-.07-.05-.01-.1-.02-.15-.03-.1-.02-.21-.05-.31-.07-.06-.01-.12-.03-.17-.04-.1-.03-.2-.05-.3-.08-.06-.02-.13-.04-.19-.05-.1-.03-.2-.06-.3-.09-.07-.02-.14-.04-.21-.07-.1-.03-.19-.06-.29-.1-.07-.02-.15-.05-.22-.08-.1-.03-.19-.07-.29-.1-.08-.03-.16-.06-.23-.09-.09-.04-.19-.07-.28-.11-.08-.03-.17-.07-.25-.1-.09-.04-.18-.08-.27-.12-.09-.04-.18-.08-.27-.12-.09-.04-.18-.08-.27-.12-.1-.05-.19-.09-.29-.14-.08-.04-.17-.08-.25-.13-.11-.05-.21-.11-.32-.17-.08-.04-.15-.08-.23-.12-.12-.06-.24-.13-.35-.2-.07-.04-.13-.08-.2-.12-.14-.08-.29-.17-.44-.26-.04-.03-.08-.05-.12-.07-.38-.24-.77-.5-1.16-.77-.01,0-.03-.02-.04-.03-.18-.13-.36-.26-.54-.39-.04-.03-.08-.06-.12-.09-.16-.12-.31-.24-.47-.36-.05-.04-.1-.08-.15-.12-.15-.12-.29-.24-.44-.36-.06-.05-.11-.1-.17-.14-.14-.12-.28-.24-.43-.37-.06-.05-.12-.11-.18-.17-.14-.12-.28-.25-.42-.38-.06-.06-.13-.12-.19-.18-.14-.13-.28-.26-.41-.4-.07-.06-.13-.13-.2-.2-.14-.14-.27-.27-.41-.41-.07-.07-.13-.14-.2-.21-.14-.14-.27-.29-.41-.44-.07-.07-.13-.15-.2-.22-.14-.15-.28-.31-.41-.46-.07-.07-.13-.15-.2-.23-.14-.16-.28-.32-.42-.49-.07-.08-.13-.16-.2-.24-.14-.17-.28-.34-.42-.52-.06-.08-.13-.16-.19-.24-.14-.18-.29-.37-.43-.55-.06-.08-.13-.16-.19-.25-.15-.19-.29-.39-.44-.59-.06-.08-.12-.16-.18-.24-.15-.21-.31-.43-.46-.65-.05-.08-.11-.15-.16-.23-.16-.23-.32-.47-.48-.71-.05-.07-.09-.13-.14-.2-.18-.27-.35-.54-.53-.81-.03-.05-.06-.09-.09-.14-.84-1.31-1.67-2.74-2.51-4.29-.03-.06-.06-.12-.09-.18-.17-.33-.35-.65-.52-.99-.05-.1-.11-.21-.16-.32-.15-.29-.3-.59-.45-.89-.07-.13-.13-.27-.2-.4-.14-.28-.28-.56-.41-.85-.07-.16-.15-.32-.22-.47-.13-.27-.26-.55-.38-.83-.08-.17-.16-.35-.24-.53-.12-.27-.24-.54-.37-.82-.08-.19-.17-.38-.25-.58-.12-.27-.23-.54-.35-.82-.09-.21-.17-.41-.26-.62-.11-.27-.23-.54-.34-.82-.09-.22-.18-.44-.27-.67-.11-.27-.22-.55-.33-.83-.09-.23-.18-.47-.27-.71-.11-.28-.21-.55-.32-.83-.09-.25-.19-.5-.28-.75-.04-.11-.08-.23-.13-.34.02,0,.05.01.07.02.11.03.23.06.36.09ZM108.31,94.63c-.44-.47-1.21-1.25-2.28-2.19-.12-.11-.25-.22-.37-.32-.28-.25-.56-.49-.84-.73-.1-.08-.19-.16-.29-.24-.18-.15-.37-.31-.55-.46-.11-.09-.23-.18-.34-.27-.16-.13-.33-.26-.49-.39-.12-.09-.24-.18-.36-.28-.15-.12-.31-.23-.46-.35-.12-.09-.25-.18-.37-.27-.15-.11-.3-.22-.44-.32-.12-.09-.25-.17-.37-.26-.15-.1-.29-.2-.44-.3-.12-.08-.24-.16-.36-.24-.15-.1-.29-.19-.43-.29-.12-.08-.24-.15-.36-.23-.14-.09-.29-.18-.43-.27-.12-.07-.23-.15-.35-.22-.14-.09-.29-.17-.43-.26-.11-.07-.22-.13-.33-.2-.15-.09-.29-.17-.44-.25-.1-.06-.21-.12-.31-.18-.16-.09-.31-.17-.47-.26-.09-.05-.17-.1-.26-.14-.24-.13-.47-.25-.71-.37-.04-.02-.08-.04-.12-.06-.2-.1-.39-.2-.58-.29-.08-.04-.16-.08-.24-.12-.14-.07-.29-.14-.43-.2-.09-.04-.18-.08-.27-.12-.13-.06-.26-.12-.39-.17-.09-.04-.18-.08-.27-.12-.12-.05-.25-.11-.37-.16-.09-.04-.17-.07-.26-.11-.12-.05-.23-.1-.35-.14-.09-.03-.17-.07-.25-.1-.11-.04-.22-.09-.33-.13-.08-.03-.16-.06-.24-.09-.11-.04-.22-.08-.33-.12-.07-.03-.15-.05-.22-.08-.11-.04-.22-.08-.32-.11-.07-.02-.13-.05-.19-.07-.11-.04-.22-.07-.32-.11-.06-.02-.12-.04-.17-.06-.11-.04-.22-.07-.33-.1-.04-.01-.09-.03-.13-.04-.13-.04-.25-.08-.38-.11-.02,0-.04-.01-.05-.02-.28-.08-.54-.15-.77-.21-.02,0-.05-.01-.07-.02-.09-.02-.18-.04-.26-.06-.03,0-.06-.01-.09-.02-.07-.02-.14-.03-.2-.05-.03,0-.06-.01-.09-.02-.06-.01-.11-.03-.16-.04-.03,0-.06-.01-.09-.02-.05,0-.09-.02-.13-.03-.03,0-.05-.01-.08-.02-.02,0-.03,0-.05,0l-.04-.12s.04,0,.07,0c.08,0,.17.02.27.03.06,0,.12.01.18.02.08,0,.16.02.25.03.09,0,.18.02.27.03.07,0,.14.02.22.03.17.02.35.04.54.07.03,0,.07,0,.1.01.16.02.32.05.49.07.07.01.14.02.22.03.14.02.28.04.42.07.09.01.17.03.26.05.14.02.28.05.42.08.09.02.19.04.29.06.14.03.28.06.43.09.1.02.21.04.31.07.15.03.29.06.44.1.11.02.22.05.33.08.15.04.3.07.46.11.11.03.23.06.34.09.16.04.31.08.47.13.12.03.23.06.35.1.16.05.33.1.5.15.12.03.23.07.35.11.17.05.35.11.53.17.11.04.23.07.34.11.2.07.4.14.59.21.09.03.19.07.28.1.3.11.59.22.89.35.06.02.12.04.21.09,3.52,1.45,6.48,3.41,8.81,5.83l.06.05c1.01,1.06,1.91,2.21,2.67,3.43-.33.17-.82.4-1.3.61ZM109.02,91.09c-.27-.31-.69-.77-1.25-1.31-.02-.02-.05-.05-.07-.07-2.13-2.21-4.76-4.05-7.81-5.47-.44-.2-.88-.4-1.33-.58-.09-.04-.18-.08-.26-.11-5.12-2.08-9.81-2.49-11.36-2.63-.03,0-.06,0-.08,0l-.53-1.57s.02,0,.04,0c.01,0,.03,0,.04,0,.1,0,.22,0,.34,0,.03,0,.07,0,.11,0,.12,0,.25,0,.38,0,.03,0,.06,0,.09,0,.17,0,.34,0,.53,0,.03,0,.06,0,.08,0,.16,0,.32,0,.49,0,.06,0,.12,0,.17,0,.16,0,.33,0,.5,0,.05,0,.1,0,.16,0,.22,0,.46.01.69.02.03,0,.05,0,.08,0,.21,0,.43.02.65.03.07,0,.14,0,.21,0,.19,0,.39.02.59.03.07,0,.14,0,.21.01.27.02.54.03.82.05.01,0,.03,0,.04,0,.26.02.52.04.79.06.08,0,.17.01.25.02.21.02.42.04.64.06.09,0,.17.02.26.02.29.03.58.06.87.09,0,0,.01,0,.02,0l5.95,1.01c.5.12.98.24,1.44.38,3.29.94,5.78,2.2,7.41,3.76,1.05,1,1.75,2.14,2.1,3.4-.45.46-1.85,1.65-3.23,2.79ZM108.29,10.66c.43.25.87.54,1.42.96l.23.18c11.07,8.38,30.09,26.17,33.21,51.15.58,4.61-1.31,9.19-4.91,11.93-5.71,4.35-14.96,7.37-27.49,8.98-.1-.09-.22-.18-.33-.27-.13-.11-.25-.21-.38-.32-.15-.12-.32-.23-.48-.35-.14-.1-.28-.2-.43-.3-.17-.11-.36-.22-.54-.33-.16-.09-.31-.19-.47-.28-.19-.11-.4-.21-.61-.31-.17-.09-.33-.17-.51-.26-.22-.1-.45-.2-.68-.3-.18-.08-.35-.15-.53-.23-.25-.1-.52-.19-.78-.29-.18-.06-.35-.13-.54-.19-.3-.1-.62-.2-.94-.29-.16-.05-.32-.1-.48-.15-.13-.04-.26-.07-.39-.1l29.23-18.92,2.1-.96-.03-.4c-.02-.31-.59-7.64-8.55-18.22-7.1-9.43-21.68-23.26-50.97-36.26,10.48-.66,24.1-.09,33.85,5.52ZM71.95,5.33c30.34,13.12,45.26,27.17,52.45,36.67,6.78,8.97,8.11,15.66,8.35,17.31l-41.4,18.93v.02c-.06,0-.13,0-.2-.01-.1,0-.2-.01-.29-.02-.32-.01-.63-.03-.92-.04-.02,0-.03,0-.04,0-.28,0-.56-.02-.82-.02-.08,0-.15,0-.23,0-.19,0-.38,0-.56,0-.08,0-.15,0-.23,0-.17,0-.33,0-.49,0-.04,0-.08,0-.12,0s-.07,0-.1,0c-.08,0-.15,0-.23,0-.1,0-.19,0-.28,0-.06,0-.11,0-.17,0-.1,0-.19,0-.28,0-.03,0-.07,0-.1,0-.1,0-.18,0-.26,0-.02,0-.04,0-.06,0,0,0,0,0-.01,0-.16-.51-.32-1.02-.46-1.43l-.07-.22c-.03-.08-.05-.16-.07-.23l41.26-20.43-.02-.97h-.25c-1.25-2.16-9.29-14.92-30.86-28.99l-.12-.12h-.1c-.78-.44-1.84-1.12-3.15-1.98-2.99-1.95-7.51-4.9-13.54-7.92-.41-.2-.83-.41-1.23-.6-.25-.12-.5-.24-.75-.36-.5-.24-1.01-.48-1.53-.72-.26-.11-.52-.23-.78-.35-.27-.12-.55-.25-.8-.36-.52-.23-1.04-.46-1.57-.67-.05-.03-.1-.05-.15-.07-.54-.22-1.08-.44-1.63-.67-.58-.23-1.17-.46-1.76-.69-.43-.17-.87-.34-1.31-.49-.38-.14-.77-.28-1.15-.41-.39-.14-.78-.27-1.17-.41-.55-.19-1.11-.38-1.67-.57l-.36-.12c-.52-.17-1.05-.33-1.59-.5-1.5-.46-3.04-.91-4.61-1.32,3-.62,8.68-1.66,15.48-2.24ZM44.88,80.69c1.6.96,2.99,1.72,4.16,2.28-.08.04-.16.08-.24.11-.17.08-.35.16-.52.25-.24.12-.48.23-.72.36-.17.09-.34.18-.51.27-.23.12-.46.25-.68.38-.16.09-.33.19-.49.29-.22.13-.44.27-.65.41-.15.1-.31.2-.46.3-.22.15-.43.3-.64.45-.14.1-.28.2-.42.3-.22.16-.43.33-.65.5-.12.1-.24.19-.36.29-.24.2-.47.4-.7.61-.08.08-.17.15-.25.22-.31.29-.62.58-.91.89l-.1.1c-.57.55-.99,1.01-1.26,1.32-1.38-1.14-2.79-2.34-3.23-2.79.83-3.05,3.73-5.25,8.63-6.54ZM41.56,89.52l.15-.16c.8-.83,1.68-1.59,2.63-2.31,1.43-1.08,3.02-2.03,4.77-2.85.41-.19.82-.37,1.25-.55l.08-.03s.03-.01.05-.02c.3.11.58.21.83.29l-.44.71s-.06.04-.09.06c-.02.01-.04.02-.06.04-.07.04-.13.09-.21.13-.03.02-.07.04-.1.06-.07.04-.14.09-.21.14-.04.03-.09.06-.13.09-.07.05-.14.09-.21.14-.05.04-.11.07-.17.11-.07.05-.14.1-.22.15-.06.04-.13.09-.19.14-.07.05-.15.1-.22.16-.07.05-.14.1-.22.16-.08.05-.15.11-.23.17-.08.06-.16.12-.24.18-.08.06-.16.12-.24.18-.09.06-.17.13-.26.2-.08.06-.17.13-.25.19-.09.07-.18.14-.27.21-.09.07-.17.14-.26.21-.1.08-.19.15-.29.23-.09.07-.18.15-.27.22-.1.08-.2.16-.29.24-.09.08-.19.16-.29.24-.1.08-.2.17-.3.25-.1.08-.19.17-.29.25-.1.09-.21.18-.31.27-.1.09-.2.18-.29.26-.11.1-.21.19-.32.29-.1.09-.21.19-.31.29-.11.1-.21.2-.32.3-.11.1-.22.21-.33.32-.1.09-.19.18-.29.28l-.04.03c-1.51,1.28-2.51,2.3-2.97,2.79-.48-.21-.98-.44-1.3-.61.77-1.22,1.67-2.38,2.67-3.43ZM20.9,152.15c11.94-7.19,10.83-22.43,10.18-27.02-.21-1.46-.29-2.73-.27-3.89.29-14.06,7.27-23.84,13.1-29.58l.23-.14v-.08c.23-.23.46-.44.69-.66.07-.07.14-.13.21-.19.16-.15.32-.29.47-.43.08-.07.15-.14.23-.21.15-.13.3-.26.44-.39.07-.06.15-.13.22-.19.16-.13.31-.26.46-.39.06-.05.11-.1.17-.14.2-.17.4-.33.6-.49,0,0,0,0,0,0,.21-.16.41-.32.6-.47.04-.03.07-.05.11-.08.15-.12.3-.23.45-.34.05-.04.1-.08.16-.12.13-.09.25-.19.37-.27.03-.02.05-.04.08-.06-.07.12-.14.23-.21.35l-.65,1.06c-.16.26-.32.52-.48.8l-.14.24c-.05.09-.11.17-.15.25-1.31,2.15-2.52,4.21-3.62,6.12-.21.37-.43.75-.64,1.12l-.33.58c-.11.18-.21.36-.31.54l-.19.33c-.18.31-.35.62-.52.93-.44.79-.86,1.57-1.28,2.34-.8,1.49-1.4,2.66-1.89,3.68-.12.24-.23.47-.33.69-.42.88-.81,1.73-1.15,2.56-1.19,2.9-10.97,28.71,11.39,41.71l2.34,1.35-1.59-2.21c-.79-1.1-5.24-18.18-3.17-29.69,1.25-6.98,5.47-15.94,8.55-22.48.74-1.58,1.45-3.07,2-4.32.08-.19.17-.39.27-.62-.08.38-.16.76-.24,1.15,0,.05-.02.1-.03.14-.07.34-.14.69-.21,1.04,0,.02,0,.04-.01.06-.07.38-.15.76-.22,1.15,0,.05-.02.09-.03.14-.07.36-.13.72-.2,1.09-.02.11-.04.23-.06.34-.05.3-.1.6-.15.9-.02.14-.05.29-.07.43-.04.28-.09.56-.13.84-.02.14-.04.28-.06.42-.04.29-.08.57-.12.86-.02.16-.04.33-.06.49-.04.27-.07.54-.11.81-.02.16-.04.33-.06.5-.03.27-.07.54-.1.82-.02.18-.04.36-.06.53-.03.26-.06.53-.08.79-.02.19-.03.38-.05.57-.02.25-.05.51-.07.76-.02.2-.03.41-.05.61-.02.24-.04.49-.05.73-.01.21-.02.41-.04.62-.01.24-.03.48-.04.72-.01.21-.02.42-.03.63-.01.24-.02.48-.03.72,0,.21-.01.42-.02.64,0,.24-.01.47-.02.71,0,.21,0,.43,0,.64,0,.23,0,.47,0,.7,0,.22,0,.43,0,.65,0,.23,0,.46.01.69,0,.22.02.44.02.66,0,.22.01.45.02.67.01.22.03.44.04.66.01.22.02.45.04.67.02.22.04.44.05.66.02.22.03.44.06.66.02.22.05.44.07.65.02.22.05.43.07.65.03.22.06.43.09.65.03.21.06.43.09.64.03.22.07.43.11.65.03.21.07.41.1.62.04.21.08.43.13.64.04.21.08.41.12.62.05.21.1.42.14.62.05.2.09.41.14.61.05.21.11.41.17.62.05.2.1.39.16.59.06.2.12.4.19.6.06.19.12.39.18.58.07.2.14.39.21.59.07.19.13.38.2.57.07.19.15.38.23.57.07.18.15.37.23.55.08.19.17.37.25.55.08.18.16.36.25.54.09.18.18.36.28.54.09.18.18.35.27.53.1.17.2.34.3.52.09.15.17.3.26.45.02.19.03.39.04.58.02.22.03.44.05.67.01.22.02.45.03.68.01.22.02.45.03.67,0,.23.01.47.02.7,0,.23.01.45.01.68,0,.24,0,.48,0,.71,0,.23,0,.46,0,.69,0,.24-.02.48-.03.72,0,.23-.01.47-.03.7-.01.24-.03.48-.05.72-.02.23-.03.47-.05.7-.02.24-.05.48-.08.72-.03.23-.05.46-.08.68-.03.24-.07.48-.11.72-.03.22-.06.44-.1.66-.04.24-.1.47-.15.71-.04.21-.08.43-.13.64-.06.24-.12.47-.19.7-.05.2-.1.41-.16.61-.07.23-.15.45-.23.68-.07.19-.12.39-.2.57-.09.23-.19.44-.28.66-.08.18-.14.36-.22.53-.11.22-.23.43-.34.65-.08.16-.16.32-.25.47-.13.22-.28.42-.42.63-.09.13-.17.27-.27.4-.17.22-.35.43-.53.64-.09.1-.16.21-.25.3-.28.3-.57.58-.88.84-2.85,2.37-6.94,2.86-12.18,1.46l-.73-.2v.76s0,.07.02.12c0,0,0,.02,0,.03.01.06.03.13.05.21,0,.02,0,.03.01.05.03.09.05.19.09.3,0,.01,0,.03.01.04.04.11.08.23.12.35,0,.02.01.04.02.06.05.13.1.28.16.43.01.03.02.06.04.1.06.16.13.32.2.49.01.02.02.05.03.07.08.17.16.35.24.53,0,.01.01.03.02.04.09.19.19.38.29.58.01.02.02.04.03.06-9.99-.86-19.16-4.37-22.12-5.69ZM69.29,154.01c-.96,3.74-2.44,6.45-4.51,8.28-1.29,1.13-2.82,1.93-4.42,2.32-8.66,2.12-13.37-2.31-15.81-6.4-.72-1.21-1.18-2.29-1.44-3.01,5.15,1.18,9.25.53,12.21-1.94.32-.27.62-.56.91-.86.1-.1.18-.21.27-.32.18-.21.37-.42.54-.64.1-.13.19-.27.29-.41.15-.21.29-.42.43-.64.09-.15.18-.31.27-.46.12-.22.24-.44.36-.66.08-.17.16-.33.24-.5.11-.23.21-.46.3-.7.07-.17.14-.35.21-.53.09-.24.18-.49.26-.74.06-.18.12-.36.17-.54.08-.26.15-.52.22-.79.05-.18.09-.35.14-.53.07-.28.13-.57.18-.86.03-.16.07-.33.1-.49.06-.35.12-.69.17-1.04.02-.11.04-.23.05-.34.06-.47.12-.94.16-1.41,0-.1.02-.21.02-.31.03-.37.06-.74.08-1.11,0-.17.02-.34.02-.51.01-.3.03-.61.04-.91,0-.19,0-.37,0-.56,0-.28,0-.57,0-.85,0-.19,0-.38,0-.57,0-.28,0-.55-.02-.82,0-.19-.01-.38-.02-.57,0-.13,0-.25-.01-.38.26.33.52.66.8.97.64.74,1.34,1.44,2.1,2.08.85.73,1.84,1.36,2.94,1.87.33.15.66.29,1,.42.11.04.22.07.32.11.24.08.48.17.72.24.13.04.27.07.41.11.22.06.45.12.68.17.15.03.3.06.45.09.13.03.27.06.4.08.1,5.44-.32,10.02-1.25,13.64h0ZM118.61,151.44h0c-.41,5.84-3.01,10.03-7.32,11.81-5.64,2.33-13.36.13-20.13-5.76-1.43-1.24-2.82-2.79-4.12-4.6l-.15-.2c-2.41-3.39-4.63-7.75-6.63-12.98.1-.03.19-.06.29-.09.16-.05.33-.1.49-.15.21-.07.43-.14.64-.21.16-.06.33-.11.49-.17.22-.08.43-.16.65-.24.16-.06.33-.12.49-.19.22-.09.44-.18.67-.28.16-.07.32-.14.48-.21.23-.1.46-.21.69-.32.15-.07.31-.14.46-.22.24-.12.49-.24.73-.37.14-.07.28-.14.43-.22.27-.15.55-.3.82-.45.11-.06.22-.12.34-.19.39-.22.78-.45,1.17-.69.23-.14.45-.28.68-.43.02.04.04.07.05.11.29.61.59,1.21.88,1.79.04.08.08.15.12.23.29.58.59,1.13.88,1.68.04.07.08.15.12.22.29.54.59,1.06.89,1.57.04.07.08.14.12.2.3.5.59.99.89,1.46.04.06.08.13.12.19.3.46.6.91.89,1.35.04.06.08.11.12.17.3.43.6.84.9,1.24.04.05.08.1.12.15.3.39.6.77.91,1.13.04.04.08.09.11.13.3.36.61.7.91,1.02.04.04.07.08.11.11.31.32.61.63.92.92.03.03.07.06.1.09.31.29.62.56.93.81.03.03.06.05.09.07.31.25.63.49.94.7.03.02.06.04.08.05.32.21.64.41.95.59.02.01.05.03.07.04.32.18.64.34.97.48.02,0,.04.02.06.02.33.14.66.26.98.37.01,0,.03,0,.04.01.33.1.67.19,1,.25,0,0,.01,0,.02,0,.34.06.68.11,1.02.13.18.01.36.02.54.02.08,0,.16-.01.24-.01.15,0,.3-.01.44-.03.17-.01.35-.03.52-.06.14-.02.27-.04.41-.07.18-.03.35-.07.52-.12.13-.03.25-.07.37-.1.18-.05.35-.12.53-.18.11-.04.22-.08.33-.13.18-.07.36-.16.53-.24.1-.05.2-.1.3-.15.18-.09.36-.19.53-.3.09-.05.17-.1.26-.15.18-.11.36-.23.53-.36.07-.05.15-.1.22-.16.18-.13.36-.27.53-.41.06-.05.13-.1.19-.15.18-.15.35-.3.52-.45.05-.05.11-.1.16-.15.17-.16.34-.32.5-.49.05-.05.09-.09.14-.14.17-.17.33-.34.48-.51.04-.04.08-.09.12-.13.16-.18.31-.35.45-.53.04-.04.07-.08.11-.13.14-.18.28-.35.42-.52.03-.04.07-.09.1-.13.13-.17.26-.34.38-.51.03-.04.06-.08.09-.13.12-.17.23-.33.34-.49.03-.04.06-.08.08-.12.13-.2.26-.39.38-.57.26-.41.49-.8.69-1.14.28,1.46.46,2.89.54,4.26.07,1.12.07,2.23,0,3.29ZM119.76,147.9c-.02-.24-.04-.49-.06-.74-.02-.21-.03-.41-.05-.62-.03-.29-.07-.59-.11-.89-.03-.19-.05-.38-.08-.58-.05-.33-.11-.67-.17-1.01-.03-.16-.05-.32-.08-.49-.1-.5-.2-1.01-.32-1.52l-.39-1.65-.71,1.54s-.49,1.06-1.37,2.45c-1.76,2.77-5.44,7.37-10.23,7.05-.32-.02-.64-.06-.97-.13-.11-.02-.21-.06-.32-.08-.22-.05-.43-.1-.65-.17-.13-.04-.26-.1-.39-.15-.19-.07-.39-.14-.58-.23-.14-.06-.28-.14-.42-.22-.18-.09-.37-.18-.55-.29-.14-.08-.29-.19-.43-.28-.18-.11-.36-.22-.54-.35-.15-.11-.3-.23-.45-.34-.18-.14-.35-.26-.53-.41-.15-.13-.3-.27-.45-.4-.17-.16-.35-.31-.52-.47-.15-.15-.3-.31-.46-.47-.17-.18-.34-.35-.52-.54-.15-.17-.31-.36-.46-.53-.17-.2-.34-.39-.51-.59-.16-.19-.31-.4-.47-.6-.17-.22-.34-.43-.51-.65-.16-.21-.31-.44-.47-.66-.17-.24-.33-.47-.5-.72-.16-.23-.31-.48-.47-.72-.17-.26-.33-.51-.5-.78-.16-.25-.32-.52-.47-.79-.17-.28-.33-.55-.5-.84-.16-.28-.32-.57-.48-.85-.16-.3-.33-.59-.49-.89-.16-.3-.32-.61-.48-.92-.16-.31-.33-.63-.49-.95-.16-.32-.32-.65-.48-.98-.13-.26-.25-.52-.38-.79.21-.14.42-.3.63-.45.21-.15.43-.3.64-.45.3-.21.59-.44.89-.66.2-.15.41-.3.61-.46.33-.25.66-.52.98-.79.17-.14.34-.27.52-.42.5-.41,1-.84,1.5-1.28l-.71-.92s-.18.1-.39.21c0,0,0,0,0,0-.07.03-.14.07-.23.11-.02,0-.03.02-.05.02-.07.03-.15.07-.23.11-.02.01-.05.02-.07.03-.08.04-.16.07-.25.11-.03.01-.06.03-.09.04-.09.04-.18.08-.28.12-.04.02-.08.03-.12.05-.09.04-.19.08-.29.12-.05.02-.1.04-.14.06-.1.04-.2.08-.31.12-.05.02-.11.04-.17.06-.1.04-.21.08-.31.12-.07.02-.13.05-.2.07-.11.04-.21.07-.32.11-.07.02-.14.05-.22.07-.11.04-.22.08-.34.11-.08.02-.15.05-.23.07-.12.04-.23.07-.35.11-.08.02-.17.05-.25.07-.12.04-.24.07-.37.1-.09.02-.17.05-.26.07-.13.03-.25.07-.38.1-.09.02-.18.04-.27.07-.09.02-.19.04-.28.07-1.68-4.81-6.94-22.45-10.01-32.79l-.1-.34c-.12-.44-.22-.88-.32-1.32.02.03.04.07.05.1.09.18.19.36.29.54.15.28.3.57.45.85.11.2.21.39.32.59.15.27.3.54.45.81.11.2.23.41.34.61.15.27.3.53.45.8.12.21.24.41.36.62.15.26.31.53.46.79.12.21.24.41.37.62.16.26.32.53.48.79.12.2.25.41.38.61.17.27.34.53.51.8.13.2.25.39.38.59.18.28.36.56.55.84.12.18.24.36.36.54.22.32.43.64.65.96.09.13.18.27.28.41.31.45.63.9.95,1.34.08.11.16.22.24.33.24.33.49.67.74.99.13.17.25.33.38.49.21.27.42.54.63.81.14.18.29.36.43.53.2.25.4.5.61.74.15.18.3.36.46.54.2.24.4.47.61.7.16.18.32.36.47.54.2.23.41.45.61.68.16.18.32.35.49.52.21.22.42.44.63.66.16.17.33.34.49.5.22.22.44.43.66.64.16.16.33.32.49.47.23.22.47.43.7.65.16.14.31.29.47.43.27.24.54.46.81.69.13.11.26.22.39.33.4.33.81.66,1.22.97.07.05.13.1.2.15.35.26.69.52,1.05.77.15.1.3.2.45.31.27.19.55.38.82.55.17.11.35.22.52.33.26.16.52.32.78.47.19.11.37.21.56.32.25.14.51.29.77.42.19.1.39.2.58.3.26.13.51.26.77.38.2.09.39.18.59.27.26.12.52.23.79.34.2.08.4.16.6.24.27.1.54.2.82.3.2.07.39.14.59.2.29.09.58.18.86.26.19.05.38.11.57.16.32.08.65.16.97.23.16.04.32.08.49.11.49.1.98.19,1.48.26.06.01.87.15,2.15.24,1.18.09,2.78.15,4.59.04l.27-.02c.57-.04,1.12-.09,1.66-.15.19-.02.38-.05.57-.08.35-.05.7-.09,1.03-.15.22-.04.43-.08.64-.13.3-.06.6-.12.9-.19.22-.05.43-.11.64-.17.2-.05.4-.1.59-.15,3.24,5.73,8.56,12.91,16.18,16.37-2.16.61-5.97,1.67-7.9,2.21h0s-.22.06-.22.06c-2.95.82-6.35,1.77-9.86,2.75l-2.61.73c-.58-.75-1.16-1.53-1.73-2.33ZM149.36,152.86c-1.38,3.36-4.14,5.88-8.2,7.5-1.52.61-3.24.84-4.95.67-4.39-.45-8.96-3.66-13.93-9.81l2.14-.59c1.49-.41,2.96-.82,4.38-1.22,1.85-.51,3.62-1.01,5.26-1.47,5.42,2.68,10.7.93,15.69-5.2.5,1.85,1.28,6.05-.39,10.12Z"
				/>
				<path  fill={fill}
					d="M98.68,32.93c-.78-.39-1.59-.73-2.4-1.02l-.44-.16-20.26,32.61.48.31c.73.46,1.49.88,2.27,1.25l.47.22,20.45-32.92-.57-.28Z"
				/>
				<path  fill={fill}
					d="M109.52,49.33c0-5.97-3.25-11.64-8.69-15.18l-.5-.32-20.37,32.79.69.24c2.45.84,5.03,1.27,7.66,1.27,11.7,0,21.21-8.43,21.21-18.79Z"
				/>
				<path  fill={fill}
					d="M88.31,31.12c-10.82,0-19.7,7.36-20.56,16.72-2.97-.52-6.13.02-8.78,1.46-.79-3.17-2.45-5.9-4.66-7.8l-12.05,25.78c1.42.64,2.96,1,4.58,1,6.98,0,12.63-6.64,12.63-14.83,0-.57-.03-1.14-.08-1.7.1-.07.2-.13.3-.19,1.04-.62,1.7-.89,2.87-1.21.27-.08.55-.14.83-.19.14-.03.28-.06.42-.08.06-.01.11-.01.16-.02.02,0,.03,0,.06,0,.53-.06,1.07-.1,1.6-.09.28,0,.57.02.85.04.14.01.28.03.42.04h0s.03,0,.04,0c.06.01.12.02.17.03.19.03.38.06.57.11.26,4.99,2.79,9.45,6.7,12.6l19.29-31.04c-1.71-.41-3.52-.63-5.38-.63Z"
				/>
				<path  fill={fill}
					d="M51.6,39.72l-12.07,25.83c.43.36.88.69,1.35.99l12.15-26c-.46-.31-.93-.58-1.43-.81Z"
				/>
				<path  fill={fill}
					d="M46.84,38.63c-6.98,0-12.63,6.64-12.63,14.83,0,4.34,1.59,8.24,4.11,10.95l11.81-25.27c-1.05-.33-2.15-.51-3.29-.51Z"
				/>
			</g>
		</svg>
	);
};
