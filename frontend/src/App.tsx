import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar";
import { useAuth } from "./authContext";

export default function App() {
  const { auth } = useAuth();

  return (
    <BrowserRouter>
      {auth.token && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={auth.token ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {auth.user?.isAdmin && (
          <Route path="/admin" element={<AdminPanel />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}



