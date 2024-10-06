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
  Image,
  Spinner,
} from "@nextui-org/react";
import { getCharacters, sendPromptForCharacter, getJob } from "../../services/aiApi"; 
import { Job } from "../../interfaces/Job"; 
import { toast } from "sonner";
import Character from "../../interfaces/Character";


const PromptPage = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedLora, setSelectedLora] = useState<string>("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loras, setLoras] = useState<{ name: string; path: string }[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [isSubmittingPrompt, setIsSubmittingPrompt] = useState<boolean>(false);
  const [resultImages, setResultImages] = useState<string[]>([]); // For multiple images
  const [polling, setPolling] = useState<boolean>(false); // Track if polling is in progress

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
  const handleCharacterSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const character = characters.find((char) => char.id === parseInt(e.target.value));
    if (character) {
      setSelectedCharacter(character);
      const loraList = Object.entries(character.loras).map(([name, path]) => ({
        name,
        path,
      }));
      setLoras(loraList);
    } else {
      setLoras([]);
    }
  };

  // Poll the job status using the jobID
  const pollJobStatus = async (jobId: number) => {
    const intervalId = setInterval(async () => {
      try {
        const jobData = await getJob(jobId);
        setJob(jobData);

        if (jobData.status === "completed") {
          clearInterval(intervalId);
          setPolling(false);

          if (jobData.result_data && jobData.result_data.image_urls.length > 0) {
            setResultImages(jobData.result_data.image_urls); // Store the image URLs
            toast.success("Images generated successfully!");
          } else {
            toast.error("No images returned from the backend.");
          }
        } else if (jobData.status === "failed") {
          clearInterval(intervalId);
          setPolling(false);
          toast.error("Job failed to complete.");
        }
      } catch (error) {
        console.error("Error fetching job status:", error);
        clearInterval(intervalId);
        setPolling(false);
        toast.error("Error fetching job status.");
      }
    }, 5000); // Poll every 5 seconds
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
      setResultImages([]); // Clear previous images

      const response = await sendPromptForCharacter({
        prompt,
        character_id: selectedCharacter.id,
        lora_name: selectedLora,
      });

      toast.success("Prompt submitted successfully!");

      if (response.job_id) {
        setPolling(true); // Start polling
        pollJobStatus(response.job_id); // Start polling job status with jobID
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
    <div className="flex flex-col  space-x-2 space-y-2 justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[700px] h-auto gap-1">
        <CardBody className="flex flex-col md:flex md:flex-row gap-2">
          {/* Prompt Input Field */}
          <div className="flex flex-col w-full h-full">
            <Textarea
              label="Prompt"
              placeholder="Enter your prompt"
              fullWidth
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            {/* Character Selection with Avatar */}
            <div className="mt-4">
              <Select
                label="Choose a character"
                variant="bordered"
                onChange={handleCharacterSelection}
                selectedKeys={String(selectedCharacter?.id)}
              >
                {characters.map((char) => (
                  <SelectItem key={char.id} value={char.id} textValue={char.name}>
                    <div className="flex gap-2 items-center">
                      <Avatar
                        alt={char.name}
                        
                        className="flex-shrink-0"
                        size="sm"
                        src={char.image}
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
              <Select<{ name: string, path: string }>
                items={loras}
                label="Choose a Lora"
                variant="bordered"
                placeholder="Select a Lora"
                onSelectionChange={(selectedKeys) => setSelectedLora(Array.from(selectedKeys)[0] as string)}
                selectedKeys={selectedLora ? new Set([selectedLora]) : new Set()}
              >
                {(lora) => (
                  <SelectItem key={lora.name} textValue={lora.name}>
                    <div className="flex gap-2 items-center">{lora.name}</div>
                  </SelectItem>
                )}
              </Select>
            </div>
          </div>
        </CardBody>

        <CardFooter>
          <div className="flex flex-col w-full h-full">
            <Button
              color="primary"
              onPress={handleSubmitPrompt}
              isLoading={isSubmittingPrompt || polling}
              isDisabled={isSubmittingPrompt || polling}
            >
              Submit Prompt
            </Button>
          </div>
        </CardFooter>
      </Card>
      {job?.status === "pending" || job?.status === "running" ? (

        <div className=" w-[700px] h-full gap-1 flex justify-center items-center  bg-gray-200">
          <Spinner color="primary" size="lg" />
          <p className="text-gray-500 ml-4">{job?.status}</p>
        </div>
      ) : (
        resultImages.length > 0 && (
          <Card className="w-[700px] h-full gap-1">
            <CardBody className="">
              {/* Prompt Input Field */}
              <div className="flex flex-col w-full h-full">
              {resultImages.map((imageUrl, index) => (
                <div key={index} className="w-full">
                  <Image
                    src={imageUrl}
                    alt={`Generated result ${index + 1}`}
                    className="w-full h-full object-cover border rounded-md"
                  />
                </div>
              ))}
                  </div>
    
            </CardBody>
    
            <CardFooter>
              <div className="flex flex-col w-full h-full">
               
              </div>
            </CardFooter>
          </Card>  
          )
      )}
      
   
      
    </div>
  );
};

export default PromptPage;
