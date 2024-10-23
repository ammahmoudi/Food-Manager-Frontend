"use client";

import { useEffect, useState } from "react";
import { Card, CardFooter, Image, Button } from "@nextui-org/react";

import { toast } from "sonner";
import { getCharacter } from "../services/aiApi";
import Character from "../interfaces/Character";

interface CharacterCardProps {
  id: number;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ id }) => {
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const fetchedCharacters = await getCharacter(id);
        setCharacter(fetchedCharacters);
      } catch (error) {
        console.error("Failed to fetch characters:", error);
        toast.error("Failed to fetch characters.");
      }
    };
    fetchCharacter();
  }, []);

  return (
    <div>
      {character ? (
        <Card
          key={character.id}
          isFooterBlurred
          radius="lg"
          className="border-none"
        >
          <Image
            alt={character.name}
            className="object-cover"
            height={300}
            src={character.image}
            width={200}
          />
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80">{character.name}</p>

            <Button
              className="text-tiny text-white/80 bg-black/20  overflow-visible rounded-full  after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-background/40 after:z-[-1] after:transition after:!duration-500 hover:after:scale-150 hover:after:opacity-0"
              variant="flat"
              color="default"
              radius="lg"
              size="sm"
            >
              {character.datasets.length > 0
                ? `${character.datasets.length} datasets available`
                : "Available soon"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <h1>error showing the character</h1>
      )}
    </div>
  );
};

export default CharacterCard;
