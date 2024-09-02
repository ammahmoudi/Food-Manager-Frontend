// components/CommentSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Textarea } from "@nextui-org/react";
import { Comment } from "@/interfaces/Comment"; // Assuming you have these interfaces
import { getLatestComments, submitCommentForMeal } from "@/services/api";
import CommentCard from "./CommentCard";

interface CommentSectionProps {
    mealId: number;
    isAdmin: boolean;
    currentUserId: number; // ID of the currently logged-in user
}

const CommentSection: React.FC<CommentSectionProps> = ({ mealId, isAdmin, currentUserId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [showAllCommentsModal, setShowAllCommentsModal] = useState(false);
    const [showNewCommentModal, setShowNewCommentModal] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await getLatestComments();
                setComments(response);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            }
        };

        fetchComments();
    }, [mealId]);

    const handleAddComment = async () => {
        try {
            const newCommentData = await submitCommentForMeal(mealId, newComment);
            setComments([newCommentData, ...comments]);
            setNewComment("");
            setShowNewCommentModal(false);
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    const handleDeleteComment = (commentId: number) => {
        setComments(comments.filter(comment => comment.id !== commentId));
    };

    const handleUpdateComment = (updatedComment: Comment) => {
        setComments(comments.map(comment => (comment.id === updatedComment.id ? updatedComment : comment)));
    };

    return (
        <div className="comment-section">
            <h3 className="text-xl font-semibold mb-2">Comments</h3>

            {/* Display the latest two comments */}
            {comments.slice(0, 2).map((comment) => (
                <CommentCard
                    key={comment.id}
                    comment={comment}
                    onDelete={handleDeleteComment}
                    onUpdate={handleUpdateComment}
                    isAdmin={isAdmin}
                    currentUserId={currentUserId}
                />
            ))}

            {/* Button to show all comments */}
            {comments.length > 2 && (
                <Button onClick={() => setShowAllCommentsModal(true)}>See All Comments</Button>
            )}

            {/* Button to add new comment */}
            <Button color="primary" onClick={() => setShowNewCommentModal(true)}>Add Comment</Button>

            {/* Modal for showing all comments */}
            <Modal isOpen={showAllCommentsModal} onClose={() => setShowAllCommentsModal(false)}>
                <ModalHeader>All Comments</ModalHeader>
                <ModalBody>
                    {comments.map((comment) => (
                        <CommentCard
                            key={comment.id}
                            comment={comment}
                            onDelete={handleDeleteComment}
                            onUpdate={handleUpdateComment}
                            isAdmin={isAdmin}
                            currentUserId={currentUserId}
                        />
                    ))}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => setShowAllCommentsModal(false)}>Close</Button>
                </ModalFooter>
            </Modal>

            {/* Modal for adding a new comment */}
            <Modal isOpen={showNewCommentModal} onClose={() => setShowNewCommentModal(false)}>
                <ModalHeader>Add New Comment</ModalHeader>
                <ModalBody>
                    <Textarea
                        label="Comment"
                        placeholder="Write your comment here..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleAddComment} isDisabled={!newComment}>
                        Submit
                    </Button>
                    <Button onClick={() => setShowNewCommentModal(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default CommentSection;
