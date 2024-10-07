"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
	Card,
	CardBody,
	Skeleton,
	Button,
	Input,
	Image,
	SelectItem,
	Select,
} from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/scroll-shadow"; // Correct import from NextUI
import { getWorkflows, runWorkflow, getJob } from "../../services/aiApi";
import { Workflow } from "../../interfaces/Workflow";
import { Job } from "../../interfaces/Job";
import { toast } from "sonner";

// Utility function to render a single log entry
// Utility function to render a single log entry with support for different JSON structures
const renderLogEntry = (logEntry: string) => {
    let parsedLog;
    try {
        parsedLog = JSON.parse(logEntry); // Try parsing the log as JSON
    } catch (error) {
        return (
            <pre className="text-red-500">
                Invalid JSON or Raw Log: {logEntry}
            </pre>
        ); // In case of parsing error, render the raw log
    }

    // Recursive function to render any type of JSON structure
    const renderDataRecursively = (data: any, keyPrefix = '') => {
        if (typeof data === 'object' && data !== null) {
            return Object.keys(data).map((key) => {
                const value = data[key];
                const prefixedKey = keyPrefix ? `${keyPrefix}.${key}` : key;

                if (typeof value === 'object' && value !== null) {
                    // If value is another object or array, recurse
                    return (
                        <div key={prefixedKey}>
                            <strong>{prefixedKey}:</strong>
                            <div className="ml-4">{renderDataRecursively(value, prefixedKey)}</div>
                        </div>
                    );
                }

                // Otherwise, render key-value pair
                return (
                    <div key={prefixedKey}>
                        <strong>{prefixedKey}:</strong> {String(value)}
                    </div>
                );
            });
        }

        // If it's not an object or array, just render the value
        return <span>{String(data)}</span>;
    };

    // Top-level container for the log entry
    return (
        <div className="p-2 mb-2 bg-gray-50 border border-gray-200 rounded-md">
            {renderDataRecursively(parsedLog)}
        </div>
    );
};

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
    // Create a ref for the logs container to scroll it automatically
	const logContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [job?.logs]);
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

// Reusable polling function
const pollJobStatus = async (jobId: number, setJob: (job: Job) => void, setResultImages: (images: string[]) => void) => {
    let pollingActive = true; // Track polling state

    // Define the polling function
    const fetchJobStatus = async () => {
        try {
            const jobData = await getJob(jobId);
            console.log(jobData);
            setJob(jobData);

            // If the job is complete or has failed
            if (jobData.status === "completed" || jobData.status === "failed") {
                pollingActive = false; // Stop polling

                // Check if the result contains image URLs and set them
                if (jobData.result_data?.image_urls?.length > 0) {
                    setResultImages(jobData.result_data.image_urls); // Set the result as an array of image URLs
                }
            }
        } catch (error) {
            console.error(`Error fetching job status for job ${jobId}:`, error);
            toast.error(`Failed to fetch job status for job ${jobId}.`);
            pollingActive = false; // Stop polling on error
        }
    };

    // Call the polling function immediately for the first time
    await fetchJobStatus();

    // Set up the interval for subsequent polling
    const intervalId = setInterval(async () => {
        if (pollingActive) {
            await fetchJobStatus();
        } else {
            clearInterval(intervalId); // Stop polling when the job is done
        }
    }, 5000); // Poll every 5 seconds
};

const handleSubmit = async () => {
	if (!selectedWorkflow) return;

	try {
		console.log(inputValues);
		const response = await runWorkflow(selectedWorkflow.id, inputValues);
		console.log(response);
		const jobId = response.job_id;
		toast.success("Workflow submitted successfully!");

		// Start polling for job status using the reusable function
		await pollJobStatus(jobId, setJob, setResultImages);

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
					{Object.keys(selectedWorkflow.inputs).map((nodeId) => {
						const node = selectedWorkflow.inputs[nodeId];
						return (
							<div key={nodeId}>
								<h4 className="font-semibold mb-2">
									Node {nodeId}: {node.name}
								</h4>
								{Object.entries(node.inputs).map(([inputName, inputType]) => (
									<div className="mb-4" key={inputName}>
										<span>{inputName}</span>
										{inputType.startsWith("image") ? (
											<Input
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
												className="py-2"
											/>
										) : (
											<Input
												placeholder="Enter value"
												value={
													typeof inputValues[nodeId]?.[inputName] === "string"
														? inputValues[nodeId]?.[inputName]
														: ""
												}
												onChange={(e) =>
													handleInputChange(nodeId, inputName, e.target.value)
												}
											/>
										)}
									</div>
								))}
							</div>
						);
					})}

					<Button onClick={handleSubmit} isLoading={polling}>
						Submit Workflow
					</Button>
				</div>
			)}

{job && (
                <div className="mt-4">
                    <h3 className="text-xl font-semibold">Job Status</h3>
                    <p>Status: {job.status}</p>
                    <p>Runtime: {job.runtime}</p>
                    <div
                        className="h-96 overflow-y-scroll border p-2 rounded"
                        ref={logContainerRef}
                    >
                        <ScrollShadow>
                            <div className="text-sm">
                                <p>Logs:</p>
                                {job?.logs
                                    ? job.logs.split("\n").map((logEntry, index) => (
                                          <div key={index}>{renderLogEntry(logEntry)}</div>
                                      ))
                                    : "No logs available"}
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
