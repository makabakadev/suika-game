import { useState } from 'react';
import { Link } from 'react-router-dom';
import { publications } from '../utils/publicationData';
import { BookMarked, GraduationCap, BookOpen, FileText } from 'lucide-react';

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const filteredPublications = selectedCategory === 'all' 
    ? publications
    : publications.filter(pub => pub.category === selectedCategory);
  
  return (
    <div className="max-w-4xl mx-auto">
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold mb-6">Journal of BORK Science</h2>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'all', label: 'All', icon: FileText },
            { id: 'articles', label: 'Articles', icon: BookMarked },
            { id: 'conferences', label: 'Conferences', icon: GraduationCap },
            { id: 'books', label: 'Books', icon: BookOpen }
          ].map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-3 py-2 font-serif border-2 border-gray-800 
                ${selectedCategory === category.id ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
            >
              <category.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{category.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {filteredPublications.map(publication => (
            <div key={publication.id} className="bg-gray-50 p-4 sm:p-6 border-2 border-gray-800">
              <Link to={`/publication/${publication.id}`} className="block">
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-blue-600 hover:text-blue-800">
                  {publication.title}
                </h3>
                <p className="text-sm text-gray-600 italic mb-4">{publication.journal}, {publication.year}</p>
                <p className="text-gray-700 mb-4 text-sm sm:text-base">{publication.abstract}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1">IF: {publication.impactFactor}</span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1">Citations: {publication.citations}</span>
                  <button className="text-sm bg-amber-100 text-amber-800 px-2 py-1 hover:bg-amber-200">
                    Verify on Chain
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}