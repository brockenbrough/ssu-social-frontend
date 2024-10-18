import axios from 'axios';

export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_SERVER_URI}/comments/comment/${commentId}`
    );

    return response.status === 200; 
  } catch (error) {
    return false;
  }
};
