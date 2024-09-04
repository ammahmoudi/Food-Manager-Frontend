"use client";

import { FC, useState, useEffect, useCallback, useRef } from "react";
import { Card, CardFooter, CardHeader, Image } from "@nextui-org/react";
import { Meal } from "../interfaces/Meal";
import { format, isToday } from "date-fns-jalali";
import MealDetailModal from "./MealDetailModal";
import { getMealByDate } from "@/services/api";
import { formatDateToYYYYMMDD } from "@/utils/dateUtils";

interface MealCellProps {
    date: Date;
    initialMeal: Meal | null;
}

const MealCell: FC<MealCellProps> = ({ date, initialMeal }) => {
    const [meal, setMeal] = useState<Meal | null>(initialMeal);
    const [modalVisible, setModalVisible] = useState(false);
    const [showFooter, setShowFooter] = useState(true);
    const cardRef = useRef<HTMLDivElement>(null);

    const fetchMeal = async () => {
        try {
            const response = await getMealByDate(formatDateToYYYYMMDD(date));
            setMeal(response);
        } catch (error) {
            setMeal(null);
            console.error("Failed to fetch meals:", error);
        }
    };

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        fetchMeal();
        setModalVisible(false);
    };

    const handleResize = (entries: ResizeObserverEntry[]) => {
        if (entries[0].contentRect.width < 100) {
            setShowFooter(false);
        } else {
            setShowFooter(true);
        }
    };

    useEffect(() => {
        const observer = new ResizeObserver(handleResize);
        if (cardRef.current) {
            observer.observe(cardRef.current);
        }
        return () => {
            observer.disconnect();
        };
    }, [cardRef]);

    return (
        <div ref={cardRef} className="meal-cell h-full w-full p-0.5">
            {meal ? (
                <Card
                    isFooterBlurred
                    radius="md"
                    key={meal.id}
                    isPressable
                    className={`h-full w-full  ${
                        isToday(date) ? "shadow-md border-3 border-primary shadow-primary" : ""
                    }`}
                    onPress={handleOpenModal}
                >
                    <Image
                        className="z-0 w-full h-full object-cover"
                        classNames={{ wrapper: "w-full h-full max-w-full max-h-full " }}
                        src={meal.food?.image as string ?? "/images/food-placeholder.jpg"}
                        alt={meal.food?.name}
                        radius="none"
                    />
                    <CardHeader className="absolute z-10 flex-col items-center justify-center h-full">
                        <p className="text-medium text-white/90 uppercase font-bold">
                            {format(date || "", "d")}
                        </p>
                    </CardHeader>
                    {showFooter && (
                        <CardFooter className="absolute before:bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-center py-1 lg:py-2">
                            <p className="text-white font-bold text-tiny truncate ">
                                <span>{meal.food?.name}</span>
                            </p>
                        </CardFooter>
                    )}
                </Card>
            ) : (
                <Card
                    isFooterBlurred
                    radius="md"
                    className={`h-full w-full justify-center items-center  ${
                        isToday(date) ? "shadow-md shadow-emerald-800" : ""
                    }`}                    isPressable
                    onPress={handleOpenModal}
                >
                    <div className="h-full flex items-center justify-center ">
                        <p className="text-medium text-black/60 uppercase font-bold text-center">
                            {format(date, "d")}
                        </p>
                    </div>
                </Card>
            )}

            <MealDetailModal
                visible={modalVisible}
                onClose={handleCloseModal}
                date={date}
                onSave={() => {}}
                initialData={meal}
                onDelete={() => {}}
            />
        </div>
    );
};

export default MealCell;
