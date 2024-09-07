import React from 'react';

function BlockDetails({ block }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Block Details</h2>
      <div className="border-b border-gray-200 pb-4 mb-4">
        <p className="text-lg font-medium text-gray-600">
          <span className="font-bold text-gray-900">ID:</span> {block.id}
        </p>
        <p className="text-lg font-medium text-gray-600 mt-1">
          <span className="font-bold text-gray-900">Content:</span> {block.content}
        </p>
        <p className="text-lg font-medium text-gray-600 mt-1">
          <span className="font-bold text-gray-900">Priority:</span> {block.priority}
        </p>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Transition History</h3>
      <ul className="list-disc list-inside pl-5 space-y-2">
        {block.history && block.history.length > 0 ? (
          block.history.map((entry, index) => (
            <li key={index} className="text-gray-700">
              <p className="text-sm">
                <span className="font-medium">Moved from:</span> {entry.fromLane} &nbsp; 
                <span className="font-medium">To:</span> {entry.toLane} &nbsp; 
                <span className="font-medium">At:</span> {new Date(entry.timestamp).toLocaleString()}
              </p>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No history available for this block.</p>
        )}
      </ul>
    </div>
  );
}

export default BlockDetails;
