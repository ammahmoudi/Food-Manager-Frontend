"use client";

import React, { useState, useEffect } from "react";
import { Slider, SliderValue } from "@nextui-org/react";
import { getUserRateForMeal, submitRateForMeal } from "../services/api";
import { toast } from "react-toastify";

interface RateSectionProps {
	mealId: number;
}

const RateSection: React.FC<RateSectionProps> = ({ mealId }) => {
	const [rate, setRate] = useState<SliderValue>(0);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchUserRate = async () => {
			try {
				const response = await toast.promise(
					getUserRateForMeal(mealId),
					{
						pending: "Loading your rate...",
						success: "Rate loaded!",
						error: "Failed to load rate.",
					}
				);
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
				await toast.promise(
					submitRateForMeal(mealId, rate as number),
					{
						pending: "Submitting your rate...",
						success: "Rate submitted successfully!",
						error: "Failed to submit rate.",
					}
				);
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
		<div className="rate-section mt-3">
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
				isDisabled={loading}
			/>
		</div>
	);
};

export default RateSection;
