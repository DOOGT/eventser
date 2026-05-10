import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Ecranone from './pages/dashbord';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Ecranone />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
