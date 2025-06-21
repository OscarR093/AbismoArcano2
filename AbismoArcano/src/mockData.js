// src/mockData.js
// Contiene solo datos simulados, ya que la mayoría de las operaciones ahora van al backend.
// Las funciones de autenticación y conexión con el backend se han movido a src/api/index.js.

// NOTA: Estas funciones getMock/addMock ya no se utilizan directamente en el frontend
// si se está usando el backend. Se mantienen aquí solo como referencia
// o si aún hubiera alguna parte del código que no se haya refactorizado completamente.
// Deberías eliminarlas una vez que todos los datos vengan del backend.

export const getMockBlogs = () => {
  console.warn("ADVERTENCIA: getMockBlogs() está siendo llamado. Deberías usar api.getBlogs() en su lugar.");
  return Promise.resolve([]);
};

export const getMockBlogById = (id) => {
  console.warn("ADVERTENCIA: getMockBlogById() está siendo llamado. Deberías usar api.getBlogById() en su lugar.");
  return Promise.resolve(null);
};

export const getMockPostsByBlogId = (blogId) => {
  console.warn("ADVERTENCIA: getMockPostsByBlogId() está siendo llamado. Deberías usar api.getPostsByBlogId() en su lugar.");
  return Promise.resolve([]);
};

export const addMockBlog = (blogData) => {
  console.warn("ADVERTENCIA: addMockBlog() está siendo llamado. Deberías usar api.createBlog() en su lugar.");
  return Promise.resolve({});
};

export const addMockPost = (blogId, postData) => {
  console.warn("ADVERTENCIA: addMockPost() está siendo llamado. Deberías usar api.createPost() en su lugar.");
  return Promise.resolve({});
};

// Las funciones de autenticación simuladas (getSimulatedUserId, simulateLogin, simulateLogout)
// han sido movidas a src/api/index.js como getToken, setToken, removeToken, login, register.
