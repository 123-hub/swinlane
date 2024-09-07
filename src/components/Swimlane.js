import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { moveBlock, selectFilteredLanes } from "../redux/swimlaneSlice";
import { useDrop } from "react-dnd";
import PropTypes from "prop-types";
import BlockModal from "./BlockModal";
import BlockDetails from "./BlockDetails";
import DraggableBlock from "./DraggableBlock";

function Swimlane() {
  const dispatch = useDispatch();
  const lanes = useSelector(selectFilteredLanes);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [draggedOverLaneId, setDraggedOverLaneId] = useState(null);

  const [{ isOver }, drop] = useDrop({
    accept: "BLOCK",
    drop: async (item, monitor) => {
      const targetLaneId = lanes.find(
        (lane) => lane.id === draggedOverLaneId
      )?.id;

      if (targetLaneId && item.block) {
        const result = await dispatch(
          moveBlock({
            sourceLaneId: item.laneId,
            targetLaneId,
            blockId: item.block.id,
          })
        );

        if (result && result.payload && result.payload.success) {
          setSelectedBlock({ ...item.block, targetLaneId });
          setShowModal(true);
          setShowDetails(false);
        }
      }

      return { targetLaneId };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    hover: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      lanes.forEach((lane) => {
        const laneElement = document.getElementById(lane.id);
        if (laneElement) {
          const rect = laneElement.getBoundingClientRect();
          if (
            clientOffset.x >= rect.left &&
            clientOffset.x <= rect.right &&
            clientOffset.y >= rect.top &&
            clientOffset.y <= rect.bottom
          ) {
            setDraggedOverLaneId(lane.id);
          }
        }
      });
    }
  });

  const handleSaveData = (data) => {
    if (selectedBlock) {
      dispatch(
        moveBlock({
          sourceLaneId: selectedBlock.laneId,
          targetLaneId: data.id,
          blockId: selectedBlock.id,
        })
      );
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBlock(null);
    setShowDetails(false);
  };

  const handleBlockClick = (block) => {
    setSelectedBlock({ ...block });
    setShowDetails(true);
  };

  if (!lanes || lanes.length === 0) {
    return <div className="p-4 text-center text-gray-500">No lanes available</div>; // Handle no data case
  }

  return (
    <div
      ref={drop}
      className="flex space-x-6 p-6 overflow-x-auto overflow-y-hidden min-h-full"
    >
      {lanes.map((lane) => (
        <div
          id={lane.id}
          key={lane.id}
          className={`relative flex flex-col w-72 min-w-max p-4 bg-white shadow-md rounded-lg border border-gray-300 transition-transform transform ${
            isOver ? "scale-105 bg-blue-50 border-blue-300" : "hover:shadow-xl"
          }`}
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            {lane.name || "Untitled Lane"}
          </h2>
          <div className="space-y-4 overflow-y-auto flex-grow">
            {lane.blocks.length === 0 ? (
              <div className="text-center text-gray-500">No tasks</div>
            ) : (
              lane.blocks.map((block) => (
                <DraggableBlock
                  key={block.id}
                  block={block}
                  laneId={lane.id}
                  onClick={() => handleBlockClick(block)}
                  className="p-3 bg-gray-100 rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <span>{block.content}</span>
                    <span className="text-sm text-gray-500">
                      {block.priority}
                    </span>
                  </div>
                </DraggableBlock>
              ))
            )}
          </div>
        </div>
      ))}
      {showModal && (
        <BlockModal
          block={selectedBlock}
          onSave={handleSaveData}
          onClose={handleCloseModal}
        />
      )}
      {showDetails && <BlockDetails block={selectedBlock} />}
    </div>
  );
}

Swimlane.propTypes = {
  lanes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      blocks: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          content: PropTypes.string.isRequired,
          priority: PropTypes.string, // Add this line
        })
      ),
    })
  ),
};

export default Swimlane;
