"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardBody, Skeleton, Button, Input } from "@nextui-org/react";
import { toast } from "react-toastify";
import { getWorkflows, runWorkflow, getJobStatus } from "@/services/api";
import { ScrollShadow } from "@nextui-org/scroll-shadow"; // Correct import from NextUI

const WorkflowPage = () => {
	const [workflows, setWorkflows] = useState<any[]>([]);
	const [selectedWorkflow, setSelectedWorkflow] = useState<number | null>(null);
	const [inputFields, setInputFields] = useState<any>({});
	const [inputValues, setInputValues] = useState<any>({});
	const [jobStatus, setJobStatus] = useState<any>(null);
	const [polling, setPolling] = useState<boolean>(false);
	const [resultImages, setResultImages] = useState<string[]>([]); // For storing multiple image URLs

	// Fetch workflows on page load
	const fetchWorkflows = useCallback(async () => {
		try {
			const workflows = await getWorkflows();
			setWorkflows(workflows);
			console.log(workflows);
		} catch (error) {
			toast.error("Failed to fetch workflows.");
		}
	}, []);

	useEffect(() => {
		fetchWorkflows();
	}, [fetchWorkflows]);

	// Handle workflow selection
	const handleSelectWorkflow = (workflowId: number, inputs: any) => {
		setSelectedWorkflow(workflowId);
		setInputFields(inputs);
		setInputValues({});
	};

	// Handle input changes (for both text and file inputs)
	const handleInputChange = (nodeId: string, inputName: string, value: any, isFile = false) => {
		const updatedValues = { ...inputValues };
		if (isFile) {
			const reader = new FileReader();
			reader.onloadend = () => {
				updatedValues[nodeId] = { ...updatedValues[nodeId], [inputName]: reader.result };
				setInputValues(updatedValues);
			};
			reader.readAsDataURL(value);
		} else {
			updatedValues[nodeId] = { ...updatedValues[nodeId], [inputName]: value };
			setInputValues(updatedValues);
		}
	};

	// Submit the workflow
	const handleSubmit = async () => {
		if (!selectedWorkflow) return;

		try {
			console.log(inputValues)
			const response = await runWorkflow(selectedWorkflow, inputValues);
			console.log(response);
			const jobId = response.job_id;
			toast.success("Workflow submitted successfully!");

			// Start polling for job status
			setPolling(true);
			const intervalId = setInterval(async () => {
				const jobData = await getJobStatus(jobId);
				console.log(jobData);
				setJobStatus(jobData);

				// If the job is complete and has a result (which is a list of image URLs)
				if (jobData.status == "completed" || jobData.status == "failed") {
					clearInterval(intervalId);
					setPolling(false);

					// Check if the result contains image URLs and set them
					if (jobData.result_data&&jobData.result_data.image_urls && jobData.result_data.image_urls.length > 0) {
						setResultImages(jobData.result_data.image_urls); // Set the result as an array of image URLs
					}
				}
			}, 5000); // Poll every 5 seconds
		} catch (error) {
			toast.error("Failed to submit workflow.");
		}
	};

	return (
		<div className="container mx-auto p-4 w-screen">
			<h2 className="text-2xl font-semibold mb-4">Workflows</h2>
			{workflows.length === 0 ? (
				<Skeleton className="h-48 w-full mb-4" />
			) : (
				<Card>
					<CardBody>
						<select
							onChange={(e) => {
								const selected = workflows.find(
									(workflow) => workflow.id === parseInt(e.target.value)
								);
								handleSelectWorkflow(selected.id, selected.inputs);
							}}
						>
							<option value="">Select a workflow</option>
							{workflows.map((workflow) => (
								<option key={workflow.id} value={workflow.id}>
									{workflow.name}
								</option>
							))}
						</select>
					</CardBody>
				</Card>
			)}

			{selectedWorkflow && (
				<div className="mt-4">
					<h3 className="text-xl font-semibold mb-4">Workflow Inputs</h3>
					{Object.keys(inputFields).map((nodeId) => (
						<div key={nodeId}>
							<h4 className="font-semibold mb-2">Node {nodeId}</h4>
							{Object.entries(inputFields[nodeId]).map(([inputName, inputType]) => (
								<div className="mb-4" key={inputName}>
									<label>{inputName}</label>
									{inputType.startsWith("image") ? (
										<input
											type="file"
											onChange={(e) =>
												handleInputChange(
													nodeId,
													inputName,
													e.target.files ? e.target.files[0] : null,
													true
												)
											}
											className="border p-2 rounded"
										/>
									) : (
										<Input
										value={inputValues[nodeId]?.[inputName] || ""} // Ensure the input value is set from inputValues state
										onChange={(e) =>
										  handleInputChange(nodeId, inputName, e.target.value)
										}
									  />
									)}
								</div>
							))}
						</div>
					))}

					<Button onClick={handleSubmit}>Submit Workflow</Button>
				</div>
			)}

			{jobStatus && (
				<div className="mt-4">
					<h3 className="text-xl font-semibold">Job Status</h3>
					<p>Status: {jobStatus.status}</p>
					<p>Runtime: {jobStatus.runtime}</p>
					<div className="max-h-40 overflow-y-scroll border p-2 rounded">
						<ScrollShadow>
							<div className="text-sm">
								<p>Logs:</p>
								<pre>{jobStatus.logs}</pre>
							</div>
						</ScrollShadow>
					</div>
				</div>
			)}

			{resultImages.length > 0 && (
				<div className="mt-4">
					<h3 className="text-xl font-semibold">Result Images</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{resultImages.map((url, index) => (
							<img key={index} src={url} alt={`Result ${index + 1}`} className="border p-2 rounded" />
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default WorkflowPage;
	