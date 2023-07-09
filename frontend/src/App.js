import './App.css';
import Header from './components/layout/Header';
import Footer from "./components/layout/Footer";
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom"
import ProductDetails from './components/product/ProductDetails';

function App() {
  return (
    <Router>
      <div className="App">
      <Header />
      <div className='container container-fluid'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:keyword" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} exact />
      </Routes>
      </div>
      <Footer />
     </div>
    </Router>
  );
}

export default App;
