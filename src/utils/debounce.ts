function debounce(func: (...args: string[]) => void, timeout = 300) {
	let timer: NodeJS.Timeout;
	return (...args: string[]) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func(...args);
		}, timeout);
	};
}
export default debounce;