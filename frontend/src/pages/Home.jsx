import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Upload, Search, FolderTree } from "lucide-react";

const Home = () => {
  const [query, setQuery] = useState("");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus({ success: false, message: "No file selected" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setUploadStatus(result);
      setFile(null);

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = '';
      }

      if (result.success) {
        setTimeout(() => setUploadStatus(null), 5000);
      }
    } catch (error) {
      setUploadStatus({
        success: false,
        message: "Failed to upload file. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setSearchResult({ success: false, message: "Enter a file name to search" });
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/search?key=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSearchResult(result);
    } catch (error) {
      setSearchResult({
        success: false,
        message: "Error searching for the file. Please try again.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-12 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">File Manager</h1>

      {/* Search Section */}
      <div className="mb-8 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Search size={20} />
          Search for a File
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter file name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>

        {searchResult && (
          <div className={`p-4 rounded-lg ${searchResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {searchResult.success ? (
              <div className="space-y-2">
                <h3 className="text-green-600 font-semibold">File Found:</h3>
                <p className="text-gray-700">
                  <strong>URL:</strong>{' '}
                  <a 
                    href={searchResult.data?.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 break-all"
                  >
                    {searchResult.data?.url}
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Size:</strong> {(searchResult.data?.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <p className="text-red-600">{searchResult.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Upload size={20} />
          Upload a File
        </h2>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          accept="image/*,video/*"
        />
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>

        {uploadStatus && (
          <div className={`p-4 rounded-lg ${uploadStatus.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={uploadStatus.success ? "text-green-600" : "text-red-600"}>
              {uploadStatus.message}
            </p>
            {uploadStatus.success && uploadStatus.file && (
              <div className="mt-2">
                <p className="text-gray-700">
                  <strong>File URL:</strong>{' '}
                  <a 
                    href={uploadStatus.file.path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 break-all"
                  >
                    {uploadStatus.file.path}
                  </a>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Show Tree Button */}
      <div className="mt-8">
        <Link
          to="/show-tree"
          className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <FolderTree size={20} />
          Show Tree
        </Link>
      </div>
    </div>
  );
};

export default Home;
