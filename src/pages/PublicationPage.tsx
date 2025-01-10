import { Publication } from '../utils/publicationData';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PublicationPageProps {
  publication: Publication;
}

export function PublicationPage({ publication }: PublicationPageProps) {
  return (
    <div key={publication.id} className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Publications</span>
      </Link>
      
      {publication.id === 'gravitational-bork' ? (
        <div className="mb-8">
          {publication.component}
        </div>
      ) : (
        <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-4">{publication.title}</h1>

          <div className="flex items-center space-x-4 mb-6 sm:mb-8 text-sm text-gray-600">
            <span>{publication.journal}</span>
            <span>•</span>
            <span>{publication.year}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
            {publication.impactFactor && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                IF: {publication.impactFactor}
              </span>
            )}
            {publication.citations && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Citations: {publication.citations}
              </span>
            )}
          </div>

          {publication.abstract && (
            <div className="bg-gray-50 p-4 sm:p-6 border-2 border-gray-800 mb-6 sm:mb-8">
              <h2 className="font-serif text-lg sm:text-xl font-bold mb-4">Abstract</h2>
              <p className="text-gray-700 text-sm sm:text-base">{publication.abstract}</p>
            </div>
          )}
          
          <div className="bg-white p-4 sm:p-8 border-2 border-gray-800 text-center">
            <h2 className="font-serif text-lg sm:text-xl font-bold mb-4">Content Coming Soon</h2>
            <p className="text-gray-700 text-sm sm:text-base italic">
              "Under the scrutiny of the world's foremost poultry scholars, this research is currently being rigorously peer-reviewed."
            </p>
            <p className="text-gray-600 text-sm sm:text-base mt-4">
              Stay tuned for groundbreaking insights in the field of chickenomics, egg theory, and feather dynamics. 🐔
            </p>
          </div>
        </article>
      )}
    </div>
  );
}

