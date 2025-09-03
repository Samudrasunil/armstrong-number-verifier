import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage'; 
import VerificationPage from './pages/VerificationPage';
import UserDashboardPage from './pages/UserDashboardPage';
import GlobalDashboardPage from './pages/GlobalDashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<RegistrationPage />} />
        <Route path="login" element={<LoginPage />} /> 
        <Route path="verify" element={<VerificationPage />} />
        <Route path="dashboard" element={<UserDashboardPage />} />
        <Route path="global" element={<GlobalDashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;