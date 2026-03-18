/**
 * Input validation utilities
 */

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) && email.length <= 254;
};

const isValidPassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

const isValidName = (name) => {
  return name && name.trim().length > 0 && name.length <= 100;
};

const isValidSubject = (subject) => {
  const validSubjects = ['math', 'english', 'science', 'history', 'pe', 'art', 'music', 'social', 'computer'];
  return validSubjects.includes(subject?.toLowerCase());
};

const isValidGrade = (grade) => {
  const validGrades = ['k', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  return validGrades.includes(grade?.toString().toLowerCase());
};

const isValidRole = (role) => {
  return ['teacher', 'admin', 'student', 'parent', 'principal'].includes(role?.toLowerCase());
};

const isValidMongoId = (id) => {
  return /^[0-9a-f]{24}$/i.test(id);
};

const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 1000);
};

const validateResourcePayload = (payload) => {
  const errors = [];
  if (!payload.title || !sanitizeString(payload.title).trim()) errors.push('title is required');
  if (!payload.subject || !isValidSubject(payload.subject)) errors.push('subject must be valid');
  if (!payload.grade || !isValidGrade(payload.grade)) errors.push('grade must be valid');
  if (payload.description && sanitizeString(payload.description).length > 5000) errors.push('description too long');
  return errors;
};

const validateLessonPlanPayload = (payload) => {
  const errors = [];
  if (!payload.title || !sanitizeString(payload.title).trim()) errors.push('title is required');
  if (!payload.objectives || !Array.isArray(payload.objectives) || payload.objectives.length === 0) {
    errors.push('objectives must be a non-empty array');
  }
  if (!payload.activities || !Array.isArray(payload.activities) || payload.activities.length === 0) {
    errors.push('activities must be a non-empty array');
  }
  return errors;
};

const validateChatMessage = (payload) => {
  const errors = [];
  if (!payload.room || !sanitizeString(payload.room).trim()) errors.push('room is required');
  if (!payload.text || !sanitizeString(payload.text).trim()) errors.push('text is required');
  if (sanitizeString(payload.text).length > 2000) errors.push('message too long');
  return errors;
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidSubject,
  isValidGrade,
  isValidRole,
  isValidMongoId,
  sanitizeString,
  validateResourcePayload,
  validateLessonPlanPayload,
  validateChatMessage
};
