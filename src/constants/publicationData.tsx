import { SuikaGame } from "../pages/SuikaGame";

export interface Publication {
  id: string;
  title: string;
  journal: string;
  year: number;
  impactFactor?: number;
  citations?: number;
  category: 'articles' | 'conferences' | 'books';
  abstract?: string;
  content?: string;
  component?: JSX.Element;
}

export const publications: Publication[] = [
  {
    id: 'gravitational-bork',
    title: 'Gravitational BORK: Unraveling Poultry-Based Theories of Gravity',
    journal: 'Nature BORK',
    year: 2024,
    impactFactor: 42.1,
    citations: 123,
    category: 'articles',
    abstract: 'This paper investigates poultry-based theories of gravity, proposing groundbreaking models in the context of BORK dynamics.',
    content: 'Published in Nature BORK, Volume 42, Issue 1, pp. 123-456.',
    component: <SuikaGame />
  },
  {
    id: 'bork-paradox',
    title: 'The BORK Paradox: Implications for Modern Blockchain',
    journal: 'Science of BORK',
    year: 2024,
    impactFactor: 15.3,
    citations: 89,
    category: 'articles',
    abstract: 'A comprehensive exploration of the BORK Paradox and its revolutionary impact on blockchain technology.',
    content: 'Published in Science of BORK, Volume 15, Issue 3, pp. 789-012.'
  },
  {
    id: 'decentralized-poultry',
    title: 'BORK: A New Framework for Decentralized Poultry Systems',
    journal: 'IEEE Transactions on BORK',
    year: 2024,
    impactFactor: 8.4,
    citations: 345,
    category: 'articles',
    abstract: 'A pioneering study introducing decentralized frameworks for poultry systems within blockchain ecosystems.',
    content: 'Published in IEEE Transactions on BORK, Volume 8, Issue 4, pp. 345-678.'
  },
  {
    id: 'advanced-bork-theory',
    title: 'Advanced BORK Theory: A Comprehensive Analysis',
    journal: 'International Conference on BORK',
    year: 2024,
    category: 'conferences',
    abstract: 'Keynote presentation analyzing advanced theories in the realm of BORK dynamics.',
    content: 'Presented at the International Conference on BORK (ICBORK 2024).'
  },
  {
    id: 'future-of-bork',
    title: 'The Future of BORK: A Vision for 2025 and Beyond',
    journal: 'BORK Summit 2024',
    year: 2024,
    category: 'conferences',
    abstract: 'A visionary address outlining future possibilities and advancements in BORK research.',
    content: 'Delivered at the BORK Summit 2024, Stockholm.'
  },
  {
    id: 'bork-handbook',
    title: 'The BORK Handbook: Theory and Practice',
    journal: 'BORK University Press',
    year: 2024,
    category: 'books',
    abstract: 'A definitive guide to BORK theory, encompassing its applications and foundational principles.',
    content: 'Published by BORK University Press.'
  },
  {
    id: 'understanding-bork',
    title: `Understanding BORK: A Beginner's Guide`,
    journal: 'Advanced Topics in Blockchain',
    year: 2024,
    category: 'books',
    abstract: 'A beginner-friendly chapter introducing BORK concepts within the blockchain domain.',
    content: 'Included in "Advanced Topics in Blockchain," Chapter 7, pp. 142-168.'
  }
];
