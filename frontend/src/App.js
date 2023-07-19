import { useEffect } from 'react';
import './App.css';
import Header from './components/layout/Header';
import Footer from "./components/layout/Footer";
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom"
import ProductDetails from './components/product/ProductDetails';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from "./components/user/Profile"
import { loadUser } from './actions/userActions';
import store from "./store"
import UpdateProfile from "./components/user/UpdateProfile"
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';




function App() {

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Router>
      <div className="App">
      <Header />
      <div className='container container-fluid'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:keyword" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} exact />
        <Route path='/login' element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/me" element={<Profile />} exact/>
        <Route path="/me/update" element={<UpdateProfile />} exact/>
        <Route path='/password/update' element={<UpdatePassword />} exact/>
        <Route path="/password/forgot" element={<ForgotPassword />} exact />
      </Routes>
      </div>
      <Footer />
     </div>
    </Router>
  );
}

export default App;
