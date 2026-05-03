import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import {
  getEqubTypes,
  createEqubType,
  updateEqubType,
  deleteEqubType,
  getEqubCategories,
  createEqubCategory,
  updateEqubCategory,
  deleteEqubCategory,
} from "../api/equbs";
import { EqubType, EqubCategory } from "../types";
import toast from "react-hot-toast";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"types" | "categories">("types");

  // Types
  const [types, setTypes] = useState<EqubType[]>([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<EqubType | null>(null);
  const [typeForm, setTypeForm] = useState({ name: "", description: "" });
  const [savingType, setSavingType] = useState(false);
  const [deleteTypeTarget, setDeleteTypeTarget] = useState<EqubType | null>(null);
  const [deletingType, setDeletingType] = useState(false);

  // Categories
  const [categories, setCategories] = useState<EqubCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<EqubCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    is_favorite: false,
    image: null as File | null,
  });
  const [savingCategory, setSavingCategory] = useState(false);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<EqubCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState(false);

  useEffect(() => {
    fetchTypes();
    fetchCategories();
  }, []);

  const fetchTypes = async () => {
    setTypesLoading(true);
    try {
      const data = await getEqubTypes();
      setTypes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setTypesLoading(false);
    }
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const data = await getEqubCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Types handlers
  const openCreateType = () => {
    setEditingType(null);
    setTypeForm({ name: "", description: "" });
    setTypeModalOpen(true);
  };

  const openEditType = (t: EqubType) => {
    setEditingType(t);
    setTypeForm({ name: t.name, description: t.description });
    setTypeModalOpen(true);
  };

  const handleSubmitType = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingType(true);
    try {
      if (editingType) {
        const updated = await updateEqubType(editingType.id, typeForm);
        setTypes((prev) => prev.map((t) => (t.id === editingType.id ? updated : t)));
        toast.success("Type updated.");
      } else {
        const created = await createEqubType(typeForm);
        setTypes((prev) => [created, ...prev]);
        toast.success("Type created.");
      }
      setTypeModalOpen(false);
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to save type.";
      toast.error(msg);
    } finally {
      setSavingType(false);
    }
  };

  const handleDeleteType = async () => {
    if (!deleteTypeTarget) return;
    setDeletingType(true);
    try {
      await deleteEqubType(deleteTypeTarget.id);
      setTypes((prev) => prev.filter((t) => t.id !== deleteTypeTarget.id));
      toast.success("Type deleted.");
      setDeleteTypeTarget(null);
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to delete type.";
      toast.error(msg);
    } finally {
      setDeletingType(false);
    }
  };

  // Categories handlers
  const openCreateCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", description: "", is_favorite: false, image: null });
    setCategoryModalOpen(true);
  };

  const openEditCategory = (c: EqubCategory) => {
    setEditingCategory(c);
    setCategoryForm({
      name: c.name,
      description: c.description,
      is_favorite: c.is_favorite,
      image: null,
    });
    setCategoryModalOpen(true);
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCategory(true);
    try {
      const formData = new FormData();
      formData.append("name", categoryForm.name);
      formData.append("description", categoryForm.description);
      formData.append("is_favorite", String(categoryForm.is_favorite));
      if (categoryForm.image) {
        formData.append("image", categoryForm.image);
      }

      if (editingCategory) {
        const updated = await updateEqubCategory(editingCategory.id, formData);
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? updated : c))
        );
        toast.success("Category updated.");
      } else {
        const created = await createEqubCategory(formData);
        setCategories((prev) => [created, ...prev]);
        toast.success("Category created.");
      }
      setCategoryModalOpen(false);
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to save category.";
      toast.error(msg);
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryTarget) return;
    setDeletingCategory(true);
    try {
      await deleteEqubCategory(deleteCategoryTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteCategoryTarget.id));
      toast.success("Category deleted.");
      setDeleteCategoryTarget(null);
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to delete category.";
      toast.error(msg);
    } finally {
      setDeletingCategory(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          <p className="text-muted-foreground">
            Manage Equb types and categories used across the platform.
          </p>
        </div>
        <button
          onClick={activeTab === "types" ? openCreateType : openCreateCategory}
          className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-secondary active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          {activeTab === "types" ? "Add Type" : "Add Category"}
        </button>
      </div>

      <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 w-fit">
        {(["types", "categories"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab === "types" ? "Equb Types" : "Categories"}
          </button>
        ))}
      </div>

      {activeTab === "types" &&
        (typesLoading ? (
          <Loader />
        ) : (
          <Card className="overflow-hidden !p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {types.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                        No types yet. Click "Add Type" to create one.
                      </td>
                    </tr>
                  ) : (
                    types.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-800">{t.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{t.description}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditType(t)}
                              className="rounded-lg bg-slate-50 px-3 py-1.5 text-md font-bold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                            >
                              <svg width="23" height="23" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteTypeTarget(t)}
                              className="rounded-lg bg-red-50 px-3 py-1.5 text-md font-bold text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1.5"
                            >
                              <svg width="23" height="23" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        ))}

      {activeTab === "categories" &&
        (categoriesLoading ? (
          <Loader />
        ) : categories.length === 0 ? (
          <Card>
            <div className="p-8 text-center text-slate-400">
              No categories yet. Click "Add Category" to create one.
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {categories.map((c) => (
              <Card key={c.id}>
                <div className="flex gap-4">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-20 w-20 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 truncate">{c.name}</h3>
                      {c.is_favorite && (
                        <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase whitespace-nowrap">
                          Favorite
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{c.description}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => openEditCategory(c)}
                        className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteCategoryTarget(c)}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ))}

      {/* Type create/edit modal */}
      <Modal
        isOpen={typeModalOpen}
        onClose={() => !savingType && setTypeModalOpen(false)}
        title={editingType ? "Edit Equb Type" : "Add Equb Type"}
        footer={
          <>
            <button
              type="button"
              disabled={savingType}
              onClick={() => setTypeModalOpen(false)}
              className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="type-form"
              disabled={savingType}
              className="bg-primary px-6 py-2 text-sm font-bold text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-secondary active:scale-95 disabled:opacity-50"
            >
              {savingType ? "Saving..." : editingType ? "Save Changes" : "Create"}
            </button>
          </>
        }
      >
        <form id="type-form" onSubmit={handleSubmitType} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
            <input
              required
              value={typeForm.name}
              onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
            <textarea
              required
              rows={3}
              value={typeForm.description}
              onChange={(e) => setTypeForm({ ...typeForm, description: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>
        </form>
      </Modal>

      {/* Type delete confirm */}
      <Modal
        isOpen={!!deleteTypeTarget}
        onClose={() => !deletingType && setDeleteTypeTarget(null)}
        title="Delete Equb Type"
        footer={
          <>
            <button
              disabled={deletingType}
              onClick={() => setDeleteTypeTarget(null)}
              className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={deletingType}
              onClick={handleDeleteType}
              className="bg-red-500 px-6 py-2 text-sm font-bold text-white rounded-xl shadow-lg shadow-red-200 hover:bg-red-600 active:scale-95 disabled:opacity-50"
            >
              {deletingType ? "Deleting..." : "Delete"}
            </button>
          </>
        }
      >
        <p className="text-slate-600 leading-relaxed">
          Are you sure you want to delete{" "}
          <strong className="text-slate-900">{deleteTypeTarget?.name}</strong>? This action cannot be undone.
        </p>
      </Modal>

      {/* Category create/edit modal */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => !savingCategory && setCategoryModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Add Category"}
        footer={
          <>
            <button
              type="button"
              disabled={savingCategory}
              onClick={() => setCategoryModalOpen(false)}
              className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="category-form"
              disabled={savingCategory}
              className="bg-primary px-6 py-2 text-sm font-bold text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-secondary active:scale-95 disabled:opacity-50"
            >
              {savingCategory ? "Saving..." : editingCategory ? "Save Changes" : "Create"}
            </button>
          </>
        }
      >
        <form id="category-form" onSubmit={handleSubmitCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
            <input
              required
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
            <textarea
              required
              rows={3}
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_favorite"
              checked={categoryForm.is_favorite}
              onChange={(e) => setCategoryForm({ ...categoryForm, is_favorite: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
            />
            <label htmlFor="is_favorite" className="text-sm font-medium text-slate-700">
              Mark as favorite
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Image {editingCategory ? "(leave empty to keep current)" : "(optional)"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, image: e.target.files?.[0] || null })
              }
              className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-bold file:text-slate-700 hover:file:bg-slate-200"
            />
            {editingCategory?.image && !categoryForm.image && (
              <p className="text-xs text-slate-500 mt-2">Current image will be kept.</p>
            )}
          </div>
        </form>
      </Modal>

      {/* Category delete confirm */}
      <Modal
        isOpen={!!deleteCategoryTarget}
        onClose={() => !deletingCategory && setDeleteCategoryTarget(null)}
        title="Delete Category"
        footer={
          <>
            <button
              disabled={deletingCategory}
              onClick={() => setDeleteCategoryTarget(null)}
              className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={deletingCategory}
              onClick={handleDeleteCategory}
              className="bg-red-500 px-6 py-2 text-sm font-bold text-white rounded-xl shadow-lg shadow-red-200 hover:bg-red-600 active:scale-95 disabled:opacity-50"
            >
              {deletingCategory ? "Deleting..." : "Delete"}
            </button>
          </>
        }
      >
        <p className="text-slate-600 leading-relaxed">
          Are you sure you want to delete{" "}
          <strong className="text-slate-900">{deleteCategoryTarget?.name}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default Settings;
