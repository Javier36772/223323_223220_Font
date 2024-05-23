import TextEditor from './components/textEditor/TextEditor';
import Home from './components/home/Home';
import Login from './components/login/Login';
import NotificationsBox from './components/notificationsBox/NotificationsBox';
import Signup from './components/signup/Signup';
import {createBrowserRouter, redirect, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter([
  {path:"/", element: <Home/>},
  {path:"/documents/:id", element:<TextEditor/>},
  {path:"/login", element:<Login/>},
  {path:"/notifications", element: <NotificationsBox/>},
  {path:"/signup", element:<Signup/>}
]);

function App() {
  return (
    <RouterProvider router={router}/> 
  );
}

export default App;
