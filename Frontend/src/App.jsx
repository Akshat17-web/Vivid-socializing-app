import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
const Home = lazy(() => import("./Pages/Home"));
const SignUp = lazy(() => import("./Pages/SignUp"));
const Login = lazy(() => import("./Pages/Login"));
const OnBoarding = lazy(() => import("./Pages/OnBoarding"));
const Notification = lazy(() => import("./Pages/Notification"));
const ChatPage = lazy(() => import("./Pages/Chat"));
const CallPage = lazy(() => import("./Pages/Call"));
import {Toaster} from "react-hot-toast";
import PageLoader from "./components/PageLoader";
import useAuthUser from "./hooks/useAuthUser";
import Layout from "./components/Layout";
import { useThemeStore } from "./store/useThemeStore";
import FriendsPage from "./Pages/FriendsPage";

const App = () => {
  const { authUser } = useAuthUser();
  const {theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  return (
    <div className="h-screen" data-theme={theme}>
      <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded ? (<Layout showSidebar={true}><Home/></Layout>) : 
        (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>)
        }/>

        <Route path="/signup" element={!isAuthenticated ? <SignUp/>: <Navigate to={isOnboarded?"/": "/onboarding"}/>} />

        <Route path="/login" element={!isAuthenticated ? <Login/>: <Navigate to="/"/>} />

        <Route path="/onboarding" element={isAuthenticated ? (!isOnboarded? (<OnBoarding/>) : (<Navigate to="/"/>)): <Navigate to="/login"/>} />

        <Route path="/notification" element={isAuthenticated && isOnboarded ? (<Layout showSidebar={true}><Notification/></Layout>): <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>} />

        <Route path="/friends" element={isAuthenticated && isOnboarded ? (<Layout showSidebar={true}><FriendsPage/></Layout>): <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>} />

        <Route path="/call/:id" element={isAuthenticated && isOnboarded? (<CallPage/>) : <Login/>} />

        <Route path="/chat/:id" element={isAuthenticated && isOnboarded ? (<Layout showSidebar={false}><ChatPage/></Layout>): <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>} />
      </Routes>
      </Suspense>
      <Toaster/>
    </div>
  );
};

export default App;
