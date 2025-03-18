import axiosInstance from '@/plugins/axios';

// Cache for beneficiaries
let beneficiariesCache = null;
let isFetching = false;

/**
 * Service for handling beneficiary-related API requests
 */
export const beneficiaryService = {
  /**
   * Get all beneficiaries
   * @returns {Promise} Promise with the beneficiaries data
   */
  async getAllBeneficiaries() {
    // Return cached data if available
    if (beneficiariesCache) {
      return { data: beneficiariesCache };
    }

    // Prevent multiple simultaneous requests
    if (isFetching) {
      return new Promise((resolve) => {
        const checkCache = setInterval(() => {
          if (beneficiariesCache) {
            clearInterval(checkCache);
            resolve({ data: beneficiariesCache });
          }
        }, 100);
      });
    }

    isFetching = true;
    try {
      const response = await axiosInstance.get('/api/Beneficiary');
      beneficiariesCache = response.data;
      return response;
    } finally {
      isFetching = false;
    }
  },

  /**
   * Get a beneficiary by ID
   * @param {number|string} id - Beneficiary ID
   * @returns {Promise} Promise with the beneficiary data
   */
  async getBeneficiaryById(id) {
    // Try to get from cache first
    if (beneficiariesCache) {
      const beneficiary = beneficiariesCache.find((b) => b.id === id);
      if (beneficiary) {
        return { data: beneficiary };
      }
    }
    return axiosInstance.get(`/api/Beneficiary/${id}`);
  },

  /**
   * Create a new beneficiary
   * @param {Object} beneficiaryData - Beneficiary data
   * @returns {Promise} Promise with the created beneficiary data
   */
  async createBeneficiary(beneficiaryData) {
    const response = await axiosInstance.post('/api/Beneficiary', beneficiaryData);
    // Update cache
    if (beneficiariesCache) {
      beneficiariesCache.push(response.data);
    }
    return response;
  },

  /**
   * Update a beneficiary
   * @param {number|string} id - Beneficiary ID
   * @param {Object} beneficiaryData - Updated beneficiary data
   * @returns {Promise} Promise with the updated beneficiary data
   */
  async updateBeneficiary(id, beneficiaryData) {
    const response = await axiosInstance.put(`/api/Beneficiary/${id}`, beneficiaryData);
    // Update cache
    if (beneficiariesCache) {
      const index = beneficiariesCache.findIndex((b) => b.id === id);
      if (index !== -1) {
        beneficiariesCache[index] = response.data;
      }
    }
    return response;
  },

  /**
   * Update only the name of a beneficiary
   * @param {number|string} id - Beneficiary ID
   * @param {string} name - New name for the beneficiary
   * @returns {Promise} Promise with the updated beneficiary data
   */
  async updateBeneficiaryName(id, name) {
    const response = await axiosInstance.put(`/api/Beneficiary/${id}`, { name });
    // Update cache
    if (beneficiariesCache) {
      const index = beneficiariesCache.findIndex((b) => b.id === id);
      if (index !== -1) {
        beneficiariesCache[index] = { ...beneficiariesCache[index], name };
      }
    }
    return response;
  },

  /**
   * Delete a beneficiary
   * @param {number|string} id - Beneficiary ID
   * @returns {Promise} Promise with the deletion result
   */
  async deleteBeneficiary(id) {
    await axiosInstance.delete(`/api/Beneficiary/${id}`);
    // Update cache
    if (beneficiariesCache) {
      beneficiariesCache = beneficiariesCache.filter((b) => b.id !== id);
    }
  },
};
