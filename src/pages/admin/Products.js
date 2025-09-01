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
  faImage,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import AdminLayout from "../../layouts/AdminLayout";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [imageManagementProduct, setImageManagementProduct] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    gst: "",
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

  // NEW: Function to fetch a single product (used to refresh modal after updates)
  const fetchSingleProduct = async (productId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.product;
    } catch (err) {
      console.error('Failed to fetch single product:', err);
      setError('Failed to refresh product data');
      return null;
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
  const file = e.target.files[0];
  if (file) {
    setImages((prev) => [...prev, file]); // append instead of overwrite
  }
  e.target.value = ""; // reset so user can select again
};


  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
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

      // Append each image file
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      // Append video if exists
      if (video) {
        formDataToSend.append("video", video);
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
    features: product.features || [],
  });

  // Preload media
  setImages(product.images || []);
  setVideo(product.video || null);

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
      features: [],
    });
    setFormErrors({});
    setImages([]);
    setVideo(null);
  };

  const handleImageUpdate = async (productId, imageIndex, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `/api/products/admin/products/${productId}/image/${imageIndex}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // UPDATED: Refresh modal state with updated product data
        const updatedProduct = await fetchSingleProduct(productId);
        if (updatedProduct) {
          setImageManagementProduct(updatedProduct);
        }
        fetchProducts(); // Also refresh the main list
      }
    } catch (error) {
      console.error('Failed to update image:', error);
      setError('Failed to update image');
    }
  };

  const handleImageRemove = async (productId, imageIndex) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(
        `/api/products/admin/products/${productId}/image/${imageIndex}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // UPDATED: Refresh modal state with updated product data
        const updatedProduct = await fetchSingleProduct(productId);
        if (updatedProduct) {
          setImageManagementProduct(updatedProduct);
        }
        fetchProducts(); // Also refresh the main list
      }
    } catch (error) {
      console.error('Failed to remove image:', error);
      setError('Failed to remove image');
    }
  };

  // NEW: Handle video update
  const handleVideoUpdate = async (productId, videoFile) => {
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `/api/products/admin/products/${productId}/video`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // Refresh modal state with updated product data
        const updatedProduct = await fetchSingleProduct(productId);
        if (updatedProduct) {
          setImageManagementProduct(updatedProduct);
        }
        fetchProducts(); // Also refresh the main list
      }
    } catch (error) {
      console.error('Failed to update video:', error);
      setError('Failed to update video');
    }
  };

  // NEW: Handle video remove
  const handleVideoRemove = async (productId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(
        `/api/products/admin/products/${productId}/video`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // Refresh modal state with updated product data
        const updatedProduct = await fetchSingleProduct(productId);
        if (updatedProduct) {
          setImageManagementProduct(updatedProduct);
        }
        fetchProducts(); // Also refresh the main list
      }
    } catch (error) {
      console.error('Failed to remove video:', error);
      setError('Failed to remove video');
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  const openImageManagement = (product) => {
    setImageManagementProduct(product);
    setShowImageModal(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <Container className="py-5">
          <div className="text-center">
            <Spinner animation="border" role="status" className="text-primary" />
            <p className="mt-3">Loading products...</p>
          </div>
        </Container>
      </AdminLayout>
    );
  }

return (
  <AdminLayout>
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
                    <th>Media</th>
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
                        {product.images && product.images.length > 1 && (
                          <Badge bg="info" className="ms-1">
                            +{product.images.length - 1}
                          </Badge>
                        )}
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
                        <strong className="text-primary">₹{product.price}</strong>
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
                          {product.video && (
                            <Badge bg="info">
                              <FontAwesomeIcon icon={faVideo} className="me-1" />
                              Video
                            </Badge>
                          )}
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => openImageManagement(product)}
                          >
                            <FontAwesomeIcon icon={faImage} />
                          </Button>
                        </div>
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

            {/* Product Images Upload + Preview */}
          <Form.Group className="mb-3">
  <Form.Label>Product Images (Max 5)</Form.Label>
  <Form.Control
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    name="images"
  />
  <Form.Text className="text-muted">
    {editingProduct
      ? "Select new images to replace existing ones"
      : "Select images one by one (max 5)"}
  </Form.Text>
</Form.Group>


            {images.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mt-2">
                {images.map((img, index) => (
                  <div key={index} className="position-relative">
                    <img
                      src={typeof img === "string" ? img : URL.createObjectURL(img)}
                      alt="preview"
                      style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 4 }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0"
                      onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Product Video Upload + Preview */}
            <Form.Group className="mb-3 mt-3">
              <Form.Label>Product Video (Optional)</Form.Label>
              <Form.Control
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                name="video"
              />
              <Form.Text className="text-muted">
                {editingProduct && editingProduct.video
                  ? "Select a new video to replace the existing one"
                  : "Add a product video (optional)"}
              </Form.Text>
            </Form.Group>

            {video && (
              <div className="mt-2 position-relative">
                <video width="160" height="90" controls>
                  <source
                    src={typeof video === "string" ? video : URL.createObjectURL(video)}
                    type="video/mp4"
                  />
                </video>
                <Button
                  variant="danger"
                  size="sm"
                  className="position-absolute top-0 end-0"
                  onClick={() => setVideo(null)}
                >
                  ×
                </Button>
              </div>
            )}

            {/* Features */}
            <Form.Group className="mb-3 mt-3">
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
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {editingProduct ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  {editingProduct ? "Update Product" : "Add Product"}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Media Management Modal (Images + Video) */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Manage Media for {imageManagementProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {imageManagementProduct && (
            <>
              {/* Images Section */}
              <h5 className="mb-3">Images</h5>
              <Row>
                {imageManagementProduct.images?.map((image, index) => (
                  <Col md={4} key={index} className="mb-3">
                    <Card>
                      <Card.Img variant="top" src={image} />
                      <Card.Body className="p-2">
                        <div className="d-grid gap-1">
                          <label className="btn btn-sm btn-primary">
                            Replace
                            <input
                              type="file"
                              accept="image/*"
                              className="d-none"
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  handleImageUpdate(imageManagementProduct.id, index, e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleImageRemove(imageManagementProduct.id, index)}
                            disabled={imageManagementProduct.images.length <= 1}
                          >
                            Remove
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Video Section */}
              <h5 className="mt-4 mb-3">Video</h5>
              {imageManagementProduct.video ? (
                <Card>
                  <Card.Body>
                    <div className="text-center mb-3">
                      <FontAwesomeIcon icon={faVideo} size="3x" className="text-info" />
                      <p className="mt-2">
                        Current Video:{" "}
                        <a href={imageManagementProduct.video} target="_blank" rel="noopener noreferrer">
                          View Video
                        </a>
                      </p>
                    </div>
                    <div className="d-grid gap-2">
                      <label className="btn btn-primary">
                        Replace Video
                        <input
                          type="file"
                          accept="video/*"
                          className="d-none"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              handleVideoUpdate(imageManagementProduct.id, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleVideoRemove(imageManagementProduct.id)}
                      >
                        Remove Video
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ) : (
                <Alert variant="info">
                  No video uploaded. You can add one in the edit product modal or replace here.
                </Alert>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Close
          </Button>
        </Modal.Footer>
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
  </AdminLayout>
);
}

export default AdminProducts;