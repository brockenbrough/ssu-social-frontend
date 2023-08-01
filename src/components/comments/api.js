export const getComments = async () => {
  return [
    {
      id: "1",
      body: "Nice View! Wow 🤩🥰",
      username: "Cherry Gertiz",
      userId: "1",
      parentId: null,
      createdAt: "2022-08-16T23:00:33.010+02:00",
    },
    {
      id: "2",
      body: "Bro, that's beautiful man..❤🕺",
      username: "Martin Van Dirk",
      userId: "2",
      parentId: null,
      createdAt: "2022-08-16T23:00:33.010+02:00",
    },
    {
      id: "3",
      body: "I know it was amazing🏝🏞",
      username: "John Bisque",
      userId: "2",
      parentId: "1",
      createdAt: "2022-08-16T23:00:33.010+02:00",
    },
    {
      id: "4",
      body: "The weather was perfect!!!🌍🏞",
      username: "John Bisque",
      userId: "2",
      parentId: "2",
      createdAt: "2022-08-16T23:00:33.010+02:00",
    },
  ];
};

export const createComment = async (text, parentId = null) => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    body: text,
    parentId,
    userId: "1",
    username: "John Bisque",
    createdAt: new Date().toISOString(),
  };
};

export const updateComment = async (text) => {
  return { text };
};

export const deleteComment = async () => {
  return {};
};
