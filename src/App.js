import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLanes } from './redux/swimlaneSlice';
import Swimlane from './components/Swimlane';
import Filter from './components/Filter';

const App = () => {
  const dispatch = useDispatch();
  const { lanes, status } = useSelector((state) => state.swimlane);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLanes());
    }
  }, [dispatch, status]);
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App p-4 flex flex-col min-h-screen">
        <Filter />
        <div className="flex-grow flex">
          {status === 'loading' ? (
            <p>Loading...</p>
          ) : status === 'failed' ? (
            <p>Error loading lanes</p>
          ) : (
            <Swimlane lanes={lanes} />
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
