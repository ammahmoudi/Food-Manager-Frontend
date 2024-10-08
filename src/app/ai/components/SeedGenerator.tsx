// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline';

interface SeedInputProps {
  seed: number;
  setSeed: (seed: number) => void; // Function passed from parent to set seed
}

const SeedInput: React.FC<SeedInputProps> = ({ seed, setSeed }) => {
  // Function to generate a new random number
  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * Math.pow(2, 16));
    setSeed(randomNumber);
  };

  return (
    <div>
      <Input
        type="number"
        label="Seed"
        placeholder="Seed"
        value={String(seed)}
        onChange={(e) => setSeed(Number(e.target.value))}
        endContent={
          <Button
            className="mx-w-10"
            onPress={generateRandomNumber}
          >
            <ArrowPathRoundedSquareIcon/>
          </Button>
        }
      />
    </div>
  );
};

export default SeedInput;
