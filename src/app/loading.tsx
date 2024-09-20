// loading.tsx

import { Spinner } from "@nextui-org/react";

const Loading = () => {
	return (
		<div className="flex items-center justify-center h-screen w-screen">
			<Spinner size="lg" />
		</div>
	);
};

export default Loading;
