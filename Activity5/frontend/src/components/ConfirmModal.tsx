import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import Button from './Button';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'danger'
}) => {
    useEffect(() => {
        if (isOpen) {
            gsap.fromTo(
                '.confirm-backdrop',
                { opacity: 0 },
                { opacity: 1, duration: 0.2 }
            );
            gsap.fromTo(
                '.confirm-content',
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.5)' }
            );
        }
    }, [isOpen]);

    const handleCancel = () => {
        gsap.to('.confirm-content', {
            opacity: 0,
            scale: 0.9,
            duration: 0.2,
            onComplete: onCancel
        });
        gsap.to('.confirm-backdrop', {
            opacity: 0,
            duration: 0.2
        });
    };

    const handleConfirm = () => {
        gsap.to('.confirm-content', {
            opacity: 0,
            scale: 0.9,
            duration: 0.2,
            onComplete: onConfirm
        });
        gsap.to('.confirm-backdrop', {
            opacity: 0,
            duration: 0.2
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="confirm-backdrop absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={handleCancel}
            />

            <div className="confirm-content relative bg-[#1a1a1a] rounded-lg shadow-2xl w-full max-w-md border border-gray-800">
                <div className="p-6">
                    {/* Icon */}
                    <div className="flex items-center justify-center mb-4">
                        {variant === 'danger' ? (
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-200 mb-3 text-center">
                        {title}
                    </h2>

                    {/* Message */}
                    <p className="text-gray-400 text-center mb-6">
                        {message}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCancel}
                            className="flex-1"
                        >
                            {cancelText}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirm}
                            className={`flex-1 ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'}`}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
