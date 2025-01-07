import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { SuikaGame } from './pages/SuikaGame';
import { PublicationPage } from './pages/PublicationPage';
import { PublicationsList } from './pages/PublicationsList';
import { publications } from './constants/publicationData.tsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4 bg-cover bg-center bg-fixed flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<PublicationsList />} />
            <Route path="/gravity" element={<SuikaGame />} />
            <Route 
              path="/publication/:id" 
              element={
                <PublicationPage 
                  publication={publications[0]} 
                />
              } 
            />
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
