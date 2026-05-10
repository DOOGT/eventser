import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Ecranone from './pages/dashbord';
import CreateEvent from './pages/nouveau';
import EventDetail from './pages/detail';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path='/' element={<Ecranone />} />
          <Route path='/events/create' element={<CreateEvent />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
