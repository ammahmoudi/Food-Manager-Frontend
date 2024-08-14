function debounce(func: (...args: any[]) => void, timeout = 300) {
	let timer: NodeJS.Timeout;
	return (...args: any[]) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func(...args);
		}, timeout);
	};
}
export default debounce;