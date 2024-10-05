"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardFooter,
  CardBody,
  Textarea,
  Select,
  SelectItem,
  Avatar,
  SelectedItems,
} from "@nextui-org/react";

import { toast, Id } from "react-toastify";
import { getCharacters } from "../../services/aiApi";

interface Character {
  id: number;
  name: string;
  image: string; // Added avatar field for characters
  loras: Record<string, string>; // Loras is an object with name-path pairs
  datasets: Dataset[];
}

interface Dataset {
  id: number;
  name: string;
}

interface Job {
  id: number;
  workflow: string;
  status: "pending" | "running" | "completed" | "failed";
  runtime: string;
  images: any[];
  result_data: Record<string, any>;
  input_data: Record<string, any>;
  logs: string;
  user: string;
}

const PromptPage = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [selectedLora, setSelectedLora] = useState<string>("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loras, setLoras] = useState<{ name: string; path: string }[]>([]); // Array for Loras
  const [job, setJob] = useState<Job | null>(null);
  const [isSubmittingPrompt, setIsSubmittingPrompt] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  // Fetch list of characters from backend on component mount
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const fetchedCharacters = await getCharacters();
        setCharacters(fetchedCharacters);
      } catch (error) {
        console.error("Failed to fetch characters:", error);
        toast.error("Failed to fetch characters.");
      }
    };
    fetchCharacters();
  }, []);

  // Handle character selection and update Loras
  const handleCharacterSelection = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    // Find the selected character and update the Loras
    const character = characters.find(
      (char) => char.id === parseInt(e.target.value)
    );
    if (character) {
      setSelectedCharacter(character);
      console.log(character);
      const loraList = Object.entries(character.loras).map(([name, path]) => ({
        name,
        path,
      }));

      setLoras(loraList);
    } else {
      setLoras([]); // Reset Loras if no character is selected
    }
  };

  // Handle prompt submission to backend
  const handleSubmitPrompt = async () => {
    if (!prompt.trim()) {
      toast.error("Prompt cannot be empty!");
      return;
    }

    if (!selectedCharacter) {
      toast.error("You must select a character.");
      return;
    }

    if (!selectedLora) {
      toast.error("You must select a Lora.");
      return;
    }

    try {
      setIsSubmittingPrompt(true);
      setJob(null);
      setResultImage(null);

      const response = await sendPromptforCharacter({
        prompt,
        character_id: selectedCharacter.id,
        lora_name: selectedLora,
      });

      toast.success("Prompt submitted successfully!");

      if (response.job_id) {
        // Handle polling for job status here (if necessary)
      } else {
        toast.error("Failed to retrieve job ID.");
      }
    } catch (error) {
      toast.error("Error submitting the prompt.");
      console.error("Error submitting prompt:", error);
    } finally {
      setIsSubmittingPrompt(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[700px] h-auto gap-1">
        <CardBody className="flex flex-col md:flex md:flex-row gap-2">
          {/* Prompt Input Field */}
          <div className="flex flex-col w-full h-full">
            <Textarea
              label="Prompt"
              className="h-[110px]"
              placeholder="Enter your prompt"
              fullWidth
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            {/* Character Selection with Avatar */}
            <div className="mt-4">
              <Select
                label="Choose a character"
                onChange={handleCharacterSelection} // Call the handleCharacterSelection function
                selectedKeys={String(selectedCharacter?.id)}
                classNames={{ base: "max-w-xs", trigger: "h-12" }}
                renderValue={(items: SelectedItems<Character>) => {
                  return items.map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
                      <Avatar
                        alt={item.data?.name}
                        className="flex-shrink-0"
                        size="sm"
                        src={item.data?.image} // Show the avatar
                      />
                      <div className="flex flex-col">
                        <span>{item.data?.name}</span>
                      </div>
                    </div>
                  ));
                }}
              >
                {characters.map((char) => (
                  <SelectItem
                    key={char.id}
                    value={char.id}
                    textValue={char.name}
                  >
                    <div className="flex gap-2 items-center">
                      <Avatar
                        alt={char.name}
                        className="flex-shrink-0"
                        size="sm"
                        src={char.image} // Show the avatar in the dropdown
                      />
                      <div className="flex flex-col">
                        <span className="text-small">{char.name}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Lora Selection */}
            <div className="mt-4">
              <Select
                label="Choose a Lora"
                selectedKeys={selectedLora}
                onChange={(e) => setSelectedLora(e as string)}
              >
                {loras.map((lora) => (
                  <SelectItem key={lora.name} value={lora.path}>
                    {lora.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </CardBody>

        <CardFooter>
          <div className="flex flex-col w-full h-full">
            <Button
              color="primary"
              onPress={handleSubmitPrompt}
              isLoading={isSubmittingPrompt}
              isDisabled={isSubmittingPrompt}
            >
              Submit Prompt
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Show result image under the button */}
      {resultImage && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Generated Image</h3>
          <img
            src={resultImage}
            alt="Generated result"
            className="w-80 h-80 object-cover border rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default PromptPage;
