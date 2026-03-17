import api from './api';

export const getTools = async (params = {}) => {
  const { data } = await api.get('/tools', { params });
  return data;
};

export const getToolBySlug = async (slug) => {
  const { data } = await api.get(`/tools/${slug}`);
  return data;
};

export const getToolCategories = async () => {
  const { data } = await api.get('/tools/categories');
  return data;
};
