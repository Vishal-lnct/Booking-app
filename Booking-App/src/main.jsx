import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ResetPassword from "./pages/ResetPassword.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

import AllRooms        from "./components/AllRooms.jsx";
import AuthForm        from "./components/AuthForm.jsx";
import MyBookings      from "./components/MyBookings.jsx";
import RoomDetails     from "./components/RoomDetails/RoomDetails.jsx";
import { UserProvider } from "./components/UserContext.jsx";
import GuestRoute      from "./components/GuestRoute.jsx";
import ProtectedRoute  from "./components/ProtectedRoute.jsx";
import Home            from "./pages/Home";
import AdminDashboard  from "./components/Admin/Admindashboard.jsx"; // ✅

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
children: [
  { path: "/",            element: <Home /> },
  { path: "/rooms",       element: <AllRooms /> },
  { path: "/rooms/:id",   element: <RoomDetails /> },

  {
    path: "/reset/:uid/:token",
    element: <ResetPassword />,
  },
  {
  path: "/forgot-password",
  element: <ForgotPassword />,
},

  {
    path: "/auth",
    element: <GuestRoute><AuthForm /></GuestRoute>,
  },
  {
    path: "/my-bookings",
    element: <ProtectedRoute><MyBookings /></ProtectedRoute>,
  },
  {
    path: "/admin",
    element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
  },
],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);