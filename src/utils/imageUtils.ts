// utils/imageUtils.ts
import { CropperRef } from "react-advanced-cropper";

export const getCroppedImageBlob = async (
	cropper: CropperRef
): Promise<File | null> => {
	const canvas = cropper.getCanvas();
	return new Promise((resolve) => {
		if (!canvas) {
			resolve(null);
			return;
		}
		canvas.toBlob((blob) => {
			if (blob) {
				const file = new File([blob], "cropped-image.jpg", {
					type: "image/jpeg",
				});
				resolve(file);
			} else {
				resolve(null);
			}
		}, "image/jpeg");
	});
};

export const compressImage = async (file: File, maxSizeMB = 1, quality = 0.8): Promise<File | null> => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to Bytes

    // Ensure that the file is an image
    if (!file.type.startsWith("image/")) {
        console.error("File is not an image.");
        return null;
    }

    // Create a promise-based utility to read the image as a data URL
    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Load the image from the file and draw it on a canvas
    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    };

    // Resize and compress the image
    const resizeImage = (img: HTMLImageElement, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        const MAX_WIDTH = 1000; // Define a max width for resizing

        const width = img.width;
        const height = img.height;
        let newWidth = width;
        let newHeight = height;

        // Resize the image proportionally
        if (width > MAX_WIDTH) {
            newWidth = MAX_WIDTH;
            newHeight = (height * MAX_WIDTH) / width;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
    };

    try {
        // Convert the image file to a DataURL
        const imageDataURL = await readFileAsDataURL(file);

        // Create an image element from the data URL
        const img = await loadImage(imageDataURL);

        // Create a canvas to draw the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Canvas context not available.");
        }

        // Resize and draw the image on the canvas
        resizeImage(img, canvas, ctx);

        // Convert the canvas back to a Blob (compressed image)
        return new Promise<File | null>((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob && blob.size <= maxSizeBytes) {
                        const compressedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    } else {
                        console.error("Failed to compress image to below the desired size.");
                        resolve(null);
                    }
                },
                file.type,
                quality // Adjust quality here (0.8 means 80% quality)
            );
        });
    } catch (error) {
        console.error("Error compressing image:", error);
        return null;
    }
};
