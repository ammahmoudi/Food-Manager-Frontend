"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";

import { toast } from "sonner";
import { getCharacters } from "../services/aiApi";
import Character from "../interfaces/Character";
import CharacterCard from "../components/CharacterCard";

const CharacterListPage = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
<div className="flex flex-col xl:w-1/2 mx-auto p-2 items-center">
      <h2 className="text-2xl font-semibold mb-4">Characters</h2>
      {loading ? (
        <div className="flex justify-center">
          <Spinner color="primary" size="lg" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {characters.map((character) => (
            <div key={character.id}>
              <CharacterCard id ={character.id}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterListPage;
