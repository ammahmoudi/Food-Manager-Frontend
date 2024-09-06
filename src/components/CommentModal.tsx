import React, { useState, useEffect } from "react";
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Textarea,
} from "@nextui-org/react";
import UserChip from "@/components/UserChip";
import MealChip from "@/components/MealChip";
import { Comment } from "@/interfaces/Comment";
import { Meal } from "@/interfaces/Meal";
import { useUser } from "../context/UserContext";
import {
	submitCommentForMeal,
	updateCommentForMeal,
	deleteCommentForMeal,
} from "@/services/api";
import { ModalContent } from "@nextui-org/react";
import moment from "moment";
import { toast } from "react-toastify";

interface CommentModalProps {
	isOpen: boolean;
	onClose: () => void;
	comment?: Comment; // If editing or deleting a comment, it will be provided
	meal?: Meal; // Meal details for the comment, useful for new comments
	onUpdate: (comment: Comment) => void; // Function to call after successful save or update
	onAdd: (comment: Comment) => void; // Function to call after successful save or update
	onDelete?: (commentId: number) => void; // Function to call after successful delete
}

const CommentModal: React.FC<CommentModalProps> = ({
	isOpen,
	onClose,
	comment,
	meal,
	onUpdate,
	onDelete,
	onAdd,
}) => {
	const { user, isAdmin } = useUser();
	const [commentText, setCommentText] = useState(comment?.text || "");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
		useState(false);

	useEffect(() => {
		// Reset the comment text when the modal opens or closes
		setCommentText(comment?.text || "");
	}, [isOpen, comment]);

	const handleSave = async () => {
		setIsSubmitting(true);

		const savePromise = comment
			? updateCommentForMeal(comment.id, commentText)
			: meal
			? submitCommentForMeal(meal.id, commentText)
			: Promise.reject("Invalid comment or meal");

		toast.promise(savePromise, {
			pending: "Saving comment...",
			success: comment ? "Comment updated!" : "Comment added!",
			error: "Failed to save comment",
		});

		try {
			const savedComment = await savePromise;
			comment ? onUpdate(savedComment) : onAdd(savedComment);
			onClose();
		} catch (error) {
			console.error("Failed to save comment:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = () => {
		setIsConfirmDeleteModalOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!comment || !onDelete) return;
		setIsSubmitting(true);

		const deletePromise = deleteCommentForMeal(comment.id);

		toast.promise(deletePromise, {
			pending: "Deleting comment...",
			success: "Comment deleted!",
			error: "Failed to delete comment",
		});

		try {
			await deletePromise;
			onDelete(comment.id);
			onClose();
		} catch (error) {
			console.error("Failed to delete comment:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalContent>
					<ModalHeader>
						{comment
							? isAdmin && comment.user.id !== user.id
								? "Comment"
								: "Edit Comment"
							: "Add Comment"}
					</ModalHeader>

					<ModalBody>
						<div className="flex items-center gap-1 text-sm">
							<UserChip user={comment?.user || user} /> on
							<MealChip meal={comment?.meal || meal} />
							{isAdmin &&
								comment &&
								comment.user.id !== user.id &&
								moment(comment.updated_at).fromNow()}
						</div>
						{comment && comment.user.id !== user.id ? (
							<p className="text-md text-wrap text-medium p-2">
								{comment.text}
							</p>
						) : (
							<Textarea
								label="Comment"
								placeholder="Write your comment here..."
								value={commentText}
								isDisabled={isSubmitting}
								onChange={(e) => setCommentText(e.target.value)}
								isRequired
								description={
									comment && "Updated " + moment(comment?.updated_at).fromNow()
								}
							/>
						)}
					</ModalBody>
					<ModalFooter>
						<div className="flex flex-auto justify-left gap-2">
							{!(comment && comment.user.id !== user.id) && (
								<>
									<Button
										color="primary"
										onClick={handleSave}
										isDisabled={!commentText.trim() || isSubmitting}
									>
										{comment ? "Update" : "Add"}
									</Button>
								</>
							)}
							{comment && (isAdmin || comment.user.id === user.id) && (
								<>
									<Button
										color="danger"
										onClick={handleDelete}
										isDisabled={isSubmitting}
										variant="light"
									>
										Delete
									</Button>
								</>
							)}
						</div>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Delete Confirmation Modal */}
			<Modal
				isOpen={isConfirmDeleteModalOpen}
				onClose={() => setIsConfirmDeleteModalOpen(false)}
			>
				<ModalContent>
					<ModalHeader>Confirm Deletion</ModalHeader>
					<ModalBody>Are you sure you want to delete this comment?</ModalBody>
					<ModalFooter>
						<Button
							color="danger"
							onClick={handleConfirmDelete}
							isDisabled={isSubmitting}
						>
							Confirm
						</Button>
						<Button
							onClick={() => setIsConfirmDeleteModalOpen(false)}
							variant="light"
						>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CommentModal;
