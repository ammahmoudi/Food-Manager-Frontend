"use client";

import { useCallback, useState } from "react";
import { Card, CardBody, Button, Input, Textarea } from "@nextui-org/react";
import { toast } from "react-toastify";
import { fetchNodesFromJson, submitWorkflowInputs } from "@/services/api"; // Assuming these are your API calls

interface InputType {
  type: string;
}

interface InputsState {
  [nodeId: string]: {
    [inputName: string]: InputType;
  };
}

interface ConstructedInputs {
  [nodeId: string]: {
    [inputName: string]: string;
  };
}

interface RequestBody {
  name: string;
  json_data: any; // Replace with specific type if your JSON structure is known
  inputs: ConstructedInputs;
}

const WorkflowPage = () => {
  const [workflowName, setWorkflowName] = useState<string>(""); // Ensure name is populated
  const [jsonText, setJsonText] = useState<string>("");
  const [nodes, setNodes] = useState<any[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<any[]>([]);
  const [inputs, setInputs] = useState<InputsState>({}); // Correct typing for inputs
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [availableNodes, setAvailableNodes] = useState<any[]>([]); // Nodes that can still be selected
  const [availableInputs, setAvailableInputs] = useState<string[]>([]); // Inputs that can still be selected for a node
  const [selectedInput, setSelectedInput] = useState<string | null>(null);
  const [showSelect, setShowSelect] = useState<boolean>(true); // Show dropdown initially

  // Fetch nodes after submitting the JSON
  const fetchNodes = useCallback(async () => {
    try {
      const fetchedNodes = await fetchNodesFromJson(jsonText);
      setNodes(fetchedNodes);
      setAvailableNodes(fetchedNodes); // Initialize available nodes
      toast.success("Nodes fetched successfully!");
    } catch (error) {
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
        }, // Initially empty input array
      ]);

      // Set available inputs for the selected node
      setAvailableInputs(selectedNode.inputs);

      // Remove selected node from available nodes
      setAvailableNodes((prevNodes) =>
        prevNodes.filter((node) => node.id !== nodeId)
      );

      setSelectedNodeId(nodeId); // Store selected node ID
      setSelectedInput(null); // Reset selected input
    }
  };

  // Handle input selection
  const handleSelectInput = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedInput(e.target.value); // Set selected input from dropdown
  };

  // Handle adding the selected input to the selected node
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

  // Handle input changes for each node's type
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
      let json_data: any; // You can define the type for this based on your expected JSON structure
      try {
        json_data = JSON.parse(jsonText); // Parse the jsonText to ensure it's valid JSON
      } catch (error) {
        toast.error("Invalid JSON format.");
        console.error("Invalid JSON format.", error);
        return;
      }

      // Construct the inputs object to match the new required format
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

      // Prepare the final request body
      const requestBody: RequestBody = {
        name: workflowName, // Ensure the workflow name is populated
        json_data: json_data, // The json_data in the correct format, parsed from jsonText
        inputs: constructedInputs, // Constructed inputs in the correct format
      };

      console.log(
        "Submitting the following request body:",
        JSON.stringify(requestBody, null, 2)
      );

      // Send the formatted inputs to the backend
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

      {/* Display selected nodes and their inputs */}
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
