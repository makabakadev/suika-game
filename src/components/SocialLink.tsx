import React from 'react';
import { Lock } from 'lucide-react';

interface SocialLinkProps {
  icon: React.ElementType; // Accepts a component reference
  label: string;
  href: string;
  locked?: boolean;
}

export const SocialLink: React.FC<SocialLinkProps> = ({
  icon: Icon,
  label,
  href,
  locked = false, // Default to unlocked
}) => {
  return (
    <a
      href={locked ? "#" : href}
      className="group relative flex items-center gap-2 text-zinc-600 hover:text-zinc-400 transition-colors"
      onClick={locked ? (e) => e.preventDefault() : undefined}
      aria-disabled={locked}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon className="w-5 h-5" />
      {locked && (
        <Lock className="w-3 h-3 absolute -right-1 -top-1 text-zinc-500" />
      )}
      <span className="sr-only">{label}</span>
    </a>
  );
};
