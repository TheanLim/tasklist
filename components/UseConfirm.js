import { useEffect, useRef, useState } from 'react';

const useConfirm = (title, message) => {
    const [promise, setPromise] = useState(null);
    const confirmButtonRef = useRef(null);
    const cancelButtonRef = useRef(null);

    const confirm = () => new Promise((resolve) => {
        setPromise({ resolve });
    });

    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };

    useEffect(() => {
        // Set initial focus to "Yes" button when the modal opens
        if (promise && confirmButtonRef.current) {
            confirmButtonRef.current.focus();
        }
    }, [promise]);

    const handleKeyDown = (event) => {
        if (event.key === 'Tab') {
            if (document.activeElement === confirmButtonRef.current) {
                event.preventDefault();
                cancelButtonRef.current.focus();
            } else {
                event.preventDefault();
                confirmButtonRef.current.focus();
            }
        } else if (event.key === 'Enter') {
            // If Enter is pressed, confirm or cancel based on the focused button
            if (document.activeElement === confirmButtonRef.current) {
                handleConfirm();
            } else if (document.activeElement === cancelButtonRef.current) {
                handleCancel();
            }
        }
    };

    const ConfirmationDialog = () => (
        <div
            className={`modal ${promise ? 'modal-open' : ''}`}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
        >
            <div className="modal-box">
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4">{message}</p>
                <div className="modal-action">
                    <button
                        className="btn btn-sm btn-success"
                        onClick={handleConfirm}
                        ref={confirmButtonRef}
                    >
                        Yes
                    </button>
                    <button
                        className="btn btn-sm btn-error"
                        onClick={handleCancel}
                        ref={cancelButtonRef}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    return [ConfirmationDialog, confirm];
};

export default useConfirm;