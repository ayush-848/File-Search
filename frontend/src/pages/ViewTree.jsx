"use client";
import React, { useEffect, useState } from "react";

const ViewTree = () => {
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/show-tree`);
        const data = await response.json();
        setTreeData(data.data); // Assuming the response structure is { data: ... }
      } catch (error) {
        console.error("Error fetching tree data:", error);
      }
    };

    fetchTree();
  }, []);

  // Function to render each node of the tree
  const renderTree = (node) => {
    if (!node) {
      return (
        <div className="ml-8 italic text-gray-400">
          Null
        </div>
      );
    }

    return (
      <div className="relative ml-8">
        {/* Node content */}
        <div className="inline-block p-3 bg-gray-200 rounded-lg shadow-md mb-3">
          <strong>{node.key}</strong>: {JSON.stringify(node.value)}

          {/* If value contains a URL, display it as a clickable link */}
          {node.value?.url && (
            <div>
              <a href={node.value.url} target="_blank" rel="noopener noreferrer">
                View File
              </a>
            </div>
          )}
        </div>

        {/* Left and right children */}
        <div className="mt-3">
          {node.left && (
            <div className="relative ml-6">
              {/* Left child line */}
              <div className="absolute top-1/2 left-[-1.5rem] w-8 border-t-2 border-gray-400"></div>
              <div>
                <strong>Left:</strong>
                {renderTree(node.left)}
              </div>
            </div>
          )}

          {node.right && (
            <div className="relative ml-6">
              {/* Right child line */}
              <div className="absolute top-1/2 right-[-1.5rem] w-8 border-t-2 border-gray-400"></div>
              <div>
                <strong>Right:</strong>
                {renderTree(node.right)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Binary Tree View</h1>
      {treeData ? renderTree(treeData) : <p className="text-center text-gray-600">Loading tree data...</p>}
    </div>
  );
};

export default ViewTree;
