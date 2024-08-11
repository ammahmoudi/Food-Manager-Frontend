"use client";

import { FC, useState, useEffect } from "react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@nextui-org/react";
import MealForm from "./MealForm";
import { format } from "date-fns-jalali";
import { Meal } from "@/interfaces/Meal";
import { getLocalTimeZone, today } from "@internationalized/date";

interface MealDetailModalProps {
	visible: boolean;
	onClose: () => void;
	onSave: (meal: Meal|null) => void;
	onDelete: (mealId: number) => void;
	date: Date|null;
	initialData: Meal|null;
}

const MealDetailModal: FC<MealDetailModalProps> = ({
	visible,
	onClose,
	date,
	onSave,
	onDelete,
	initialData,
}) => {
	return (
		<Modal
			isOpen={visible}
			size="sm"
			scrollBehavior="inside"
			onOpenChange={onClose}
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<p>
						{date ? "Meal for" : "New Meal"}{" "}
						{date&&format(date??today(getLocalTimeZone()).toDate(getLocalTimeZone()), "yyyy/MM/dd")}
					</p>
				</ModalHeader>
				<ModalBody>
					<MealForm
						date={date}
						onSave={(meal) => {
							onSave(meal);
							onClose();
						}}
						initialData={initialData}
						onDelete={(mealId) => {
							onDelete(mealId);
							onClose();
						}}
					/>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default MealDetailModal;
