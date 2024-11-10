import React, { useState, useRef, useEffect } from "react";
import { Button,Image } from "@nextui-org/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ImageComponent from "./ImageComponent";


interface CarouselComponentProps {
    jobs: number[]
    onImageClick: (id: number) => void;
}

const CarouselComponent: React.FC<CarouselComponentProps> = ({ jobs, onImageClick }) => {
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const handleImageClick = (id: number) => {
        setSelectedImageId(id);
        onImageClick(id);
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            if(selectedImageId){
                setSelectedImageId(jobs[selectedImageId])
            }
        }
    };

    const handleNext = () => {
        if (currentIndex < jobs.length - 1) {
            setCurrentIndex(currentIndex + 1);
            if(selectedImageId){
                setSelectedImageId(jobs[selectedImageId])
            }
        }
    };

    useEffect(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollTo({
                left: currentIndex * carouselRef.current.clientWidth,
                behavior: "smooth",
        });
        }
    }, [currentIndex]);

    return (
        <div className="relative w-full  mx-auto">
            <div className="flex items-center justify-between mb-4">
                <Button
                className="flex flex-grow-0"
                isIconOnly
                color="primary"
                variant="light"
                onPress={handlePrev}
                isDisabled={currentIndex === 0}
                >
                    <FaChevronLeft />
                </Button>

                <div
                ref={carouselRef}
                className="flex flex-grow justify-center gap-2"
                style={{ scrollBehavior: "smooth" }}
                >
                    {jobs.map((job) => (
                        <div
                            key={job}
                            onClick={() => handleImageClick(job)}
                            className=""
                        >
                            <Image className="h-[10]" src="https://sitechecker.pro/wp-content/uploads/2017/12/what-does-url-stand-for.png"></Image>
                        </div>
                    ))}
                </div>`
                <Button
                className="flex flex-grow-0"
                isIconOnly
                color="primary"
                variant="light"
                onPress={handleNext}
                isDisabled={currentIndex === jobs.length - 1}
                >
                    <FaChevronRight />
                </Button>
            </div>
        </div>
    );
};

export default CarouselComponent;
