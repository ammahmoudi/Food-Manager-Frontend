"use client";

import { useCallback, useEffect, useState } from "react";
import {
	Card,
	CardBody,
	Skeleton,
	Button,
	Input,
	Select,
	SelectItem,
  Image
} from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/scroll-shadow"; // Correct import from NextUI
import { getWorkflows, runWorkflow, getJob } from "../../services/aiApi";
import { Workflow } from "../../interfaces/Workflow";
import { Job } from "../../interfaces/Job";
import { toast } from "sonner";

const WorkflowPage = () => {
	const [workflows, setWorkflows] = useState<Workflow[]>([]);
	const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
		null
	);
	const [inputValues, setInputValues] = useState<
		Record<string, Record<string, string | ArrayBuffer | null>>
	>({});
	const [job, setJob] = useState<Job | null>(null);
	const [polling, setPolling] = useState<boolean>(false);
	const [resultImages, setResultImages] = useState<string[]>([]); // For storing multiple image URLs

	// Fetch workflows on page load
	const fetchWorkflows = useCallback(async () => {
		try {
			const workflows = await getWorkflows();
			setWorkflows(workflows);
			console.log(workflows);
		} catch (error) {
			console.error("Failed to fetch workflows:", error);
			toast.error("Failed to fetch workflows.");
		}
	}, []);

	useEffect(() => {
		fetchWorkflows();
	}, [fetchWorkflows]);

	// Handle workflow selection
	const handleWorkflowSelectChange = (keys: Iterable<React.Key>) => {
		// Convert keys to string to ensure type consistency
		const temp_id = String(Array.from(keys)[0]);

		// Convert workflow.id to string for comparison
		const tempSelected: Workflow | undefined = workflows.find(
			(workflow) => String(workflow.id) === temp_id
		);

		if (tempSelected) {
			setSelectedWorkflow(tempSelected);
			//   setInputFields(tempSelected.inputs);
			setInputValues({});
		} else {
			console.warn(
				`Selected workflow with id ${temp_id} not found in the collection.`
			);
			setSelectedWorkflow(null); // Reset selection if key is not found
		}
	};

	// Handle input changes (for both text and file inputs)
	const handleInputChange = (
		nodeId: string,
		inputName: string,
		value: any,
		isFile = false
	) => {
		const updatedValues = { ...inputValues };
		if (isFile) {
			const reader = new FileReader();
			reader.onloadend = () => {
				updatedValues[nodeId] = {
					...updatedValues[nodeId],
					[inputName]: reader.result as string | ArrayBuffer,
				};
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
			console.log(inputValues);
			const response = await runWorkflow(selectedWorkflow.id, inputValues);
			console.log(response);
			const jobId = response.job_id;
			toast.success("Workflow submitted successfully!");

			// Start polling for job status
			setPolling(true);
			const intervalId = setInterval(async () => {
				const jobData = await getJob(jobId);
				console.log(jobData);
				setJob(jobData);

				// If the job is complete and has a result (which is a list of image URLs)
				if (jobData.status === "completed" || jobData.status === "failed") {
					clearInterval(intervalId);
					setPolling(false);

					// Check if the result contains image URLs and set them
					if (jobData.result_data?.image_urls?.length > 0) {
						setResultImages(jobData.result_data.image_urls); // Set the result as an array of image URLs
					}
				}
			}, 5000); // Poll every 5 seconds
		} catch (error) {
      console.error("Failed to submit workflow:", error);
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
						<Select<Workflow>
							items={workflows}
							label="Workflow"
							variant="bordered"
							placeholder="Select a workflow"
							onSelectionChange={handleWorkflowSelectChange}
							selectedKeys={
								selectedWorkflow
									? new Set([String(selectedWorkflow.id)])
									: new Set()
							} // Ensure selectedKeys is a Set of strings
						>
							{(workflow) => (
								<SelectItem key={workflow.id} textValue={workflow.name}>
									<div className="flex gap-2 items-center">{workflow.name}</div>
								</SelectItem>
							)}
						</Select>
					</CardBody>
				</Card>
			)}

			{selectedWorkflow && (
				<div className="mt-4">
					<h3 className="text-xl font-semibold mb-4">Workflow Inputs</h3>
					{Object.keys(selectedWorkflow.inputs).map((nodeId) => (
						<div key={nodeId}>
							<h4 className="font-semibold mb-2">Node {nodeId}</h4>
							{Object.entries(selectedWorkflow.inputs[nodeId]).map(
								([inputName, inputType]) => (
									<div className="mb-4" key={inputName}>
										<label>{inputName}</label>
										{inputType.startsWith("image") ? (
											<input
                        placeholder="Upload Image"
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
                      placeholder="Enter value"
												value={typeof inputValues[nodeId]?.[inputName] === "string" ? inputValues[nodeId]?.[inputName] : ""}
												onChange={(e) =>
													handleInputChange(nodeId, inputName, e.target.value)
												}
											/>
										)}
									</div>
								)
							)}
						</div>
					))}

					<Button onClick={handleSubmit} isLoading={polling}>Submit Workflow</Button>
				</div>
			)}

			{job && (
				<div className="mt-4">
					<h3 className="text-xl font-semibold">Job Status</h3>
					<p>Status: {job.status}</p>
					<p>Runtime: {job.runtime}</p>
					<div className="max-h-40 overflow-y-scroll border p-2 rounded">
						<ScrollShadow>
							<div className="text-sm">
								<p>Logs:</p>
								<pre>{job.logs}</pre>
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
							<Image
								key={index}
								src={url}
								alt={`Result ${index + 1}`}
								className="border p-2 rounded"
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default WorkflowPage;
