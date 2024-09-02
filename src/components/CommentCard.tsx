// components/CommentCard.tsx
import React, { useState } from "react";
import { Card, CardBody, Button, Modal, ModalBody, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import { format } from "date-fns-jalali";
import UserChip from "@/components/UserChip";
import MealChip from '@/components/MealChip'
import { Comment} from "@/interfaces/Comment";
import {Meal} from '@/interfaces/Meal'
import{User} from '@/interfaces/User'
import {Food} from '@/interfaces/Food'
import { deleteCommentForMeal, updateCommentForMeal } from "@/services/api";

interface CommentCardProps {
    comment: Comment;
    onDelete: (commentId: number) => void;
    onUpdate: (comment: Comment) => void;
    isAdmin: boolean;
    currentUserId: number; // ID of the currently logged-in user
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, onDelete, onUpdate, isAdmin, currentUserId }) => {
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
            <Card key={comment.id} className="mb-6">
                <CardBody>
                    <div className="flex mb-2 items-center gap-4">
                        <div className="flex flex-col items-left">
                            <p className="text-md text-medium mb-2">{comment.text}</p>
                            <span className="inline-flex items-baseline gap-1">
                                <UserChip
                                    userName={comment.user.full_name}
                                    userAvatar={comment.user.user_image as string}
                                    userHandle={comment.user.full_name}
                                    bio="Full-stack developer, @getnextui lover she/her 🎉" // This could be dynamic if available
                                    following={100} // Example values
                                    followers={2500} // Example values
                                />
                                on
                                <MealChip
                                    mealName={comment.meal.food?.name ?? "a food"}
                                    mealDate={format(new Date(comment.meal.date), "yyyy/MM/dd")}
                                    mealPicture={
                                        (comment.meal.food?.image as string) ?? "images/food-placeholder.jpg"
                                    }
                                    foodDescription={comment.meal.food?.description ?? "A delicious meal"}
                                    rating={comment.meal.avg_rate ?? 0} // Display average rating
                                    onDelete={()=>{}}
                                />
                                at {format(new Date(comment.createdAt), "yyyy/MM/dd")}
                            </span>
                        </div>
                        {(isAdmin || comment.user.id === currentUserId) && (
                            <div className="flex gap-2">
                                <Button color="primary" size="sm" onClick={handleEdit}>
                                    Edit
                                </Button>
                                <Button color="danger" size="sm" onClick={handleDelete}>
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>

            {/* Edit Modal */}
            <Modal isOpen={editModalVisible} onClose={() => setEditModalVisible(false)}>
                <ModalHeader>Edit Comment</ModalHeader>
                <ModalBody>
                    <Textarea
                        label="Comment"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleUpdateComment}>Update</Button>
                    <Button color="secondary" onClick={() => setEditModalVisible(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
                <ModalHeader>Delete Comment</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete this comment?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleConfirmDelete}>Delete</Button>
                    <Button color="secondary" onClick={() => setDeleteModalVisible(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default CommentCard;
