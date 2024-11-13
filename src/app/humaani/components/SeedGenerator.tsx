import { Input, Button } from "@nextui-org/react";
import { IoDiceOutline } from "react-icons/io5";

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
            className="border-none"
            onPress={generateRandomNumber}
          >
            <IoDiceOutline />
          </Button>
        }
      />
    </div>
  );
};

export default SeedInput;
