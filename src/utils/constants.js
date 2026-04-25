/**
 * Application constants
 */

export const USER_ROLES = {
  ADMIN: 'Admin',
  OWNER: 'BookOwner',
  READER: 'Reader',
};

export const USER_ROLE_LABELS = {
  Admin: 'Admin',
  BookOwner: 'Book Owner',
  Reader: 'Reader',
};

export const BOOK_STATUS = {
  AVAILABLE: 'Available',
  BORROWED: 'Borrowed',
  PENDING: 'Pending',
};

export const REQUEST_STATUS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
};

export const USER_STATUS = {
  ACTIVE: 'Active',
  PENDING: 'Pending',
};

export const STORAGE_KEYS = {
  CURRENT_PAGE: 'currentPage',
  CURRENT_USER: 'currentUser',
  BOOKS: 'books',
  USERS: 'users',
  READING_LIST: 'readingList',
  REQUESTS: 'requests',
  NOTIFICATIONS: 'notifications',
};
