# Student Service Implementation - Client Functions

## Overview
Created a comprehensive `studentService.js` utility that wraps all server API endpoints with proper error handling, data sanitization, and consistent response formatting.

## New File Created
- **[client/src/utils/studentService.js](../../client/src/utils/studentService.js)** - Centralized student API service

## Updated Files
1. **[client/src/pages/ListAllStudents.jsx](../../client/src/pages/ListAllStudents.jsx)** 
   - Uses `studentService.getAllStudents()`
   - Uses `studentService.deleteStudent()`

2. **[client/src/pages/CreateStudent.jsx](../../client/src/pages/CreateStudent.jsx)**
   - Uses `studentService.createStudent()`
   - Uses `studentService.updateStudent()`

3. **[client/src/pages/MyProfile.jsx](../../client/src/pages/MyProfile.jsx)**
   - Uses `studentService.getStudentById()`
   - Uses `studentService.updateStudent()`

4. **[client/src/pages/Admission/Admission.jsx](../../client/src/pages/Admission/Admission.jsx)**
   - Uses `studentService.submitAdmission()`

5. **[client/src/pages/Admission/AdmissionRequests.jsx](../../client/src/pages/Admission/AdmissionRequests.jsx)**
   - Uses `studentService.getPendingRequests()`
   - Uses `studentService.approveAdmission()`
   - Uses `studentService.deleteStudent()`

## API Functions Implemented

### 1. `getAllStudents()`
Fetches all students (Admin/Desk only)
```javascript
const result = await studentService.getAllStudents();
// Returns: { success: boolean, data: array, message: string }
```

### 2. `getStudentById(studentId)`
Fetches a single student by profile ID or user ID
```javascript
const result = await studentService.getStudentById(id);
// Returns: { success: boolean, data: object, message: string }
```

### 3. `createStudent(studentData)`
Creates a new student with automatic data sanitization
```javascript
const result = await studentService.createStudent({
    name: "John Doe",
    mobile: "01712345678",
    classGrade: "9",
    // ... other fields
});
// Returns: { success: boolean, data: object, message: string }
```
- Automatically removes empty email and dateOfBirth fields
- Includes full response with user and profile data

### 4. `updateStudent(studentId, updateData)`
Updates an existing student
```javascript
const result = await studentService.updateStudent(id, {
    nameBN: "জন ডো",
    fatherName: "Father Name",
    // ... other fields to update
});
// Returns: { success: boolean, data: object, message: string }
```
- Automatically sanitizes empty fields
- Returns updated student profile

### 5. `deleteStudent(studentId)`
Deletes a student and associated user account (Admin/Super only)
```javascript
const result = await studentService.deleteStudent(id);
// Returns: { success: boolean, message: string }
```
- Cascading delete: removes both StudentProfile and User documents
- Requires Admin/Super authorization

### 6. `submitAdmission(applicationData)`
Public endpoint for admission applications
```javascript
const result = await studentService.submitAdmission({
    name: "Applicant",
    mobile: "01712345678",
    classGrade: "9",
    // ... other fields
});
// Returns: { success: boolean, message: string }
```
- Creates pending student with status 'pending'
- No authentication required

### 7. `approveAdmission(studentId)`
Approves a pending admission request (Admin/Super only)
```javascript
const result = await studentService.approveAdmission(id);
// Returns: { success: boolean, message: string }
```
- Changes user status from 'pending' to 'active'
- Allows student to login

### 8. `getPendingRequests()`
Retrieves all pending admission requests
```javascript
const result = await studentService.getPendingRequests();
// Returns: { success: boolean, data: array, message: string }
```
- Fetches all students and filters for pending status
- Used by Admin dashboard

### 9. `getActiveStudents()`
Retrieves only active students
```javascript
const result = await studentService.getActiveStudents();
// Returns: { success: boolean, data: array, message: string }
```
- Filters students by active status
- Useful for dashboards and reports

## Key Features

✅ **Centralized Error Handling**
- Consistent error response format across all functions
- User-friendly error messages

✅ **Automatic Data Sanitization**
- Removes empty email fields before sending to server
- Removes empty dateOfBirth fields
- Prevents common data validation errors

✅ **Consistent Response Format**
```javascript
{
    success: boolean,
    data: any,        // Optional, depending on operation
    message: string,  // Error message or success message
    error: string     // Only in case of failure
}
```

✅ **Token Management**
- Automatically includes JWT token from localStorage
- Used by base `api.js` utility

✅ **Improved Code Quality**
- Removed repetitive try-catch blocks from components
- Single source of truth for API logic
- Easier to maintain and update

## Migration Notes

All components now use the student service instead of direct API calls. This provides:
- Better separation of concerns
- Centralized data handling
- Consistent error messages
- Easier testing
- Future API endpoint flexibility

## Usage Example

Before (Direct API):
```javascript
const response = await api.post("api/students/create", data);
const result = await response.json();
if (!response.ok) throw new Error(result.message);
```

After (Student Service):
```javascript
const result = await studentService.createStudent(data);
if (!result.success) throw new Error(result.error);
```
