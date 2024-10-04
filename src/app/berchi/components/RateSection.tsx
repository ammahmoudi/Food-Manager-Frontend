"use client";

import React, { useState, useEffect } from "react";
import { Slider, SliderValue } from "@nextui-org/react";
import { getUserRateForMeal, submitRateForMeal } from "@/app/berchi/services/berchiApi";
import { toast } from "sonner";

interface RateSectionProps {
	mealId: number;
}

const RateSection: React.FC<RateSectionProps> = ({ mealId }) => {
	const [rate, setRate] = useState<SliderValue>(0);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchUserRate = async () => {
			try {
				toast.promise(
					getUserRateForMeal(mealId),
					{
						// loading: "Loading your rate...",
						success: (response)=>{
							setRate(response.rate);
							return"Rate loaded!"
						}	,
						error: "Failed to load rate.",
					}
				);
				
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
						// loading: "Submitting your rate...",
						// success: "Rate submitted successfully!",
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
