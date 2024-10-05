"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
	ModalContent,
} from "@nextui-org/react";
import { Comment } from "../interfaces/Comment";
import {
	getMealComments,
	getLatestComments,
	getFoodComments,
	getUserComments,
	submitCommentForMeal,
	deleteCommentForMeal
} from "@/app/berchi/services/berchiApi";
import CommentCard from "./CommentCard";
import CommentModal from "./CommentModal";
import { Meal } from "../interfaces/Meal";
import { toast } from "react-toastify";

type CommentSectionVariant = "meal" | "food" | "user" | "latest";

interface CommentSectionProps {
	variant: CommentSectionVariant;
	mealId?: number;
	foodId?: number;
	userId?: number;
	meal?: Meal;
}

const CommentSection: React.FC<CommentSectionProps> = ({
	variant,
	mealId,
	foodId,
	userId,
	meal,
}) => {
	const [comments, setComments] = useState<Comment[]>([]);
	const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
	const {
		isOpen: isAllCommentsModalOpen,
		onOpen: openAllCommentsModal,
		onClose: closeAllCommentsModal,
	} = useDisclosure();
	const {
		isOpen: isCommentModalOpen,
		onOpen: openCommentModal,
		onClose: closeCommentModal,
	} = useDisclosure();

	// Fetch comments based on the variant
	const fetchComments = useCallback(async () => {
		try {
			let response;
			switch (variant) {
				case "meal":
					if (mealId) response = await getMealComments(mealId);
					break;
				case "food":
					if (foodId) response = await getFoodComments(foodId);
					break;
				case "user":
					if (userId) response = await getUserComments(userId);
					break;
				case "latest":
					response = await getLatestComments();
					break;
				default:
					throw new Error("Invalid variant type");
			}
			if (response) setComments(response);
		} catch (error) {
			toast.error("Failed to fetch comments");
			console.error("Failed to fetch comments:", error);
		}
	}, [variant, mealId, foodId, userId]);

	useEffect(() => {
		fetchComments();
	}, [fetchComments]);

	const handleDeleteComment = async (commentId: number) => {
		try {
			await toast.promise(deleteCommentForMeal(commentId), {
				pending: "Deleting comment...",
				success: "Comment deleted!",
				error: "Failed to delete comment",
			});
			setComments((prevComments) =>
				prevComments.filter((comment) => comment.id !== commentId)
			);
		} catch (error) {
			console.error("Failed to delete comment:", error);
		}
	};

	const handleUpdateComment = async (updatedComment: Comment) => {
		setComments((prevComments) =>
			prevComments.map((comment) =>
				comment.id === updatedComment.id ? updatedComment : comment
			)
		);
	};

	const handleAddComment = async (newComment: Comment) => {
		try {
			const addedComment = await toast.promise(
				submitCommentForMeal(meal?.id || 0, newComment.text),
				{
					pending: "Adding comment...",
					success: "Comment added!",
					error: "Failed to add comment",
				}
			);
			setComments((prevComments) => [addedComment, ...prevComments]);
		} catch (error) {
			console.error("Failed to add comment:", error);
		}
	};

	const openEditCommentModal = (comment: Comment) => {
		setSelectedComment(comment);
		openCommentModal();
	};

	const openNewComment = () => {
		setSelectedComment(null); // Reset to null for new comment
		openCommentModal();
	};

	const handleCloseCommentModal = () => {
		closeCommentModal();
		fetchComments(); // Refresh comments after closing the modal
	};

	return (
		<div className="comment-section my-2">
			{/* Display the latest two comments */}
			{comments.slice(0, 1).map((comment) => (
				<CommentCard
					key={comment.id}
					comment={comment}
					onDelete={handleDeleteComment}
					onUpdate={handleUpdateComment}
					onClick={() => openEditCommentModal(comment)}
				/>
			))}

			<div className="flex flex-grow flex-row justify-between">
				{/* Button to show all comments */}
				{comments.length > 1 && (
					<Button onClick={openAllCommentsModal}>
						See All {comments.length} Comments
					</Button>
				)}

				{/* Button to add new comment, only visible for meal variant */}
				{variant === "meal" && (
					<Button color="primary" onClick={openNewComment}>
						Add Comment
					</Button>
				)}
			</div>

			{/* Modal for showing all comments */}
			<Modal
				isOpen={isAllCommentsModalOpen}
				onClose={closeAllCommentsModal}
				scrollBehavior="inside"
			>
				<ModalContent>
					<ModalHeader>All Comments</ModalHeader>
					<ModalBody>
						<div>
							{comments.map((comment) => (
								<CommentCard
									key={comment.id}
									comment={comment}
									onDelete={handleDeleteComment}
									onUpdate={handleUpdateComment}
									onClick={() => openEditCommentModal(comment)}
								/>
							))}
						</div>
					</ModalBody>
					<ModalFooter>
						<Button onClick={closeAllCommentsModal}>Close</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Comment Modal for adding/editing a comment */}
			<CommentModal
				isOpen={isCommentModalOpen}
				onClose={handleCloseCommentModal}
				comment={selectedComment || undefined}
				meal={meal || selectedComment?.meal}
				onUpdate={handleUpdateComment}
				onDelete={handleDeleteComment}
				onAdd={handleAddComment}
			/>
		</div>
	);
};

export default CommentSection;
