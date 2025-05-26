import type { AxiosInstance, AxiosResponse } from 'axios';
import type { ApiResponse, PaginatedResponse, QueryParams, ServiceResponse } from '../../types';

export abstract class BaseApiService<T, CreateRequest, UpdateRequest> {
  protected axiosInstance: AxiosInstance;
  protected baseEndpoint: string;
  protected cache: Map<string, any> = new Map();
  protected isFetching: Set<string> = new Set();

  constructor(axiosInstance: AxiosInstance, baseEndpoint: string) {
    this.axiosInstance = axiosInstance;
    this.baseEndpoint = baseEndpoint;
  }

  /**
   * Get all items with optional query parameters
   */
  async getAll(params?: QueryParams): ServiceResponse<T[]> {
    const cacheKey = `getAll_${JSON.stringify(params || {})}`;

    // Return cached data if available
    if (this.cache.has(cacheKey)) {
      return {
        data: this.cache.get(cacheKey),
        status: 200,
        statusText: 'OK',
        headers: {},
      };
    }

    // Prevent multiple simultaneous requests
    if (this.isFetching.has(cacheKey)) {
      return this.waitForCache(cacheKey);
    }

    this.isFetching.add(cacheKey);

    try {
      const response: AxiosResponse<T[]> = await this.axiosInstance.get(this.baseEndpoint, {
        params,
      });

      this.cache.set(cacheKey, response.data);
      return response;
    } finally {
      this.isFetching.delete(cacheKey);
    }
  }

  /**
   * Get paginated items
   */
  async getPaginated(params?: QueryParams): ServiceResponse<PaginatedResponse<T>> {
    const response: AxiosResponse<PaginatedResponse<T>> = await this.axiosInstance.get(
      `${this.baseEndpoint}/paginated`,
      { params }
    );
    return response;
  }

  /**
   * Get item by ID
   */
  async getById(id: number | string): ServiceResponse<T> {
    const cacheKey = `getById_${id}`;

    // Try to get from cache first
    if (this.cache.has(cacheKey)) {
      return {
        data: this.cache.get(cacheKey),
        status: 200,
        statusText: 'OK',
        headers: {},
      };
    }

    const response: AxiosResponse<T> = await this.axiosInstance.get(`${this.baseEndpoint}/${id}`);

    this.cache.set(cacheKey, response.data);
    return response;
  }

  /**
   * Create new item
   */
  async create(data: CreateRequest): ServiceResponse<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(this.baseEndpoint, data);

    // Invalidate relevant caches
    this.invalidateListCaches();

    return response;
  }

  /**
   * Update item by ID
   */
  async update(id: number | string, data: UpdateRequest): ServiceResponse<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(
      `${this.baseEndpoint}/${id}`,
      data
    );

    // Update caches
    this.cache.set(`getById_${id}`, response.data);
    this.invalidateListCaches();

    return response;
  }

  /**
   * Partially update item by ID
   */
  async patch(id: number | string, data: Partial<UpdateRequest>): ServiceResponse<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(
      `${this.baseEndpoint}/${id}`,
      data
    );

    // Update caches
    this.cache.set(`getById_${id}`, response.data);
    this.invalidateListCaches();

    return response;
  }

  /**
   * Delete item by ID
   */
  async delete(id: number | string): ServiceResponse<void> {
    const response: AxiosResponse<void> = await this.axiosInstance.delete(
      `${this.baseEndpoint}/${id}`
    );

    // Remove from caches
    this.cache.delete(`getById_${id}`);
    this.invalidateListCaches();

    return response;
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear specific cache entry
   */
  clearCacheEntry(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Wait for cached data to be available
   */
  private async waitForCache(cacheKey: string): Promise<ApiResponse<any>> {
    return new Promise((resolve) => {
      const checkCache = setInterval(() => {
        if (this.cache.has(cacheKey)) {
          clearInterval(checkCache);
          resolve({
            data: this.cache.get(cacheKey),
            status: 200,
            statusText: 'OK',
            headers: {},
          });
        }
      }, 100);
    });
  }

  /**
   * Invalidate all list-related caches
   */
  private invalidateListCaches(): void {
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (key.startsWith('getAll_')) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key));
  }
}
