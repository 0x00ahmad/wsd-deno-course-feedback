const feedbacks = new Map();

export const addFeedback = async (id) => {
  const count = feedbacks.get(id) || 0;
  feedbacks.set(id, count + 1);
};

export const getFeedbackCount = async (id) => {
  return feedbacks.get(id) || 0;
};
