import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { lanesData } from '../masterConfiguration/data';
// Create an instance of the mock adapter
const mock = new MockAdapter(axios, { delayResponse: 500 });


// Mock the GET request to fetch lanes
mock.onGet('/api/lanes').reply(200, {
  lanes: lanesData,
});

// Mock the POST request to move blocks
mock.onPost('/api/moveBlock').reply((config) => {
  const { sourceLaneId, targetLaneId, blockId } = JSON.parse(config.data);
  
  // Find source and target lanes
  const sourceLane = lanesData.find(lane => lane.id === sourceLaneId);
  const targetLane = lanesData.find(lane => lane.id === targetLaneId);

  if (!sourceLane || !targetLane) {
    return [400, { success: false, message: 'Invalid lane ID' }];
  }

  if (sourceLane === targetLane) {
    return [400, { success: false, message: 'sourceLaneId and targetLaneId are the same' }];
  }

  // Find the block to move
  const block = sourceLane.blocks.find(b => b.id === blockId);

  if (!block) {
    return [400, { success: false, message: 'Block not found' }];
  }

  // Check if the move is restricted by the block's restrictedId
  if (block.restrictedId.includes(targetLaneId)) {
    alert("Movement is not allowed for this block to specific lane")
    return [400, { success: false, message: 'Move not allowed: Block restricted from moving to this lane' }];
  }

  // Remove block from source lane
  sourceLane.blocks = sourceLane.blocks.filter(b => b.id !== blockId);

  // Add block to target lane
  targetLane.blocks.push(block);

  console.log('Updated lanesData:', lanesData);

  // Return success response
  return [200, { success: true, message: 'Block moved successfully' }];
});
