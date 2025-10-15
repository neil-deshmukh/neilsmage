"use client"

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  HiUpload,
  HiTrash,
  HiDownload,
  HiDuplicate,
  HiSearch,
} from "react-icons/hi";

export default function ImageGallery() {
  interface Image {
    id: string;
    path: string;
    name: string;
    size?: string;
    uploadedAt: string;
    url: string;
  }

  const [images, setImages] = useState<Image[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const supabase = createClient();
  
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

  const handleButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    // Check if the ref is defined and then simulate a click
    fileInputRef.current?.click();
  }, []);


  const filteredImages = images.filter((img) =>
    img.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, path: string) => {
    await supabase.from("user_images").delete().eq("id", id).select()
    await supabase.storage.from("user-images").remove([path])
    setImages(images.filter((img) => img.id !== id));
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      return;
    }

    const body = new FormData()
    body.append("file", selectedFile)
    
    const response = await fetch("http://localhost:3000/api/v1/images", {
      method: "POST",
      body,
    }).then(res => res.json())
    
    const { id, file_path, created_at } = response.data
    const created_at_date = new Date(created_at)
    console.log(response.data)
    const uploadedAt = created_at_date.toISOString().split("T")[0]

    const { data: res, error: err } = await supabase.storage.from("user-images").createSignedUrl(file_path, 4000)
    if (err || !res) {
      console.error(err)
      return
    }
    
    setImages((prev) => [...prev, {
      id,
      path: file_path,
      name: selectedFile.name,
      url: res.signedUrl,
      uploadedAt
    }])
  }

  const getAllImages = async () => {
    const { data, error } = await supabase.from("user_images").select()
    if (error) {
      console.error(error)
      return
    }
    return data
  }
  
  useEffect(() => {
    handleImageUpload()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile])

  useEffect(() => {
    let ignore = false

    const loadData = async () => {
      const data = await getAllImages()
      if (!data) {
        console.error("eerror");
        return;
      }
      const newImages = []
      for (const img of data) {
        const { data: res } = await supabase.storage
          .from("user-images")
          .createSignedUrl(img.file_path, 4000);
        if (!res) {
          console.error("no url");
          continue
        }

        const uploadedAt = new Date(img.created_at).toISOString().split("T")[0];

        newImages.push({
          id: img.id,
          path: img.file_path,
          name: img.file_name,
          url: res.signedUrl ? res.signedUrl : "#",
          uploadedAt,
        });
      }
      if (!ignore) {
        setImages(newImages);
      }
    }
    loadData()

    return () => {ignore = true}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

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
              <Image src={image.url} alt="image" width={150} height={150} />
            </div>

            {/* Image Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 truncate mb-1">
                {image.name}
              </h3>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{image.size ? image.size : "621KB"}</span>
                <span>{image.uploadedAt}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    handleCopyUrl(image.url)
                    alert("Copied (The link is temporary and will expire soon)")
                  }}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                >
                  <HiDuplicate className="w-4 h-4 mr-1" />
                  Copy URL
                </button>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                  <HiDownload className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(image.id, image.path)}
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
