// Filter.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { setFilter } from '../redux/swimlaneSlice';

function Filter() {
  const dispatch = useDispatch();
  const handleChange = (e) => {
    dispatch(setFilter(e.target.value));
  };

  return (
    <div className="filter mb-4 flex items-center">
      <label htmlFor="filter" className="mr-2 font-semibold text-gray-700">
        Filter Tasks:
      </label>
      <input
        type="text"
        id="filter"
        onChange={handleChange}
        placeholder="Enter Task Name"
        className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

export default Filter;
