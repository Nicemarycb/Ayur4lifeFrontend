import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Spinner,
  Badge,
  Modal,
  Table,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faSave,
  faTimes,
  faBoxes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    gst: "",
    images: [],
    features: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const { adminUser } = useAdminAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('adminToken');
      const response = await axios.get("/api/products/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(response.data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = "Product name is required";
    if (!formData.description?.trim())
      errors.description = "Description is required";
    if (!formData.price || formData.price <= 0)
      errors.price = "Valid price is required";
    if (!formData.category?.trim()) errors.category = "Category is required";
    if (!formData.stock || formData.stock < 0)
      errors.stock = "Valid stock is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("gst", formData.gst || 0);
      formDataToSend.append("features", JSON.stringify(formData.features || []));

      if (formData.images && formData.images.length > 0) {
        Array.from(formData.images).forEach((file) => {
          formDataToSend.append("images", file);
        });
      }

      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      };

      if (editingProduct) {
        await axios.put(
          `/api/products/admin/products/${editingProduct.id}`,
          formDataToSend,
          config
        );
      } else {
        await axios.post("/api/products/admin/products", formDataToSend, config);
      }

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      setError(err.response?.data?.error || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      stock: product.stock || "",
      gst: product.gst || "",
      images: [],
      features: product.features || [],
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/products/admin/products/${deletingProduct.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowDeleteModal(false);
      setDeletingProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      gst: "",
      images: [],
      features: [],
    });
    setFormErrors({});
  };

  const openAddModal = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" className="text-primary" />
          <p className="mt-3">Loading products...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-4">
        <Row className="align-items-center">
          <Col>
            <h1 className="mb-2">Manage Products</h1>
            <p className="text-muted mb-0">
              Total Products: {products?.length || 0}
            </p>
          </Col>
          <Col xs="auto">
            <Button variant="primary" onClick={openAddModal}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add New Product
            </Button>
          </Col>
        </Row>
      </div>

      {error && (
        <Alert
          variant="danger"
          className="mb-4"
          dismissible
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <Card>
        <Card.Body>
          {products.length === 0 ? (
            <div className="text-center py-5">
              <FontAwesomeIcon
                icon={faBoxes}
                size="4x"
                className="text-muted mb-3"
              />
              <h4>No products yet</h4>
              <p className="text-muted">Start by adding your first product.</p>
              <Button variant="primary" onClick={openAddModal}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Product
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.images?.[0] || "/placeholder.jpg"}
                          alt={product.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                          className="rounded"
                        />
                      </td>
                      <td>
                        <strong>{product.name}</strong>
                        <br />
                        <small className="text-muted">
                          {product.description?.substring(0, 50)}...
                        </small>
                      </td>
                      <td>
                        <Badge bg="secondary">{product.category}</Badge>
                      </td>
                      <td>
                        <strong className="text-primary">
                          ₹{product.price}
                        </strong>
                      </td>
                      <td>
                        <span
                          className={
                            product.stock > 10
                              ? "text-success"
                              : product.stock > 0
                              ? "text-warning"
                              : "text-danger"
                          }
                        >
                          {product.stock} units
                        </span>
                      </td>
                      <td>
                        {product.stock > 0 ? (
                          <Badge bg="success">In Stock</Badge>
                        ) : (
                          <Badge bg="danger">Out of Stock</Badge>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              setDeletingProduct(product);
                              setShowDeleteModal(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData?.name || ""}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={formData?.category || ""}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.category}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData?.description || ""}
                onChange={handleInputChange}
                isInvalid={!!formErrors.description}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData?.price || ""}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock *</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData?.stock || ""}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.stock}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.stock}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>GST (%)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="gst"
                    value={formData?.gst || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Product Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Features</Form.Label>
              {formData.features.map((feature, index) => (
                <div key={index} className="d-flex gap-2 mb-2">
                  <Form.Control
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                  />
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline-secondary"
                size="sm"
                onClick={addFeature}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Feature
              </Button>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              <FontAwesomeIcon icon={faSave} className="me-2" />
              {editingProduct ? "Update Product" : "Add Product"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{deletingProduct?.name}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} className="me-2" />
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminProducts;
