import { api } from './api.js';

/**
 * Student Service - All student-related API calls
 * Wraps the raw api utility with business logic and error handling
 */

export const studentService = {
    /**
     * Fetch all students (Admin/Desk only)
     */
    getAllStudents: async () => {
        try {
            const response = await api.get('api/students/all');
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            const data = await response.json();
            return { success: true, data: data.students, message: data.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Fetch a single student by ID
     * @param {string} studentId - Student profile ID or User ID
     */
    getStudentById: async (studentId) => {
        try {
            const response = await api.get(`api/students/${studentId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch student');
            }
            const data = await response.json();
            return { success: true, data: data.student, message: data.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Create a new student (Admin/Super only)
     * @param {object} studentData - Student form data
     */
    createStudent: async (studentData) => {
        try {
            const payload = { ...studentData };
            // Sanitize empty fields
            if (!payload.email) delete payload.email;
            if (!payload.dateOfBirth) delete payload.dateOfBirth;

            const response = await api.post('api/students/create', payload);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create student');
            }
            const data = await response.json();
            return { success: true, data: data, message: data.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Update an existing student
     * @param {string} studentId - Student profile ID
     * @param {object} updateData - Fields to update
     */
    updateStudent: async (studentId, updateData) => {
        try {
            const payload = { ...updateData };
            // Sanitize empty fields
            if (!payload.email) delete payload.email;
            if (!payload.dateOfBirth) delete payload.dateOfBirth;

            const response = await api.put(`api/students/${studentId}`, payload);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update student');
            }
            const data = await response.json();
            return { success: true, data: data.student, message: data.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Delete a student and associated user (Admin/Super only)
     * @param {string} studentId - Student profile ID
     */
    deleteStudent: async (studentId) => {
        try {
            const response = await api.delete(`api/students/${studentId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete student');
            }
            const data = await response.json();
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Submit an admission application (Public)
     * @param {object} applicationData - Admission form data
     */
    submitAdmission: async (applicationData) => {
        try {
            const payload = { ...applicationData };
            // Sanitize empty fields
            if (!payload.email) delete payload.email;
            if (!payload.dateOfBirth) delete payload.dateOfBirth;

            const response = await api.post('api/students/admission', payload);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit application');
            }
            const data = await response.json();
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Approve a pending admission (Admin/Super only)
     * @param {string} studentId - Student profile ID
     */
    approveAdmission: async (studentId) => {
        try {
            const response = await api.put(`api/students/approve/${studentId}`, {});
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to approve student');
            }
            const data = await response.json();
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Get pending admission requests
     * @returns Array of students with pending status
     */
    getPendingRequests: async () => {
        try {
            const response = await api.get('api/students/all');
            if (!response.ok) {
                throw new Error('Failed to fetch requests');
            }
            const data = await response.json();
            const pending = data.students.filter(s => s.userId?.status === 'pending');
            return { success: true, data: pending, message: `Found ${pending.length} pending requests` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Get all active students
     * @returns Array of active students only
     */
    getActiveStudents: async () => {
        try {
            const response = await api.get('api/students/all');
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            const data = await response.json();
            const active = data.students.filter(s => s.userId?.status === 'active');
            return { success: true, data: active, message: `Found ${active.length} active students` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
};
