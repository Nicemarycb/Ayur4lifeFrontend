import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import Invoice from './Invoice';

const InvoiceButton = ({ orderId, orderNumber, variant = 'outline-success', size = 'sm' }) => {
    const [showInvoice, setShowInvoice] = useState(false);

    const handleShowInvoice = () => setShowInvoice(true);
    const handleCloseInvoice = () => setShowInvoice(false);

    return (
        <>
            <Button
                variant={variant}
                size={size}
                onClick={handleShowInvoice}
                className="invoice-btn"
                title={`View Invoice for Order ${orderNumber}`}
            >
                <FontAwesomeIcon icon={faFileInvoice} className="me-1" />
                Invoice
            </Button>

            <Modal
                show={showInvoice}
                onHide={handleCloseInvoice}
                size="xl"
                centered
                className="invoice-modal"
            >
                <Modal.Header closeButton className="invoice-modal-header">
                    <Modal.Title>
                        <FontAwesomeIcon icon={faFileInvoice} className="me-2" />
                        Invoice - Order #{orderNumber}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    <Invoice orderId={orderId} onClose={handleCloseInvoice} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default InvoiceButton;
