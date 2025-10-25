import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import AbsaPage from "./components/Absa/AbsaPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
           <Route path="/login" element={<Login />} />   {/* ✅ Add this */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/absa" element={<AbsaPage />} /> {/* ✅ ABSA page */}
      </Routes>
    </Router>
  );
}

export default App;
