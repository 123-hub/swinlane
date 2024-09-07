// DraggableBlock.js

import React from "react";
import PropTypes from "prop-types";
import { useDrag } from "react-dnd";

function DraggableBlock({ block, laneId, onClick, className }) {
  const [{ isDragging }, drag] = useDrag({
    type: "BLOCK",
    item: { block, laneId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      onClick={onClick}
      className={`${className} ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <p className="font-medium text-gray-800">{block.content}</p>
      <p className="text-sm text-gray-600">Priority: {block.priority}</p>
    </div>
  );
}

DraggableBlock.propTypes = {
  block: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
  }).isRequired,
  laneId: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default DraggableBlock;
