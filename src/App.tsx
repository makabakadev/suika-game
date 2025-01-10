import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Footer } from './components/Footer.tsx';
import { PublicationPage } from './pages/PublicationPage.tsx';
import { Home } from './pages/Home.tsx';
import { publications } from './utils/publicationData.tsx';
import { Header } from './components/Header.tsx';
import { useParams } from 'react-router-dom';

function PublicationPageWrapper() {
  const { id } = useParams();
  const publication = publications.find(pub => pub.id === id);

  if (!publication) {
    return <div>Publication not found.</div>;
  }

  return <PublicationPage publication={publication} />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        
        {/* Main Content Area */}
        <div className="mt-20 sm:mt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/publication/:id" element={<PublicationPageWrapper />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
