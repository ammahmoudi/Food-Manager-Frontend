"use client";

import { useCallback, useState } from "react";
import { Card, CardBody, Button, Input, Textarea } from "@nextui-org/react";
import { fetchNodesFromJson, submitWorkflowInputs } from "../../services/aiApi";
import { toast } from "sonner";
import { WorkflowNode } from "../../interfaces/WorkflowNode";

interface InputType {
  type: string;
}

interface OutputType {
  type: string;
}

interface InputsState {
  [nodeId: string]: {
    [inputName: string]: InputType;
  };
}

interface OutputsState {
  [nodeId: string]: {
    [outputName: string]: OutputType;
  };
}

interface ConstructedInputs {
  [nodeId: string]: {
    [inputName: string]: string;
  };
}

interface ConstructedOutputs {
  [nodeId: string]: {
    [outputName: string]: string;
  };
}

interface RequestBody {
  name: string;
  json_data: Record<string, unknown>;
  inputs: ConstructedInputs;
  outputs: ConstructedOutputs;
}

const WorkflowPage = () => {
  const [workflowName, setWorkflowName] = useState<string>(""); // Ensure name is populated
  const [jsonText, setJsonText] = useState<string>("");
  const [selectedNodes, setSelectedNodes] = useState<WorkflowNode[]>([]);
  const [inputs, setInputs] = useState<InputsState>({}); // Correct typing for inputs
  const [outputs, setOutputs] = useState<OutputsState>({}); // Correct typing for outputs
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [availableNodes, setAvailableNodes] = useState<WorkflowNode[]>([]);
  const [availableInputs, setAvailableInputs] = useState<string[]>([]);
  const [selectedInput, setSelectedInput] = useState<string | null>(null);
  const [outputName, setOutputName] = useState<string>(""); // Stores the name of the output
  const [outputType, setOutputType] = useState<string>(""); // Stores the type of the output
  const [showSelect, setShowSelect] = useState<boolean>(true); // Show dropdown initially

  // Fetch nodes after submitting the JSON
  const fetchNodes = useCallback(async () => {
    try {
      const fetchedNodes = await fetchNodesFromJson(jsonText);
      setAvailableNodes(fetchedNodes); // Initialize available nodes
      toast.success("Nodes fetched successfully!");
    } catch (error) {
      console.error("Failed to fetch nodes:", error);
      toast.error("Failed to fetch nodes.");
    }
  }, [jsonText]);

  // Handle JSON submission and fetch nodes
  const handleSubmitJson = () => {
    try {
      JSON.parse(jsonText); // Validate JSON format
      toast.success("Valid JSON!");
      fetchNodes(); // Fetch nodes after validating the JSON
      setShowSelect(true); // Show the node selection after JSON validation
    } catch (error) {
      console.error("Invalid JSON format:", error);
      toast.error("Invalid JSON format!");
    }
  };

  // Handle file upload and replace JSON text content
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        try {
          JSON.parse(fileContent);
          setJsonText(fileContent); // Set JSON text content
          toast.success("File content loaded successfully!");
        } catch (error) {
          console.error("Invalid JSON file:", error);
          toast.error("Invalid JSON file!");
        }
      };
      reader.readAsText(file); // Read the file content
    }
  };

  // Handle node selection and add the selected node to the list
  const handleSelectNode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nodeId = e.target.value;
    const selectedNode = availableNodes.find((node) => node.id === nodeId);
    if (selectedNode) {
      // Append the new node to the selectedNodes array
      setSelectedNodes((prevNodes) => [
        ...prevNodes,
        {
          id: nodeId,
          name: selectedNode.name,
          type: selectedNode.type,
          inputs: [],
          outputs: [],
        },
      ]);

      // Set available inputs for the selected node
      setAvailableInputs(selectedNode.inputs);

      setSelectedNodeId(nodeId); // Store selected node ID
      setSelectedInput(null); // Reset selected input
    }
  };

  // Handle input selection
  const handleSelectInput = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedInput(e.target.value); // Set selected input from dropdown
  };

  // Handle adding the input to the selected node
  const handleAddInput = () => {
    if (!selectedInput || !selectedNodeId) return;

    // Add the selected input to the node's inputs
    setSelectedNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === selectedNodeId) {
          return {
            ...node,
            inputs: [...node.inputs, selectedInput], // Append the selected input
          };
        }
        return node;
      })
    );

    // Initialize input field for the added input
    setInputs((prevInputs) => ({
      ...prevInputs,
      [selectedNodeId]: {
        ...prevInputs[selectedNodeId],
        [selectedInput]: { type: "string" }, // Default type
      },
    }));

    // Remove the selected input from the available inputs list
    setAvailableInputs((prevInputs) =>
      prevInputs.filter((input) => input !== selectedInput)
    );

    // Reset the selected input
    setSelectedInput(null);
  };

  // Handle adding the output to the selected node
  const handleAddOutput = () => {
    if (!outputName || !outputType || !selectedNodeId) return;

    // Add the selected output to the node's outputs
    setSelectedNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === selectedNodeId) {
          return {
            ...node,
            outputs: [...node.outputs, outputName], // Append the output name
          };
        }
        return node;
      })
    );

    // Initialize output field for the added output
    setOutputs((prevOutputs) => ({
      ...prevOutputs,
      [selectedNodeId]: {
        ...prevOutputs[selectedNodeId],
        [outputName]: { type: outputType }, // Store output name and type
      },
    }));

    // Reset the output name and type fields
    setOutputName("");
    setOutputType("");
  };

  // Handle input type changes for each node
  const handleInputChange = (
    nodeId: string,
    inputName: string,
    value: string
  ) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [nodeId]: {
        ...prevInputs[nodeId],
        [inputName]: {
          type: value, // Update type dynamically
        },
      },
    }));
  };

  // Handle output type changes for each node
  const handleOutputChange = (
    nodeId: string,
    outputName: string,
    value: string
  ) => {
    setOutputs((prevOutputs) => ({
      ...prevOutputs,
      [nodeId]: {
        ...prevOutputs[nodeId],
        [outputName]: {
          type: value, // Update type dynamically
        },
      },
    }));
  };

  const handleFinalSubmit = async () => {
    try {
      if (!workflowName) {
        toast.error("Workflow name is required.");
        return;
      }

      if (selectedNodes.length === 0) {
        toast.error("You must select at least one node.");
        return;
      }

      // Use the raw JSON text directly
      let json_data: Record<string, unknown>;
      try {
        json_data = JSON.parse(jsonText); // Parse the jsonText to ensure it's valid JSON
      } catch (error) {
        toast.error("Invalid JSON format.");
        console.error("Invalid JSON format.", error);
        return;
      }

      // Construct the inputs object to match the required format
      const constructedInputs: ConstructedInputs = Object.keys(inputs).reduce(
        (acc: ConstructedInputs, nodeId: string) => {
          acc[nodeId] = Object.keys(inputs[nodeId]).reduce(
            (innerAcc: { [inputName: string]: string }, inputName: string) => {
              innerAcc[inputName] = inputs[nodeId][inputName].type; // Only take the type field
              return innerAcc;
            },
            {} as { [inputName: string]: string }
          );
          return acc;
        },
        {} as ConstructedInputs
      );

      // Construct the outputs object to match the required format
      const constructedOutputs: ConstructedOutputs = Object.keys(outputs).reduce(
        (acc: ConstructedOutputs, nodeId: string) => {
          acc[nodeId] = Object.keys(outputs[nodeId]).reduce(
            (innerAcc: { [outputName: string]: string }, outputName: string) => {
              innerAcc[outputName] = outputs[nodeId][outputName].type; // Only take the type field
              return innerAcc;
            },
            {} as { [outputName: string]: string }
          );
          return acc;
        },
        {} as ConstructedOutputs
      );

      // Prepare the final request body
      const requestBody: RequestBody = {
        name: workflowName,
        json_data: json_data,
        inputs: constructedInputs,
        outputs: constructedOutputs,
      };

      console.log(
        "Submitting the following request body:",
        JSON.stringify(requestBody, null, 2)
      );

      // Send the formatted inputs and outputs to the backend
      await submitWorkflowInputs(requestBody);
      toast.success("Workflow submitted successfully!");
    } catch (error) {
      console.error("Failed to submit workflow:", error);
      toast.error("Failed to submit workflow.");
    }
  };

  return (
    <div className="container mx-auto p-4 w-screen">
      <h2 className="text-2xl font-semibold mb-4">Workflow</h2>

      {/* Workflow Name Input */}
      <div className="mb-4">
        <Input
          label="Workflow Name"
          placeholder="Enter workflow name"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
        />
      </div>

      {/* JSON Text Area with Buttons */}
      <div className="flex mb-4">
        <Textarea
          label="JSON Text"
          placeholder="Enter JSON text here"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          fullWidth
        />
        <div className="ml-4 flex flex-col gap-2">
          <Button onClick={handleSubmitJson}>Submit JSON</Button>
          {/* File Input for loading JSON from file */}
          <Input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            label="Upload JSON File"
          />
        </div>
      </div>

      {/* Node Selection */}
      {showSelect && availableNodes.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Select Node</h3>
          <select
            className="border p-2 rounded w-full"
            onChange={handleSelectNode}
            value={selectedNodeId || ""}
          >
            <option value="" disabled>
              Choose a node...
            </option>
            {availableNodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Input Selection */}
      {selectedNodeId && availableInputs.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Select Input for Node</h3>
          <select
            className="border p-2 rounded w-full"
            onChange={handleSelectInput}
            value={selectedInput || ""}
          >
            <option value="" disabled>
              Choose an input...
            </option>
            {availableInputs.map((input) => (
              <option key={input} value={input}>
                {input}
              </option>
            ))}
          </select>
          <Button onClick={handleAddInput} className="mt-2">
            Add Input
          </Button>
        </div>
      )}

      {/* Output Entry */}
      {selectedNodeId && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Add Output for Node</h3>
          <Input
            label="Output Name"
            placeholder="Enter output name"
            value={outputName}
            onChange={(e) => setOutputName(e.target.value)}
            className="mb-2"
          />
          <Input
            label="Output Type"
            placeholder="Enter output type (e.g., string)"
            value={outputType}
            onChange={(e) => setOutputType(e.target.value)}
          />
          <Button onClick={handleAddOutput} className="mt-2">
            Add Output
          </Button>
        </div>
      )}

      {/* Display selected nodes, their inputs, and outputs */}
      {selectedNodes.map((node) => (
        <Card key={node.id} className="mb-4">
          <CardBody>
            <h4 className="font-semibold mb-2">Node: {node.name}</h4>
            {node.inputs.map((inputName: string) => (
              <div key={inputName} className="mb-4">
                <h5 className="font-semibold">Input: {inputName}</h5>
                <div className="mb-2">
                  <label>Input Type:</label>
                  <Input
                    type="text"
                    placeholder="Enter input type (e.g., string)"
                    value={inputs[node.id]?.[inputName]?.type || ""}
                    onChange={(e) =>
                      handleInputChange(node.id, inputName, e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
            {node.outputs.map((outputName: string) => (
              <div key={outputName} className="mb-4">
                <h5 className="font-semibold">Output: {outputName}</h5>
                <div className="mb-2">
                  <label>Output Type:</label>
                  <Input
                    type="text"
                    placeholder="Enter output type (e.g., string)"
                    value={outputs[node.id]?.[outputName]?.type || ""}
                    onChange={(e) =>
                      handleOutputChange(node.id, outputName, e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      ))}

      {/* Add another node */}
      {selectedNodes.length > 0 && (
        <Button onClick={() => setShowSelect(true)} className="mb-4">
          Add Another Node
        </Button>
      )}

      {/* Final Submit Button */}
      {selectedNodes.length > 0 && (
        <Button onClick={handleFinalSubmit} className="mt-4">
          Submit Workflow
        </Button>
      )}
    </div>
  );
};

export default WorkflowPage;
