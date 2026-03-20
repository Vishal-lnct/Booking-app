import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AllRooms    from "./components/AllRooms.jsx";
import AuthForm    from "./components/AuthForm.jsx";
import MyBookings  from "./components/MyBookings.jsx";  // ← SWAPPED
import { UserProvider } from "./components/UserContext.jsx";
import GuestRoute  from "./components/GuestRoute.jsx";
import Home        from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/rooms",
        element: <AllRooms />,
      },
      {
        path: "/auth",
        element: (
          <GuestRoute>
            <AuthForm />
          </GuestRoute>
        ),
      },
      {
        path: "/my-bookings",
        element: <MyBookings />,  // ← SWAPPED from OccupiedDatesDisplay
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