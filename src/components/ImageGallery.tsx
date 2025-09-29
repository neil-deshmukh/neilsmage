"use client"

import { createClient } from "@/utils/supabase/client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  HiUpload,
  HiTrash,
  HiDownload,
  HiDuplicate,
  HiSearch,
} from "react-icons/hi";

export default function ImageGallery() {
  const [images, setImages] = useState([
    {
      id: 1,
      name: "product-image.jpg",
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      size: "2.4 MB",
      uploadedAt: "2025-09-28",
    },
    {
      id: 2,
      name: "banner-hero.png",
      url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      size: "1.8 MB",
      uploadedAt: "2025-09-27",
    },
    {
      id: 3,
      name: "logo-design.svg",
      url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
      size: "456 KB",
      uploadedAt: "2025-09-26",
    },
    {
      id: 4,
      name: "user-avatar.jpg",
      url: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400",
      size: "890 KB",
      uploadedAt: "2025-09-25",
    },
    {
      id: 5,
      name: "background.jpg",
      url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      size: "3.2 MB",
      uploadedAt: "2025-09-24",
    },
    {
      id: 6,
      name: "thumbnail.png",
      url: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400",
      size: "1.1 MB",
      uploadedAt: "2025-09-23",
    },
  ]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // 2. Ref to access the hidden file input element directly.
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    // Get the first file from the files list (if one was selected)
    const file = event.target.files ? event.target.files[0] : null;
    
    // Update the state with the selected file object.
    setSelectedFile(file);

    if (file) {
      console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size, 'bytes');
    }
  }, []);

  /**
   * Triggers the click event on the hidden file input when the main button is pressed.
   */
  const handleButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    // Check if the ref is defined and then simulate a click
    fileInputRef.current?.click();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
  };
  
  useEffect(() => {
    handleImageUpload()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile])
  
  const handleImageUpload = async () => {
    if (!selectedFile) {
      return;
    }
    const supabase = createClient()
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    const filePath = `${userId}/${Date.now()}-${selectedFile.name}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase.storage
      .from("user-images")
      .upload(filePath, selectedFile, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) {
      console.error(error)
      return
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await supabase
        .from("user_images")
        .insert({
            user_id: userId,
            file_path: filePath,
            file_name: selectedFile.name,
            file_size: selectedFile.size,
            mime_type: selectedFile.type,
        });
      if (error) {
        console.error(error)
      }
    }
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Image Gallery</h2>
          <p className="text-gray-600 mt-1">{images.length} images total</p>
        </div>
        <button
          onClick={handleButtonClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <HiUpload className="w-5 h-5 mr-2" />
          Upload New
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*" // Restrict file selection to image types
        className="hidden" // Keep it completely hidden from view
      />

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <HiSearch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image Preview */}
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Image Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 truncate mb-1">
                {image.name}
              </h3>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{image.size}</span>
                <span>{image.uploadedAt}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopyUrl(image.url)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                >
                  <HiDuplicate className="w-4 h-4 mr-1" />
                  Copy URL
                </button>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                  <HiDownload className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <HiTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <HiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No images found
          </h3>
          <p className="text-gray-500">Try adjusting your search query</p>
        </div>
      )}
    </div>
  );
}
