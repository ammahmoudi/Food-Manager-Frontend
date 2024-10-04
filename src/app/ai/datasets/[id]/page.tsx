"use client";
import { useEffect, useState } from "react";
import { Button, Spinner,Image } from "@nextui-org/react";
import { useParams } from "next/navigation";
import { getDataset, getJob } from "../../services/aiApi";
import React from "react";
import { toast } from "sonner";
import { Job } from "../../interfaces/Job";

const ResultPage = () => {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [polling, setPolling] = useState<boolean>(true);

	const { id: datasetId } = useParams(); // Get the dynamic dataset_id from the URL

	// Fetch dataset and start polling jobs
	const fetchDatasetAndJobs = async () => {
		if (!datasetId) return;

		try {
			setLoading(true);
			const dataset = await getDataset(datasetId as unknown as number);
			const jobIds = dataset.jobs || [];

			// Initialize jobs with empty status and image_urls
			const initialJobs = jobIds.map((jobId: string) => ({
				id: jobId,
				status: "pending", // Initial status
				image_urls: [], // Empty array for images
			}));
			setJobs(initialJobs);

			// Start polling job statuses
			const intervalId = setInterval(async () => {
				const updatedJobs = await Promise.all(
					initialJobs.map(async (job: Job) => {
						const jobData = await getJob(job.id);
						return jobData
					})
				);

				setJobs(updatedJobs);

				// Stop polling if all jobs are either completed or failed
				if (
					updatedJobs.every(
						(job) => job.status === "completed" || job.status === "failed"
					)
				) {
					clearInterval(intervalId);
					setPolling(false);
				}
			}, 5000); // Poll every 5 seconds
		} catch (error) {
			console.error("Error fetching dataset or job statuses:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDatasetAndJobs();
	}, [datasetId]);

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-2xl font-semibold mb-4">Dataset Images</h2>
			{loading ? (
				<Spinner color="primary" size="lg" />
			) : (
				<>
					<div className="flex flex-wrap gap-4">
						{jobs.map((job) => (
							<div key={job.id} className="flex flex-col items-center">
								{/* If the job is completed, show the images */}
								{job.status === "completed" ? (
									job.result_data.image_urls.map((imageURL, index) => (
										<Image
											key={index}
											src={imageURL}
											alt={`Job ${job.id} Image ${index + 1}`}
											className="w-40 h-40 object-cover border rounded-md"
										/>
									))
								) : (
									<div className="w-40 h-40 flex justify-center items-center border rounded-md bg-gray-200">
										<Spinner color="primary" />
									</div>
								)}
								<p className="mt-2 text-sm">Job ID: {job.id}</p>
								<p className="text-sm">Job Status: {job.status}</p>
							</div>
						))}
					</div>

					{/* Request for Lora Button */}
					<div className="mt-6">
						<Button
							color="primary"
							className="w-full"
							isDisabled={polling} // Disable if polling is still active
							onClick={() => toast.success("Lora requested!")}
						>
							Request for Lora
						</Button>
					</div>
				</>
			)}
		</div>
	);
};

export default ResultPage;
