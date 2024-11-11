import React, { useRef } from "react";
import { ScrollShadow } from "@nextui-org/react";
import ImageComponent from "./ImageComponent";

interface CarouselComponentProps {
	jobs: number[];
	onImageClick: (id: number) => void;
	selectedVariant: number | null;
}

const CarouselComponent: React.FC<CarouselComponentProps> = ({
	jobs,
	onImageClick,
	selectedVariant,
}) => {
	const carouselRef = useRef<HTMLDivElement>(null);

	return (
		<div className="flex justify-center items-center w-full">
			<div className="relative max-w-6xl  w-full">
				<ScrollShadow
					offset={50}
					orientation="horizontal"
					className="w-full h-full  justify-center flex items-center"
				>
					<div
						ref={carouselRef}
						className="flex scroll-smooth justify-center  items-center no-scrollbar"
						style={{ scrollBehavior: "smooth" }}
					>
						{jobs.map((job) => (
							<div
								key={job}
								onClick={(e) => {
									e.stopPropagation();
									onImageClick(job);
								}} // Prevent modal close on content click
								className={` relative  flex-shrink-0 w-[15vw] h-[15vw] max-w-[120px] max-h-[120px] min-w-[80px] min-h-[80px] cursor-pointer py-3 px-3 ${
									selectedVariant && selectedVariant !== job ? "opacity-50" : ""
								}`}
							>
								<ImageComponent
									src_id={job}
									src_variant="job"
									className="w-full h-full object-contain"
									isClickable={false}
								/>
							</div>
						))}
					</div>
				</ScrollShadow>
			</div>
		</div>
	);
};

export default CarouselComponent;
