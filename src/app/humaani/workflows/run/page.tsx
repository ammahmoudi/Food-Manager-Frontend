'use client';
import { Button, Card, CardBody, Input, ScrollShadow, Select, SelectItem, Skeleton, Image } from "@nextui-org/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Job } from "../../interfaces/Job";
import { Workflow } from "../../interfaces/Workflow";
import { getWorkflows, getJob, runWorkflow } from "../../services/aiApi";
import { renderLogEntry } from "../../utils/RenderLogEntry";

// Define the type for resultData
interface ResultData {
  [nodeId: string]: {
    [inputName: string]: {
      type: string;
      value: string;
    };
  };
}

const WorkflowPage = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, Record<string, string | ArrayBuffer | null>>>({});
  const [job, setJob] = useState<Job | null>(null);
  const [polling, setPolling] = useState<boolean>(false);
  const [resultData, setResultData] = useState<ResultData | null>(null); // Store full result data with nodeId and inputName
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
    } catch (error) {
      console.error('Failed to fetch workflows.', error);
      toast.error("Failed to fetch workflows.");
    }
  }, []);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const handleWorkflowSelectChange = (keys: Iterable<React.Key>) => {
    const temp_id = String(Array.from(keys)[0]);
    const tempSelected: Workflow | undefined = workflows.find(
      (workflow) => String(workflow.id) === temp_id
    );

    if (tempSelected) {
      setSelectedWorkflow(tempSelected);
      setInputValues({});
    } else {
      setSelectedWorkflow(null);
    }
  };

  const handleInputChange = (
    nodeId: string,
    inputName: string,
    value: string | File | null,
    isFile = false
  ) => {
    const updatedValues = { ...inputValues };

    if (isFile && value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedValues[nodeId] = {
          ...updatedValues[nodeId],
          [inputName]: reader.result as string | ArrayBuffer,
        };
        setInputValues(updatedValues);
      };
      reader.readAsDataURL(value);
    } else if (typeof value === "string") {
      updatedValues[nodeId] = { ...updatedValues[nodeId], [inputName]: value };
      setInputValues(updatedValues);
    }
  };

  const pollJobStatus = async (jobId: number) => {
    setPolling(true);  // Start polling
    let pollingActive = true;

    const fetchJobStatus = async () => {
      try {
        const jobData = await getJob(jobId);
        setJob(jobData);

        // If the job is complete or has failed, stop polling
        if (jobData.status === "completed" || jobData.status === "failed") {
          pollingActive = false;
          setPolling(false);  // Stop polling

          // Extract result_data to show nodeId and inputName details
          if (jobData.result_data) {
            setResultData(jobData.result_data); // Store the complete result_data for rendering
          }
        }
      } catch (error) {
        console.error('Failed to fetch job status.', error);
        toast.error(`Failed to fetch job status for job ${jobId}.`);
        pollingActive = false; // Stop polling on error
        setPolling(false);  // Stop polling
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
      const response = await runWorkflow(selectedWorkflow.id, inputValues);
      const jobId = response.job_id;
      toast.success("Workflow submitted successfully!");
      await pollJobStatus(jobId);
    } catch (error) {
      console.error('Failed to submit workflow.', error);
      toast.error("Failed to submit workflow.");
    }
  };

  // Function to render result images and texts with their nodeId and inputName
  const renderResults = () => {
    if (!resultData) return null;

    return Object.keys(resultData).map((nodeId) => {
      const nodeOutputs = resultData[nodeId];

      return (
        <div key={nodeId} className="mb-4">
          <h4 className="text-lg font-semibold">Node ID: {nodeId}</h4>
          {Object.keys(nodeOutputs).map((inputName) => {
            const output = nodeOutputs[inputName];

            return (
              <div key={inputName} className="mb-2">
                <p>
                  <strong>Input Name:</strong> {inputName}
                </p>
                {output.type === 'image' ? (
                  <Image src={output.value} alt={`Result from ${inputName}`} className="border p-2 rounded mb-2" />
                ) : (
                  <p className="border p-2 rounded bg-gray-100">
                    <strong>Text Output:</strong> {output.value}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      );
    });
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
              selectedKeys={selectedWorkflow ? new Set([String(selectedWorkflow.id)]) : new Set()}
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
                        value={typeof inputValues[nodeId]?.[inputName] === "string" ? inputValues[nodeId]?.[inputName] : ""}
                        onChange={(e) => handleInputChange(nodeId, inputName, e.target.value, false)}
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
          <div className="h-96 overflow-y-scroll border p-2 rounded" ref={logContainerRef}>
            <ScrollShadow>
              <div className="text-sm">
                <p>Logs:</p>
                {job?.logs ? job.logs.split("\n").map((logEntry, index) => <div key={index}>{renderLogEntry(logEntry)}</div>) : "No logs available"}
              </div>
            </ScrollShadow>
          </div>
        </div>
      )}

      {resultData && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Results</h3>
          {renderResults()} {/* Call renderResults to show detailed outputs */}
        </div>
      )}
    </div>
  );
};

export default WorkflowPage;
