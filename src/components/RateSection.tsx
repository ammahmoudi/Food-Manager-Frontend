// components/RateSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Slider, Button, SliderValue } from "@nextui-org/react";
import { getUserRateForMeal, submitRateForMeal } from "../services/api";

interface RateSectionProps {
	mealId: number;
}

const RateSection: React.FC<RateSectionProps> = ({ mealId }) => {
	const [rate, setRate] = useState<SliderValue>(0);
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
				await submitRateForMeal(mealId, rate as number);
			} catch (error) {
				console.error("Failed to submit rate:", error);
			} finally {
				setLoading(false);
			}
		}
	};
	const handleRateChange = (value: SliderValue) => {
		setRate(value as number);
	};

	return (
		<div className="rate-section">
			<Slider
				size="md"
				step={1}
				color="primary"
				label="Rate"
				showSteps={true}
				maxValue={5}
				minValue={0}
				value={rate}
				onChange={handleRateChange}
				onChangeEnd={handleRateSubmit}
				className="max-w-md"
			/>
		</div>
	);
};

export default RateSection;
