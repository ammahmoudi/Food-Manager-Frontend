"use client";

import React, { useEffect, useRef, useState } from "react";
import Chart, { ScriptableContext } from "chart.js/auto";
import { getFoods } from "@/app/berchi/services/berchiApi";
import {
	Avatar,
	Popover,
	PopoverTrigger,
	PopoverContent,
	Skeleton,
} from "@nextui-org/react";

import { FoodDetailCard } from "./FoodDetailCard";
import { Food } from "../interfaces/Food";
import { toast } from "sonner";
import {
	getThemeColorFromImage,
	getLighterColorBasedOnRating,
	getReadableTextColor,
} from "@/utils/colorUtils";
interface AvatarPosition {
	x: number;
	y: number;
	food: Food;
}

const TopRatedFoodsChartJS = () => {
	const chartRef = useRef<HTMLCanvasElement>(null);
	const [foods, setFoods] = useState<Food[]>([]);
	const [avatarPositions, setAvatarPositions] = useState<AvatarPosition[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTopFoods = async () => {
			try {
				setLoading(true);
				toast.promise(getFoods(), {
					// pending: "Loading top-rated foods...",
					success: (response) => {
						const filteredFoods = response.filter(
							(food: Food) => food.avg_rate !== 0
						);
						const sortedFoods = filteredFoods
							.sort((a: Food, b: Food) => b.avg_rate - a.avg_rate)
							.slice(0, 5);

						setFoods(sortedFoods);
						setLoading(false);
						return "Top-rated foods loaded successfully!";
					},
					error: "Failed to load foods.",
				});
			} catch (error) {
				console.error("Error fetching top-rated foods:", error);
			}
		};

		fetchTopFoods();
	}, []);

	useEffect(() => {
		if (!chartRef.current || foods.length === 0) return;

		const ctx = chartRef.current.getContext("2d");
		if (ctx) {
			const chart = new Chart(ctx, {
				type: "bar",
				data: {
					labels: foods.map((food) => food.name),
					datasets: [
						{
							label: "Rating",
							data: foods.map((food) => food.avg_rate),
							backgroundColor: (context: ScriptableContext<"bar">) => {
								const food = foods[context.dataIndex];
								const baseColor = getThemeColorFromImage(food.image as string);
								return getLighterColorBasedOnRating(
									baseColor,
									food.avg_rate / 5.0
								);
							},
							borderWidth: 0,
							borderRadius: {
								topRight: 10,
								bottomRight: 10,
								topLeft: 0,
								bottomLeft: 0,
							},
							barThickness: 50,
						},
					],
				},
				options: {
					indexAxis: "y",
					scales: {
						x: {
							display: false,
							grid: {
								display: false,
							},
						},
						y: {
							display: false,
							grid: {
								display: false,
							},
						},
					},
					plugins: {
						legend: {
							display: false,
						},
						tooltip: {
							enabled: false,
						},
					},
					maintainAspectRatio: false,
				},
				plugins: [
					{
						id: "customAvatarPosition",
						afterDraw: (chartInstance) => {
							const { scales } = chartInstance;
							const newAvatarPositions: React.SetStateAction<AvatarPosition[]> =
								[];

							foods.forEach((food, index) => {
								const yPosition = scales.y.getPixelForValue(index);
								let xPosition = scales.x.getPixelForValue(food.avg_rate);

								if (xPosition < 60) xPosition = 60;

								newAvatarPositions.push({
									x: xPosition - 30,
									y: yPosition,
									food,
								});
							});

							setAvatarPositions(newAvatarPositions);
						},
					},
					{
						id: "customLabelInsideBars",
						afterDatasetsDraw: (chart) => {
							const ctx = chart.ctx;
							chart.data.datasets.forEach((dataset, i) => {
								const meta = chart.getDatasetMeta(i);
								meta.data.forEach((bar, index) => {
									const food = foods[index];
									const { x, y } = bar.tooltipPosition(false);
									const maxLabelWidth = x - 60;
									let labelText = `${food.name} (${food.avg_rate})`;

									ctx.font = "bold 14px Arial";
									let textWidth = ctx.measureText(labelText).width;
									if (textWidth > maxLabelWidth) {
										while (textWidth > maxLabelWidth && labelText.length > 3) {
											labelText = labelText.slice(0, -4) + "...";
											textWidth = ctx.measureText(labelText).width;
										}
									}

									const baseColor = getThemeColorFromImage(
										food.image as string
									);
									const barColor = getLighterColorBasedOnRating(
										baseColor,
										food.avg_rate / 5.0
									);
									const textColor = getReadableTextColor(barColor);

									ctx.fillStyle = textColor;
									ctx.textBaseline = "middle";
									ctx.fillText(labelText, 10, y);
								});
							});
						},
					},
				],
			});

			const canvas = chartRef.current;
			if (canvas) {
				canvas.height = foods.length * 60;
			}

			return () => {
				chart.destroy();
			};
		}
	}, [foods]);

	return (
		<div>
			{loading ? (
				<Skeleton className="rounded-lg h-64" />
			) : (
				<div style={{ position: "relative", height: `${foods.length * 60}px` }}>
					<canvas ref={chartRef} />
					{avatarPositions.map((position, index) => (
						<Popover key={index} showArrow placement="top">
							<PopoverTrigger>
								<div
									style={{
										position: "absolute",
										left: position.x,
										top: position.y,
										transform: "translate(-50%, -50%)",
										cursor: "pointer",
									}}
								>
									<Avatar
										src={position.food.image as string}
										size="md"
										alt={position.food.name}
									/>
								</div>
							</PopoverTrigger>
							<PopoverContent className="p-1">
								<FoodDetailCard food={position.food} />
							</PopoverContent>
						</Popover>
					))}
				</div>
			)}
		</div>
	);
};

export default TopRatedFoodsChartJS;
