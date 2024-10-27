export interface User {
	id: number;
	full_name: string;
	phone_number?: string;
	user_image: string | File;
	role?: string;
}
