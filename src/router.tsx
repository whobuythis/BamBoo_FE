import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import PostDetail from "./pages/PostDetail/PostDetail";
import MyPage from "./pages/MyPage/MyPage";
import Inquiry from "./pages/Inquiry/Inquiry";
import InquiryNew from "./pages/InquiryNew/InquiryNew";
import InquiryDetail from "./pages/InquiryDetail/InquiryDetail";
import InquiryPassword from "./pages/InquiryPassword/InquiryPassword";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "post/:id",
        element: <PostDetail />,
      },
      {
        path: "mypage",
        element: (
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "inquiry",
        element: <Inquiry />,
      },
      {
        path: "inquiry/new",
        element: <InquiryNew />,
      },
      {
        path: "inquiry/:id",
        element: <InquiryDetail />,
      },
      {
        path: "inquiry/:id/password",
        element: <InquiryPassword />,
      },
    ],
  },
]); 