import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faDownload, 
    faFileInvoice, 
    faUser, 
    faEnvelope, 
    faPhone, 
    faMapMarkerAlt,
    faShoppingCart,
    faCreditCard,
    faCalendarAlt,
    faReceipt
} from '@fortawesome/free-solid-svg-icons';
import './Invoice.css';

const Invoice = ({ orderId, onClose }) => {
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetchInvoice();
    }, [orderId]);

    const fetchInvoice = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('userToken');
            const response = await fetch(`/api/invoices/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch invoice');
            }

            const data = await response.json();
            setInvoice(data.invoice);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadInvoice = async () => {
        try {
            setDownloading(true);
            const token = localStorage.getItem('userToken');
            const response = await fetch(`/api/invoices/${orderId}/download`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to download invoice');
            }

            // Create blob and download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${invoice.orderNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            setError('Failed to download invoice: ' + err.message);
        } finally {
            setDownloading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'pending': { variant: 'warning', text: 'Pending' },
            'confirmed': { variant: 'info', text: 'Confirmed' },
            'shipped': { variant: 'primary', text: 'Shipped' },
            'delivered': { variant: 'success', text: 'Delivered' },
            'cancelled': { variant: 'danger', text: 'Cancelled' }
        };
        
        const config = statusConfig[status] || { variant: 'secondary', text: status };
        return <Badge bg={config.variant}>{config.text}</Badge>;
    };

    if (loading) {
        return (
            <div className="invoice-loading">
                <Spinner animation="border" variant="success" />
                <p>Loading invoice...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="invoice-error">
                <FontAwesomeIcon icon={faReceipt} className="me-2" />
                Error: {error}
                <Button variant="outline-danger" size="sm" className="ms-3" onClick={onClose}>
                    Close
                </Button>
            </Alert>
        );
    }

    if (!invoice) {
        return (
            <Alert variant="warning">
                Invoice not found
                <Button variant="outline-warning" size="sm" className="ms-3" onClick={onClose}>
                    Close
                </Button>
            </Alert>
        );
    }

    return (
        <div className="invoice-container">
            <Card className="invoice-card">
                <Card.Header className="invoice-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h3 className="mb-0">
                                <FontAwesomeIcon icon={faFileInvoice} className="me-2" />
                                Invoice
                            </h3>
                            <p className="mb-0 text-muted">#{invoice.invoiceNumber}</p>
                        </div>
                        <div className="text-end">
                            <Button
                                variant="success"
                                onClick={downloadInvoice}
                                disabled={downloading}
                                className="download-btn"
                            >
                                <FontAwesomeIcon icon={faDownload} className="me-2" />
                                {downloading ? 'Downloading...' : 'Download PDF'}
                            </Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="invoice-body">
                    {/* Invoice Details */}
                    <Row className="mb-4">
                        <Col md={6}>
                            <h5 className="section-title">Invoice Details</h5>
                            <div className="invoice-detail-item">
                                <strong>Order Number:</strong> {invoice.orderNumber || 'N/A'}
                            </div>
                            <div className="invoice-detail-item">
                                <strong>Date:</strong> {formatDate(invoice.orderDate)}
                            </div>
                            <div className="invoice-detail-item">
                                <strong>Status:</strong> {getStatusBadge(invoice.status)}
                            </div>
                            <div className="invoice-detail-item">
                                <strong>Payment Method:</strong> {invoice.paymentMethod}
                            </div>
                        </Col>
                        <Col md={6}>
                            <h5 className="section-title">Customer Details</h5>
                            <div className="invoice-detail-item">
                                <FontAwesomeIcon icon={faUser} className="me-2 text-success" />
                                {invoice.customerName}
                            </div>
                            <div className="invoice-detail-item">
                                <FontAwesomeIcon icon={faEnvelope} className="me-2 text-success" />
                                {invoice.customerEmail}
                            </div>
                            <div className="invoice-detail-item">
                                <FontAwesomeIcon icon={faPhone} className="me-2 text-success" />
                                {invoice.customerPhone}
                            </div>
                        </Col>
                    </Row>

                    {/* Shipping Address */}
                    <Row className="mb-4">
                        <Col md={12}>
                            <h5 className="section-title">Shipping Address</h5>
                            <div className="invoice-detail-item">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-success" />
                                {invoice.shippingAddress.street}, {invoice.shippingAddress.city}, 
                                {invoice.shippingAddress.state} {invoice.shippingAddress.zipCode}
                            </div>
                        </Col>
                    </Row>

                    {/* Order Items */}
                    <Row>
                        <Col md={12}>
                            <h5 className="section-title">Item Details</h5>
                            <div className="table-responsive">
                                <table className="table table-striped invoice-items-table">
                                    <thead>
                                        <tr>
                                            <th>Sl No</th>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Unit Price</th>
                                            {invoice.discountAmount > 0 && <th>Discount</th>}
                                            {/* <th>Taxable Value</th> */}
                                            {/* {invoice.sgstAmount > 0 && <th>SGST</th>}
                                            {invoice.cgstAmount > 0 && <th>CGST</th>} */}
                                            {invoice.gstAmount > 0 && <th> Total GST</th>}
                                            <th>Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.items.map((item, index) => {
                                            // Calculate prorated values based on order totals
                                            const itemAmount = item.quantity * item.unitPrice;
                                            const proratedDiscount = invoice.subtotal > 0 ? (itemAmount / invoice.subtotal) * invoice.discountAmount : 0;
                                            const taxable = itemAmount - proratedDiscount;
                                            const proratedSgst = invoice.sgstAmount > 0 ? (taxable / (invoice.subtotal - invoice.discountAmount)) * invoice.sgstAmount : 0;
                                            const proratedCgst = invoice.cgstAmount > 0 ? (taxable / (invoice.subtotal - invoice.discountAmount)) * invoice.cgstAmount : 0;
                                            const proratedGst = invoice.gstAmount > 0 ? (taxable / (invoice.subtotal - invoice.discountAmount)) * invoice.gstAmount : 0;
                                            const itemTotal = taxable + proratedSgst + proratedCgst + proratedGst;

                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className="product-info">
                                                            <img 
                                                                src={item.productImage || '/images/placeholder.jpg'} 
                                                                alt={item.productName}
                                                                className="product-image"
                                                            />
                                                            <span className="product-name">{item.productName}</span>
                                                        </div>
                                                    </td>
                                                    <td>{item.quantity}</td>
                                                    <td>₹{item.unitPrice.toFixed(2)}</td>
                                                    {invoice.discountAmount > 0 && <td>₹{proratedDiscount.toFixed(2)}</td>}
                                                    {/* <td>₹{taxable.toFixed(2)}</td> */}
                                                    {/* {invoice.sgstAmount > 0 && <td>₹{proratedSgst.toFixed(2)}</td>}
                                                    {invoice.cgstAmount > 0 && <td>₹{proratedCgst.toFixed(2)}</td>} */}
                                                    {invoice.gstAmount > 0 && <td>₹{proratedGst.toFixed(2)}</td>}
                                                    <td>₹{itemTotal.toFixed(2)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>

                    {/* Order Summary */}
                    <Row>
                        <Col md={6} className="ms-auto">
                            <div className="order-summary">
                                <h5 className="section-title">Order Summary</h5>
                                <div className="summary-row">
                                    <span>Subtotal:</span>
                                    <span>₹{invoice.subtotal.toFixed(2)}</span>
                                </div>
                                {invoice.discountAmount > 0 && (
                                    <div className="summary-row discount">
                                        <span>Discount:</span>
                                        <span>-₹{invoice.discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {invoice.sgstAmount > 0 && (
                                    <div className="summary-row">
                                        <span>SGST:</span>
                                        <span>₹{invoice.sgstAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {invoice.cgstAmount > 0 && (
                                    <div className="summary-row">
                                        <span>CGST:</span>
                                        <span>₹{invoice.cgstAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {invoice.gstAmount > 0 && (
                                    <div className="summary-row">
                                        <span> Total GST:</span>
                                        <span>₹{invoice.gstAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {invoice.deliveryCharge > 0 && (
                                    <div className="summary-row">
                                        <span>Delivery Charge:</span>
                                        <span>₹{invoice.deliveryCharge.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="summary-row total">
                                    <span><strong>Total Amount:</strong></span>
                                    <span><strong>₹{invoice.finalAmount.toFixed(2)}</strong></span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>

                <Card.Footer className="invoice-footer">
                    <div className="text-center">
                        <p className="mb-1">
                            <strong>Thank you for choosing Ayur4Life!</strong>
                        </p>
                        <p className="mb-0 text-muted">
                            For any questions, please contact us at info@ayur4life.com
                        </p>
                    </div>
                </Card.Footer>
            </Card>
        </div>
    );
};

export default Invoice;