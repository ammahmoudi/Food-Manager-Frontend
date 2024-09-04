// components/CommentCard.tsx
import React, { useState } from "react";
import {
	Card,
	CardBody,
	Button,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Textarea,
} from "@nextui-org/react";
import { format } from "date-fns-jalali";
import UserChip from "@/components/UserChip";
import MealChip from "@/components/MealChip";
import { Comment } from "@/interfaces/Comment";
import { Meal } from "@/interfaces/Meal";
import { User } from "@/interfaces/User";
import { Food } from "@/interfaces/Food";
import { useUser } from "../context/UserContext";

import { deleteCommentForMeal, updateCommentForMeal } from "@/services/api";
import { CardHeader } from "@nextui-org/react";
import UserProfile from "./UserProfile";
import UserAvatar from "./UserAvatar";
import momment from "moment";

interface CommentCardProps {
	comment: Comment;
	onDelete: (commentId: number) => void;
	onUpdate: (comment: Comment) => void;
	onClick: () => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
	comment,
	onDelete,
	onUpdate,
	onClick,
}) => {
	const { isAdmin, user } = useUser();
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [editedText, setEditedText] = useState(comment.text);
	const handleEdit = () => {
		setEditModalVisible(true);
	};

	const handleDelete = () => {
		setDeleteModalVisible(true);
	};

	const handleUpdateComment = async () => {
		try {
			const updatedComment = await updateCommentForMeal(comment.id, editedText);
			onUpdate(updatedComment);
			setEditModalVisible(false);
		} catch (error) {
			console.error("Failed to update comment:", error);
		}
	};

	const handleConfirmDelete = async () => {
		try {
			await deleteCommentForMeal(comment.id);
			onDelete(comment.id);
			setDeleteModalVisible(false);
		} catch (error) {
			console.error("Failed to delete comment:", error);
		}
	};

	return (
		<>
			<Card
				key={comment.id}
				className="mb-2 w-full"
				isPressable
				onPress={onClick}
			>
				<CardBody>
					<div className="flex mb-2 items-center gap-4">
						<div className=" flex flex-col items-left">
							<UserAvatar user={comment.user} />
						</div>

						<div className=" flex flex-col items-left overflow-hidden">
							<p className="text-md text-wrap text-medium mb-2">
								{comment.text}
							</p>
							<span className="inline-flex text-sm align-middle  flex-wrap items-baseline w-full gap-1">
								on
								<MealChip
											meal={comment.meal}
									onDelete={() => {}}
								/>
								<span className="text-right absolute right-5 text-xs text-gray-700">
									{comment.created_at
										? momment(comment.updated_at).fromNow()
										: "unknown time"}
								</span>
							</span>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Edit Modal */}
			<Modal
				isOpen={editModalVisible}
				onClose={() => setEditModalVisible(false)}
			>
				<ModalHeader>Edit Comment</ModalHeader>
				<ModalBody>
					<Textarea
						label="Comment"
						value={editedText}
						onChange={(e) => setEditedText(e.target.value)}
					/>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={handleUpdateComment}>
						Update
					</Button>
					<Button color="secondary" onClick={() => setEditModalVisible(false)}>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>

			{/* Delete Confirmation Modal */}
			<Modal
				isOpen={deleteModalVisible}
				onClose={() => setDeleteModalVisible(false)}
			>
				<ModalHeader>Delete Comment</ModalHeader>
				<ModalBody>Are you sure you want to delete this comment?</ModalBody>
				<ModalFooter>
					<Button color="danger" onClick={handleConfirmDelete}>
						Delete
					</Button>
					<Button
						color="secondary"
						onClick={() => setDeleteModalVisible(false)}
					>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>
		</>
	);
};

export default CommentCard;
