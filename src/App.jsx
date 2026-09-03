import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppShell from "./components/AppShell.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import GoogleCallback from "./pages/GoogleCallback.jsx";
import Drive from "./pages/Drive.jsx";
import Shared from "./pages/Shared.jsx";
import Starred from "./pages/Starred.jsx";
import Trash from "./pages/Trash.jsx";
import Search from "./pages/Search.jsx";
import PublicShare from "./pages/PublicShare.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="/share/:token" element={<PublicShare />} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Drive />} />
        <Route path="/folder/:folderId" element={<Drive />} />
        <Route path="/shared" element={<Shared />} />
        <Route path="/starred" element={<Starred />} />
        <Route path="/trash" element={<Trash />} />
        <Route path="/search" element={<Search />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
