import React, { useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Textarea,
} from '@nextui-org/react';
import { toast } from 'sonner';
import { sendBugReport } from '@/services/api';

interface BugReportModalProps {
    visible: boolean;
    onClose: () => void;
}

const BugReportModal: React.FC<BugReportModalProps> = ({ visible, onClose }) => {
    const [report, setReport] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Capture the current page URL
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleSubmit = async () => {
        if (!report.trim()) {
            toast.error('Please write the issue before submitting!');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await sendBugReport({
                description:report,
                reported_url:pageUrl,
            });

            if (response.status === 201) {
                toast.success('Feedback submitted successfully!');
                setReport('');
                onClose();
            } else {
                toast.error('Failed to submit the feedback.');
            }
        } catch (error) {
            console.error('Error submitting Feedback:', error);
            toast.error('An error occurred while submitting the feedback.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={visible} onClose={onClose}>
            <ModalContent>
                <ModalHeader>
                    Submit Bug Report
                </ModalHeader>

                <ModalBody>
                    <Textarea
                        placeholder="Please describe the issue you're experiencing"
                        fullWidth
                        rows={5}
                        value={report}
                        onChange={(e) => setReport(e.target.value)}
                    />
                </ModalBody>

                <ModalFooter>
                    <Button
                        color="primary"
                        onPress={handleSubmit}
                        isDisabled={isSubmitting}
                        isLoading={isSubmitting}
                    >
                        Submit Report
                    </Button>

                    <Button color="secondary" onPress={onClose} isDisabled={isSubmitting}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default BugReportModal;
