export const lanesData = [
    {
      id: '1',
      name: 'To Do',
      blocks: [
        { 
          id: 'b1', 
          content: 'Design Landing Page', 
          priority: 'High', 
          dueDate: '2024-09-10', 
          status: 'New',
          restrictedId: [] 
        }
      ],
    },
    {
      id: '2',
      name: 'In Progress',
      blocks: [
        { 
          id: 'b2', 
          content: 'Develop API Endpoints', 
          priority: 'Medium', 
          dueDate: '2024-09-08', 
          status: 'Ongoing',
          restrictedId: ['1'] 
        }
      ], // Block 2 can't move to 'To Do' (lane 1)
    },
    {
      id: '3',
      name: 'Done',
      blocks: [
        { 
          id: 'b3', 
          content: 'Test User Authentication', 
          priority: 'Low', 
          dueDate: '2024-09-05', 
          status: 'Completed',
          restrictedId: [] 
        }
      ],
    },
  ];
  