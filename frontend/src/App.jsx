import { useContext } from 'react';
import useStateWithCallback from 'use-state-with-callback';
import './App.css';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register'
import NewPost from './pages/newPost/NewPost';
import SinglePost from './pages/singlePost/SinglePost';
import Navbar from './components/navbar/Navbar';
import { LoadingContext } from './context/LoadingContext';
import Profile from './pages/profile/Profile';
import { AuthContext } from './context/AuthContext';


const Main = () => {
  return (
    <>
      <Navbar/>
      <Outlet/>
    </>
  );
};

const ProtectedRoute = ({ children }) => {

  const currentUser = useContext(AuthContext)
  const [mounted, setMounted] = useStateWithCallback(false, () => {
    setTimeout(() => setMounted(true), 1000)
  });

  if (mounted && !currentUser) {
    return <Navigate to="/" />;
  } else if (!mounted && !currentUser) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <div className="loading">Loading...</div>
      </div>
    )
  } else {
    return children
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main/>,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "/profile/:id",
        element: 
        <ProtectedRoute>
          <Profile/>
        </ProtectedRoute>,
      },
      {
        path: "/post/:id",
        element: <SinglePost/>,
      },
      {
        path: "/newPost",
        element: 
        <ProtectedRoute>
          <NewPost/>
        </ProtectedRoute>,
      },
    ],
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
]);

function App() {

  const loading = useContext(LoadingContext)


if (loading) {
  return (
  <div className="loading-container">
    <div className="loader"></div>
    <div className="loading">Loading...</div>
  </div>
  )
}

return (
  <div className="App">
    <div className="container">
      <RouterProvider router={router} />
    </div>  
  </div>
)}

export default App;
