// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline';

interface SeedInputProps {
  seed: number;
  setSeed: (seed: number) => void;
}

const SeedInput: React.FC<SeedInputProps> = ({ seed, setSeed }) => {
  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * Math.pow(2, 16));
    setSeed(randomNumber);
  };

  return (
    <div>
      <Input
        radius="sm"
        color="default"
        variant="bordered"
        type="number"
        label="Seed"
        placeholder="Seed"
        value={String(seed)}
        onChange={(e) => setSeed(Number(e.target.value))}
        endContent={
          <Button
            isIconOnly
            radius="full"
            variant="ghost"
            size="sm"
            className="border-none"
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
