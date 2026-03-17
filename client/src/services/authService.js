import api from './api';

export const registerUser = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const searchAll = async (query, type) => {
  const { data } = await api.get('/search', { params: { q: query, type } });
  return data;
};

export const toggleBookmarkRoadmap = async (id) => {
  const { data } = await api.post(`/users/bookmarks/roadmaps/${id}`);
  return data;
};

export const toggleBookmarkTool = async (id) => {
  const { data } = await api.post(`/users/bookmarks/tools/${id}`);
  return data;
};

export const getBookmarks = async () => {
  const { data } = await api.get('/users/bookmarks');
  return data;
};

export const updateProgress = async (roadmapId, completedTopics) => {
  const { data } = await api.put(`/users/progress/${roadmapId}`, { completedTopics });
  return data;
};

export const getProgress = async () => {
  const { data } = await api.get('/users/progress');
  return data;
};
