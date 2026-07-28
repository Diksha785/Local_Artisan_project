import React, { useState } from 'react';
import { UploadCloud, X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export default function ImageUploader({ images = [], setImages }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      setUploadError('Maximum 5 images permitted per craft listing');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));

      const uploadedUrls = await api.uploadImages(formData);
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      setUploadError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-stone-800">
        Craft Images (Cloudinary Multi-Upload) <span className="text-terracotta-600">*</span>
      </label>

      {/* Upload Box */}
      <div className="relative border-2 border-dashed border-amber-300 hover:border-terracotta-500 rounded-2xl p-6 text-center bg-amber-50/50 hover:bg-amber-100/40 transition-colors cursor-pointer group">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading || images.length >= 5}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 bg-amber-100 rounded-full text-terracotta-600 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-800">
              {uploading ? 'Uploading to Cloudinary...' : 'Click or Drag images to upload'}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Supports JPG, PNG, WEBP up to 10MB (Max 5 photos)
            </p>
          </div>
        </div>
      </div>

      {uploadError && (
        <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
          {uploadError}
        </p>
      )}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-3 pt-2">
          {images.map((url, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-amber-200 shadow-sm bg-stone-100">
              <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 bg-terracotta-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
