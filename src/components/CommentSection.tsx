// components/CommentSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Input, Button, Textarea } from "@nextui-org/react";
import {
  getUserCommentsForMeal,
  submitCommentForMeal,
  updateCommentForMeal,
} from "../services/api";

interface CommentSectionProps {
  mealId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ mealId }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const response = await getUserCommentsForMeal(mealId);
        setComments(response);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    fetchUserComments();
  }, [mealId]);

  const handleCommentSubmit = async () => {
    setLoading(true);
    try {
      if (editMode && editingCommentId) {
        await updateCommentForMeal(editingCommentId, newComment);
        setEditMode(false);
        setEditingCommentId(null);
      } else {
        await submitCommentForMeal(mealId, newComment);
      }
      setNewComment("");
      const response = await getUserCommentsForMeal(mealId);
      setComments(response);
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = (comment: any) => {
    setEditMode(true);
    setEditingCommentId(comment.id);
    setNewComment(comment.text);
  };

  return (
    <div className="comment-section">
      <h3 className="text-xl font-semibold mb-2">Your Comments</h3>
      <div className="mb-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="mb-4 p-4 border rounded-lg">
              <p>{comment.text}</p>
              <Button
                color="primary"
                variant="light"
                size="sm"
                className="mt-2"
                onPress={() => handleEditComment(comment)}
              >
                Edit
              </Button>
            </div>
          ))
        ) : (
          <p>No comments yet. Add one below!</p>
        )}
      </div>
      <Textarea
        label="Your Comment"
        placeholder="Write your comment here..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        fullWidth
        className="mb-4"
      />
      <Button
        color="primary"
        onPress={handleCommentSubmit}
        isDisabled={!newComment}
        isLoading={loading}
      >
        {editMode ? "Update Comment" : "Add Comment"}
      </Button>
    </div>
  );
};

export default CommentSection;
