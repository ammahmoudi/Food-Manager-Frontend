"use client";
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
	Link,
} from "@nextui-org/react";
import MealChip from "./MealChip";
import { Comment } from "../interfaces/Comment";
import {
	deleteCommentForMeal,
	updateCommentForMeal,
} from "@/app/berchi/services/berchiApi";
import UserAvatar from "@/components/UserAvatar";
import moment from "moment";
import { useUser } from "@/context/UserContext";
import { toast } from 'sonner';

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
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [editedText, setEditedText] = useState(comment.text);
	const { user} = useUser();

	const handleUpdateComment = async () => {
		const updatePromise = updateCommentForMeal(comment.id, editedText);

		try {
			toast.promise(updatePromise, {
				loading: "Updating comment...",
				success: (updatedComment) => {
					onUpdate(updatedComment);
					setEditModalVisible(false);
					return "Comment updated successfully!";
				},
				error: "Failed to update comment.",
			});
		} catch (error) {
			console.error("Failed to update comment:", error);
		}
	};

	const handleConfirmDelete = async () => {
		const deletePromise = deleteCommentForMeal(comment.id);

		try {
			toast.promise(deletePromise, {
				loading: "Deleting comment...",
				success: () => {
					onDelete(comment.id);
					setDeleteModalVisible(false);
					return "Comment deleted successfully!";
				},
				error: "Failed to delete comment.",
			});
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
				as={Link}
				onPress={onClick}
			>
				<CardBody>
					<div className="flex mb-2 items-center gap-4">
						<div className=" flex flex-col items-left">
							<UserAvatar user={comment.user||user} />
						</div>

						<div className=" flex flex-col items-left overflow-hidden">
							<p className="text-md text-wrap text-medium mb-2">
								{comment.text}
							</p>
							<span className="inline-flex text-sm align-middle  flex-wrap items-baseline w-full gap-1">
								on
								<MealChip meal={comment.meal} />
								<span className="text-right absolute right-5 text-xs text-gray-700">
									{comment.created_at
										? moment(comment.updated_at).fromNow()
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
