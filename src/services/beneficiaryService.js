import axiosInstance from '@/plugins/axios';

/**
 * Service for handling beneficiary-related API requests
 */
export const beneficiaryService = {
  /**
   * Get all beneficiaries
   * @returns {Promise} Promise with the beneficiaries data
   */
  getAllBeneficiaries() {
    return axiosInstance.get('/api/Beneficiary');
  },

  /**
   * Get a beneficiary by ID
   * @param {number|string} id - Beneficiary ID
   * @returns {Promise} Promise with the beneficiary data
   */
  getBeneficiaryById(id) {
    return axiosInstance.get(`/api/Beneficiary/${id}`);
  },

  /**
   * Create a new beneficiary
   * @param {Object} beneficiaryData - Beneficiary data
   * @returns {Promise} Promise with the created beneficiary data
   */
  createBeneficiary(beneficiaryData) {
    return axiosInstance.post('/api/Beneficiary', beneficiaryData);
  },

  /**
   * Update a beneficiary
   * @param {number|string} id - Beneficiary ID
   * @param {Object} beneficiaryData - Updated beneficiary data
   * @returns {Promise} Promise with the updated beneficiary data
   */
  updateBeneficiary(id, beneficiaryData) {
    return axiosInstance.put(`/api/Beneficiary/${id}`, beneficiaryData);
  },

  /**
   * Update only the name of a beneficiary
   * @param {number|string} id - Beneficiary ID
   * @param {string} name - New name for the beneficiary
   * @returns {Promise} Promise with the updated beneficiary data
   */
  updateBeneficiaryName(id, name) {
    return axiosInstance.put(`/api/Beneficiary/${id}`, { name });
  },

  /**
   * Delete a beneficiary
   * @param {number|string} id - Beneficiary ID
   * @returns {Promise} Promise with the deletion result
   */
  deleteBeneficiary(id) {
    return axiosInstance.delete(`/api/Beneficiary/${id}`);
  },
};
