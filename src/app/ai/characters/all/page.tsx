"use client";

import { useEffect, useState } from "react";
import { Card, CardFooter, Image, Button, Spinner } from "@nextui-org/react";

import { toast } from "sonner";
import { getCharacters } from "../../services/aiApi";
import Character from "../../interfaces/Character";

const CharacterListPage = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch list of characters from backend on component mount
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const fetchedCharacters = await getCharacters();
        setCharacters(fetchedCharacters);
      } catch (error) {
        console.error("Failed to fetch characters:", error);
        toast.error("Failed to fetch characters.");
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Characters</h2>

      {loading ? (
        <div className="flex justify-center">
          <Spinner color="primary" size="lg" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {characters.map((character) => (
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
                  className="text-tiny text-white bg-black/20"
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
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterListPage;
