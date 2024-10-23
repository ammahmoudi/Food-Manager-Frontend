"use client";

import { useSearchParams } from "next/navigation"; // To get query parameters
import { useState, useEffect } from "react";
import { Button, Card, CardBody, Link } from "@nextui-org/react";

import { toast } from "sonner";
import LoraForm from "../../components/LoraForm";

const NewLoraPage = () => {
	const searchParams = useSearchParams()
	const datasetId = searchParams.get('datasetId')

	const [validDatasetId, setValidDatasetId] = useState<number | null>(null);

	// Check if the datasetId is valid on page load
	useEffect(() => {
		if (datasetId) {
			const parsedId = parseInt(datasetId as string);
			if (!isNaN(parsedId)) {
				setValidDatasetId(parsedId);
			} else {
				toast.error("Invalid dataset ID.");
			}
		}
	}, [datasetId]);

	// Handle saving the LoRA request
	const handleLoraSave = () => {
		toast.success("LoRA request saved successfully!");
		// Optionally, redirect or take further actions here
	};

	return (
		<div className="container mx-auto py-4">
			<Card>
				<CardBody>
					<h1 className="text-2xl font-bold mb-4">Create a New LoRA Request</h1>

					{/* Render the form only if the datasetId is valid */}
					{true ? (
						<LoraForm datasetId={validDatasetId} onSave={handleLoraSave} />
					) : (
						<p>Invalid or missing dataset ID. Please return to the previous page.</p>
					)}
				</CardBody>
			</Card>

			{/* Back Button */}
			<div className="mt-4">
				<Button as={Link}
				href={`/ai/datasets/${datasetId}/`}>
					Back
				</Button>
			</div>
		</div>
	);
};

export default NewLoraPage;