import { Routes, Route } from "react-router-dom";

import BrowsePage from "../pages/BrowsePage";
import MyBooksPage from "../pages/MyBooksPage";
import ReadingListPage from "../pages/ReadingListPage";
import NotificationsPage from "../pages/NotificationsPage";
import AdminPage from "../pages/AdminPage";

export default function AppRoutes(props) {
  return (
    <Routes>
      <Route path="/" element={<BrowsePage {...props} />} />
      <Route path="/browse" element={<BrowsePage {...props} />} />
      <Route path="/mybooks" element={<MyBooksPage {...props} />} />
      <Route path="/reading" element={<ReadingListPage {...props} />} />
      <Route path="/notifications" element={<NotificationsPage {...props} />} />
      <Route path="/admin" element={<AdminPage {...props} />} />
    </Routes>
  );
}