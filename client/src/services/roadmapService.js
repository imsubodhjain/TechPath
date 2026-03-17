import api from './api';

export const getRoadmaps = async (params = {}) => {
  const { data } = await api.get('/roadmaps', { params });
  return data;
};

export const getPopularRoadmaps = async () => {
  const { data } = await api.get('/roadmaps/popular');
  return data;
};

export const getRoadmapBySlug = async (slug) => {
  const { data } = await api.get(`/roadmaps/${slug}`);
  return data;
};
