import { useAuth } from '../contexts/AuthContext';
import { ApiResponse, PaginatedResponse } from '../types/schema';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const { token } = useAuth();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = await this.getAuthHeaders();

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  // User endpoints
  async getUser() {
    return this.request('/users/me');
  }

  async updateUser(userData: any) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Study cycles endpoints
  async getStudyCycles() {
    return this.request('/cycles');
  }

  async getStudyCycle(id: string) {
    return this.request(`/cycles/${id}`);
  }

  async createStudyCycle(cycleData: any) {
    return this.request('/cycles', {
      method: 'POST',
      body: JSON.stringify(cycleData),
    });
  }

  async updateStudyCycle(id: string, cycleData: any) {
    return this.request(`/cycles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cycleData),
    });
  }

  async deleteStudyCycle(id: string) {
    return this.request(`/cycles/${id}`, {
      method: 'DELETE',
    });
  }

  // Subjects endpoints
  async getSubjects() {
    return this.request('/subjects');
  }

  async getGlobalSubjects() {
    return this.request('/subjects/global');
  }

  // Flashcards endpoints
  async getFlashcards() {
    return this.request('/flashcards');
  }

  async createFlashcard(flashcardData: any) {
    return this.request('/flashcards', {
      method: 'POST',
      body: JSON.stringify(flashcardData),
    });
  }

  async updateFlashcard(id: string, flashcardData: any) {
    return this.request(`/flashcards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(flashcardData),
    });
  }

  async reviewFlashcard(id: string, reviewData: any) {
    return this.request(`/flashcards/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // Gamification endpoints
  async getUserStats() {
    return this.request('/gamification/stats');
  }

  async getLeaderboard() {
    return this.request('/gamification/leaderboard');
  }

  async getAchievements() {
    return this.request('/gamification/achievements');
  }

  // Social endpoints
  async getPosts(page: number = 1, limit: number = 20) {
    return this.request(`/social/posts?page=${page}&limit=${limit}`);
  }

  async createPost(postData: any) {
    return this.request('/social/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async likePost(postId: string) {
    return this.request(`/social/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  // Study groups endpoints
  async getStudyGroups() {
    return this.request('/study-groups');
  }

  async createStudyGroup(groupData: any) {
    return this.request('/study-groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }

  // Courses endpoints
  async getCourses() {
    return this.request('/courses');
  }

  async getCourse(id: string) {
    return this.request(`/courses/${id}`);
  }

  async enrollInCourse(courseId: string) {
    return this.request(`/courses/${courseId}/enroll`, {
      method: 'POST',
    });
  }

  // File upload endpoints
  async uploadFile(file: any) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }

  // AI endpoints
  async generateFlashcards(topic: string, count: number = 10) {
    return this.request('/ai/generate-flashcards', {
      method: 'POST',
      body: JSON.stringify({ topic, count }),
    });
  }

  async generateCourse(topic: string, level: string = 'intermediate') {
    return this.request('/ai/generate-course', {
      method: 'POST',
      body: JSON.stringify({ topic, level }),
    });
  }
}

export const apiClient = new ApiClient();

// React Query hooks
export const useApi = () => {
  return apiClient;
};
