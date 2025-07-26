// API configuration and utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  // Remove auth token from localStorage
  removeAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Upload file
  async upload(endpoint, formData) {
    const token = this.getAuthToken();
    const config = {
      method: 'POST',
      body: formData,
    };

    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email, password) {
    const response = await this.post('/auth/login', { email, password });
    if (response.token) {
      this.setAuthToken(response.token);
    }
    return response;
  }

  async register(userData) {
    const response = await this.post('/auth/register', userData);
    if (response.token) {
      this.setAuthToken(response.token);
    }
    return response;
  }

  async logout() {
    try {
      await this.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeAuthToken();
    }
  }

  async getProfile() {
    return this.get('/auth/profile');
  }

  // Product methods
  async getProducts(params = {}) {
    return this.get('/products', params);
  }

  async getFeaturedProducts() {
    return this.get('/products/featured');
  }

  async getProduct(id) {
    return this.get(`/products/${id}`);
  }

  async getCategories() {
    return this.get('/products/categories/list');
  }

  // Order methods
  async createOrder(orderData) {
    return this.post('/orders', orderData);
  }

  async getMyOrders(params = {}) {
    return this.get('/orders/my-orders', params);
  }

  async getOrder(id) {
    return this.get(`/orders/${id}`);
  }

  async cancelOrder(id) {
    return this.put(`/orders/${id}/cancel`);
  }

  // Custom request methods
  async createCustomRequest(formData) {
    return this.upload('/custom-requests', formData);
  }

  async getMyCustomRequests(params = {}) {
    return this.get('/custom-requests/my-requests', params);
  }

  async getCustomRequest(id) {
    return this.get(`/custom-requests/${id}`);
  }

  async addCustomRequestCommunication(id, formData) {
    return this.upload(`/custom-requests/${id}/communications`, formData);
  }

  // Contact methods
  async sendContactMessage(messageData) {
    return this.post('/contact/send-message', messageData);
  }

  async subscribeNewsletter(email, name) {
    return this.post('/contact/newsletter', { email, name });
  }

  async getSocialLinks() {
    return this.get('/contact/social-links');
  }

  async getContactInfo() {
    return this.get('/contact/info');
  }

  // Admin methods
  async getDashboardStats() {
    return this.get('/admin/dashboard/stats');
  }

  async getAdminOrders(params = {}) {
    return this.get('/admin/orders', params);
  }

  async getAdminCustomRequests(params = {}) {
    return this.get('/admin/custom-requests', params);
  }

  async getAdminUsers(params = {}) {
    return this.get('/admin/users', params);
  }

  async getSalesAnalytics(params = {}) {
    return this.get('/admin/analytics/sales', params);
  }

  async updateOrderStatus(id, status, note) {
    return this.put(`/orders/${id}/status`, { status, note });
  }

  async updateCustomRequestStatus(id, status, adminResponse) {
    return this.put(`/custom-requests/${id}/status`, { status, adminResponse });
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
