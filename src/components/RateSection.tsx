// components/RateSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Slider, Button } from "@nextui-org/react";
import { getUserRateForMeal, submitRateForMeal } from "../services/api";

interface RateSectionProps {
  mealId: number;
}

const RateSection: React.FC<RateSectionProps> = ({ mealId }) => {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserRate = async () => {
      try {
        const response = await getUserRateForMeal(mealId);
        setRate(response.rate);
      } catch (error) {
        console.error("Failed to fetch rate:", error);
      }
    };

    fetchUserRate();
  }, [mealId]);

  const handleRateSubmit = async () => {
    if (rate !== null) {
      setLoading(true);
      try {
        await submitRateForMeal(mealId, rate);
        alert("Rating submitted successfully!");
      } catch (error) {
        console.error("Failed to submit rate:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="rate-section">
      <h3 className="text-xl font-semibold mb-2">Rate this Meal</h3>
      <Slider
        size="lg"
        step={1}
        color="primary"
        label="Rate"
        showSteps={true}
        maxValue={5}
        minValue={0}
        value={rate}
        

        onChange={(value) => setRate(value)}
        className="max-w-md"
      />
      <Button
        color="primary"
        onPress={handleRateSubmit}
        isDisabled={rate === null}
        isLoading={loading}
        className="mt-4"
      >
        Submit Rating
      </Button>
    </div>
  );
};

export default RateSection;
