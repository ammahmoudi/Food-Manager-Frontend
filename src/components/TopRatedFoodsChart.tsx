import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { getFoods } from "@/services/api";
import {
	Avatar,
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@nextui-org/react";
import {
	getThemeColorFromImage,
	getLighterColorBasedOnRating,
	getReadableTextColor,
} from "@/utils/ColorUtils";
import { FoodDetailCard } from "./FoodDetailCard"; // Import the FoodDetailCard component

interface Food {
	id: number;
	name: string;
	image: string;
	avg_rate: number;
	description: string;
}

const TopRatedFoodsChartJS = () => {
	const chartRef = useRef<HTMLCanvasElement>(null);
	const [foods, setFoods] = useState<Food[]>([]);
	const [avatarPositions, setAvatarPositions] = useState<any[]>([]);
	const [selectedFood, setSelectedFood] = useState<Food | null>(null);

	useEffect(() => {
		const fetchTopFoods = async () => {
			try {
				const response = await getFoods();
				const sortedFoods = response
					.sort((a: Food, b: Food) => b.avg_rate - a.avg_rate)
					.slice(0, 5);
				setFoods(sortedFoods);
			} catch (error) {
				console.error("Error fetching top-rated foods:", error);
			}
		};

		fetchTopFoods();
	}, []);

	useEffect(() => {
		if (!chartRef.current || foods.length === 0) return;

		const ctx = chartRef.current.getContext("2d");

		const chart = new Chart(ctx, {
			type: "bar",
			data: {
				labels: foods.map((food) => food.name),
				datasets: [
					{
						label: "Rating",
						data: foods.map((food) => food.avg_rate),
						backgroundColor: (context: any) => {
							const food = foods[context.dataIndex];
							const baseColor = getThemeColorFromImage(food.image);
							return getLighterColorBasedOnRating(
								baseColor,
								food.avg_rate / 5.0
							);
						},
						borderWidth: 0,
						borderRadius: {
							topRight: 10, // Rounded right corners
							bottomRight: 10,
							topLeft: 0,
							bottomLeft: 0,
						},
						barThickness: 50, // Adjust thickness
					},
				],
			},
			options: {
				indexAxis: "y", // Horizontal bar chart
				scales: {
					x: {
						display: false, // Remove x-axis labels
						grid: {
							display: false, // Remove x-axis grid lines
						},
					},
					y: {
						display: false, // Remove y-axis labels
						grid: {
							display: false, // Remove y-axis grid lines
						},
					},
				},
				plugins: {
					legend: {
						display: false, // No legend needed
					},
					tooltip: {
						enabled: false, // Disable tooltips for a cleaner look
					},
				},
				maintainAspectRatio: false, // Disable maintaining aspect ratio
			},
			plugins: [
				{
					id: "customAvatarPosition",
					afterDraw: (chartInstance) => {
						const { scales } = chartInstance;
						const newAvatarPositions: React.SetStateAction<any[]> = [];

						// Calculate avatar positions
						foods.forEach((food, index) => {
							const yPosition = scales.y.getPixelForValue(index);
							let xPosition = scales.x.getPixelForValue(food.avg_rate);

							// Ensure avatar doesn't go off the chart for low values
							if (xPosition < 60) xPosition = 60;

							newAvatarPositions.push({
								x: xPosition - 30, // Positioning it slightly after the bar
								y: yPosition, // Centering avatar vertically on the bar
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
								const maxLabelWidth = x - 60; // Prevents label from overlapping avatar
								let labelText = `${food.name} (${food.avg_rate})`;

								// Clip long names that might overlap the avatar
								ctx.font = "bold 14px Arial";
								let textWidth = ctx.measureText(labelText).width;
								if (textWidth > maxLabelWidth) {
									while (textWidth > maxLabelWidth && labelText.length > 3) {
										labelText = labelText.slice(0, -4) + "...";
										textWidth = ctx.measureText(labelText).width;
									}
								}

								// Use the background color of the bar to determine text color
								const baseColor = getThemeColorFromImage(food.image);
								const barColor = getLighterColorBasedOnRating(
									baseColor,
									food.avg_rate / 5.0
								);
								const textColor = getReadableTextColor(barColor);

								// Draw the label text inside the bar with the calculated text color
								ctx.fillStyle = textColor; // Dynamic text color
								ctx.textBaseline = "middle";
								ctx.fillText(labelText, 10, y); // Position inside the bar
							});
						});
					},
				},
			],
		});

		// Adjust the height of the canvas based on the number of foods
		const canvas = chartRef.current;
		if (canvas) {
			canvas.height = foods.length * 60; // Set height based on food count
		}

		return () => {
			chart.destroy(); // Cleanup previous instance
		};
	}, [foods]);

	return (
		<div>
			<div style={{ position: "relative", height: `${foods.length * 60}px` }}>
				<canvas ref={chartRef} />
				{/* Render avatars absolutely over the chart */}
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
								onClick={() => setSelectedFood(position.food)}
							>
								<Avatar
									src={position.food.image}
									size="md"
									alt={position.food.name}
								/>
							</div>
						</PopoverTrigger>
						<PopoverContent className="p-1">
							<FoodDetailCard
								food={position.food}
							/>
						</PopoverContent>
					</Popover>
				))}
			</div>
		</div>
	);
};

export default TopRatedFoodsChartJS;
