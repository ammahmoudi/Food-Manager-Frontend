'use client';

import { FC } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { Food } from '../interfaces/Food';
import FoodForm from './FoodForm';

interface FoodModalProps {
  visible: boolean;
  onClose: () => void;
  initialData: Food|null;
  isEditMode: boolean;
  onSave: (food: Food) => void;
  onDelete: (foodId: number) => void;
}

const FoodModal: FC<FoodModalProps> = ({ visible, onClose, initialData, isEditMode, onSave, onDelete }) => {
  return (
    <Modal isOpen={visible} onOpenChange={onClose} size='sm' scrollBehavior='inside'>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <p>{isEditMode ? 'Edit Food' : 'Create Food'}</p>
        </ModalHeader>
        <ModalBody>
          <FoodForm
            initialData={initialData}
            isEditMode={isEditMode}
            onSave={(food) => {
              onSave(food);
              onClose();
            }}
            onDelete={(foodId) => {
              onDelete(foodId);
              onClose();
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FoodModal;
