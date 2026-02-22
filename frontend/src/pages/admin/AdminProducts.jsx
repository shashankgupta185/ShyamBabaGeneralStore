import React, { useState, useEffect } from "react";
import {
  getAdminProductsAPI,
  deleteAdminProductAPI,
  addAdminProductAPI,
  updateAdminProductAPI,
  getAdminCategoriesAPI,
} from "../../services/api";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import { toast } from "react-toastify";
import Utils from "../../utils/Utils";
import Field from "../../widget/fields/Fields";

const emptyForm = {
  name: "",
  category_id: "",
  brand: "",
  weight: "",
  price: "",
  discount_price: "",
  stock: "",
  rating: "",
  description: "",
  is_featured: false,
  is_active: true,
  images: "",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(""); // image preview
  const fetchCategoriesData = async () => {
    try {
      const res = await getAdminCategoriesAPI();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (form?.images) {
      setPreview(form.images);
    }
  }, [form.images]);

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  useEffect(() => {
    if (!form.category_id) return;

    localStorage.setItem("catId", form.category_id);
    fetchData(form.category_id);
  }, [form.category_id]);

  useEffect(() => {
    const val = localStorage?.getItem("catId");
    setForm((prev) => ({
      ...prev,
      category_id: val,
    }));
  }, []);

  const fetchData = async () => {
    try {
      const val = form.category_id;
      const res = await getAdminProductsAPI(val);
      if (res.data.status === true) setProducts(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      category_id: product.category_id,
      brand: product.brand || "",
      weight: product.weight || "",
      price: product.price,
      discount_price: product.discount_price || "",
      stock: product.stock,
      rating: product.rating || "",
      description: product.description || "",
      is_featured: !!product.is_featured,
      is_active: !!product.is_active,
      images: product.images,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      debugger;
      const payload = { ...form };
      debugger;
      if (editing) {
        await updateAdminProductAPI(editing, payload);
        toast.success("Product updated");
      } else {
        await addAdminProductAPI(payload);
        toast.success("Product added");
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteAdminProductAPI(id);
      toast.success("Product deleted");
      fetchData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const toggleActive = async (product) => {
    try {
      await updateAdminProductAPI(product.id, {
        is_active: product.is_active ? 0 : 1,
      });
      fetchData();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
      </div>
    );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const base64String = reader.result;

      setForm((prev) => ({
        ...prev,
        images: base64String,
      }));

      setPreview(base64String);
    };
  };

  const handleChange = async (e) => {
    // debugger;
    const { name, value, type, checked } = e.target;

    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  return (
    <div className="admin-products">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products ({products.length})</h1>
        <button className="btn-primary" onClick={openAdd}>
          <FiPlus /> Add Product
        </button>
      </div>
      <div className="admin-search">
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="admin-search">
        <Field.Select
          label="Select Category"
          name="category_id"
          value={form.category_id || ""}
          onChange={handleChange}
          required
          options={
            Array.isArray(categories) && categories.length > 0
              ? categories.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))
              : []
          }
        />
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="product-cell">
                    <strong>{p.name}</strong>
                    <small>
                      {p.brand} • {p.weight}
                    </small>
                  </div>
                </td>
                <td>{p.category_name}</td>
                <td>
                  {p.discount_price ? (
                    <>
                      <span className="text-green">₹{p.discount_price}</span>{" "}
                      <s className="text-muted">₹{p.price}</s>
                    </>
                  ) : (
                    `₹${p.price}`
                  )}
                </td>
                <td>
                  <span
                    className={`stock-indicator ${p.stock < 10 ? "low" : "ok"}`}
                  >
                    {p.stock}
                  </span>
                </td>
                <td>⭐ {p.rating}</td>
                <td>
                  <button
                    className="toggle-btn"
                    onClick={() => toggleActive(p)}
                  >
                    {p.is_active ? (
                      <FiToggleRight className="text-green" />
                    ) : (
                      <FiToggleLeft className="text-muted" />
                    )}
                  </button>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="edit-btn" onClick={() => openEdit(p)}>
                      <FiEdit2 />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(p.id, p.name)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? "Edit Product" : "Add Product"}</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Weight</label>
                  <input
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                    placeholder="e.g. 500 g"
                  />
                </div>
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Discount Price</label>
                  <input
                    type="number"
                    name="discount_price"
                    value={form.discount_price}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Upload Image</label>

                  {preview && (
                    <center>
                      <div style={{ marginBottom: "10px" }}>
                        <img
                          src={preview}
                          alt="Preview"
                          style={{
                            // width: "150px",
                            // height: "150px",
                            padding:"20px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                          }}
                        />
                      </div>
                    </center>
                  )}

                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={form.is_featured}
                      onChange={handleChange}
                    />{" "}
                    Featured
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={form.is_active}
                      onChange={handleChange}
                    />{" "}
                    Active
                  </label>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editing ? "Update" : "Add"} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
