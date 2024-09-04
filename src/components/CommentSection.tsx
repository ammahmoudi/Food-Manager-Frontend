// components/CommentSection.tsx

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
import { Comment } from "@/interfaces/Comment"; // Assuming you have these interfaces
import {
	getMealComments,
	getLatestComments,
	getFoodComments,
	getUserComments,
	submitCommentForMeal,
} from "@/services/api"; // Assuming these API functions exist
import CommentCard from "./CommentCard";
import CommentModal from "./CommentModal"; // Import the CommentModal component
import { Meal } from "@/interfaces/Meal"; // Import the Meal interface

type CommentSectionVariant = "meal" | "food" | "user" | "latest";

interface CommentSectionProps {
	variant: CommentSectionVariant;
	mealId?: number;
	foodId?: number;
	userId?: number;
	meal?: Meal; // Assuming meal data is passed as prop for "meal" variant
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
			console.error("Failed to fetch comments:", error);
		}
	}, [variant, mealId, foodId, userId]);

	useEffect(() => {
		fetchComments();
	}, [fetchComments]);

	const handleDeleteComment = (commentId: number) => {
		// setComments(comments.filter((comment) => comment.id !== commentId));
	};

	const handleUpdateComment = (updatedComment: Comment) => {
		// setComments(
		// 	comments.map((comment) =>
		// 		comment.id === updatedComment.id ? updatedComment : comment
		// 	)
		// );
	};

	const handleAddComment = async (newComment: Comment) => {
		// if (variant === "meal" && meal) {
		// 	try {
		// 		const addedComment = await submitCommentForMeal(
		// 			meal.id,
		// 			newComment.text
		// 		);
		// 		setComments([addedComment, ...comments]);
		// 	} catch (error) {
		// 		console.error("Failed to add comment:", error);
		// 	}
		// }
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
			<h3 className="text-xl font-semibold mb-2">Comments</h3>

			{/* Display the latest two comments */}
			{comments.slice(0, 1).map((comment) => (
				<CommentCard
					key={comment.id}
					comment={comment}
					onDelete={handleDeleteComment}
					onUpdate={handleUpdateComment}
					onClick={() => openEditCommentModal(comment)} // Open edit modal on click
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
									onClick={() => openEditCommentModal(comment)} // Open edit modal on click
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
				meal={meal||selectedComment?.meal}
				onUpdate={handleUpdateComment}
				onDelete={handleDeleteComment}
				onAdd={handleAddComment} // Pass handleAddComment as onAdd
			/>
		</div>
	);
};

export default CommentSection;
