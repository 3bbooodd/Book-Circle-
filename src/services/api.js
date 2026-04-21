import { BOOKS, USERS, BORROW_REQUESTS, NOTIFICATIONS } from "../data/mockData";

// simulate delay زي real backend
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ───────────── Books ───────────── */

export const getBooks = async () => {
  await delay(500);
  return [...BOOKS];
};

export const getBookById = async (id) => {
  await delay(300);
  return BOOKS.find(b => b.id === id);
};

export const likeBook = async (id) => {
  await delay(200);
  return { success: true, id };
};

export const borrowBook = async (book) => {
  await delay(400);
  return { success: true, book };
};

/* ───────────── Users ───────────── */

export const getUsers = async () => {
  await delay(500);
  return [...USERS];
};

export const approveUser = async (id) => {
  await delay(300);
  return { success: true, id };
};

export const rejectUser = async (id) => {
  await delay(300);
  return { success: true, id };
};

/* ───────────── Requests ───────────── */

export const getBorrowRequests = async () => {
  await delay(400);
  return [...BORROW_REQUESTS];
};

/* ───────────── Notifications ───────────── */

export const getNotifications = async () => {
  await delay(400);
  return [...NOTIFICATIONS];
};

export const markNotificationAsRead = async (id) => {
  await delay(200);
  return { success: true, id };
};