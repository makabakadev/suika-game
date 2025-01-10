import * as RiIcons from "react-icons/ri";
import { SocialLink } from './SocialLink';

export function Footer() {
  return (
    <footer className="border-t-2 border-gray-800 mt-12 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto text-center font-serif px-4">
        <p className="italic mb-2">Pursuing Excellence in Chicken-Based Tokenomics</p>
        <p className="text-sm text-gray-500">
          This research is purely theoretical and not financial advice.
          <br className="hidden sm:block" />
          Peer review pending. Results may vary. Side effects include excessive BORK.
        </p>
        <div className="flex items-center pt-8 pb-4 justify-center gap-8">
          <SocialLink
            icon={RiIcons.RiTwitterXLine}
            label="Twitter"
            href="https://x.com/borkinstitute"
          />
          <SocialLink
            icon={RiIcons.RiDiscordLine}
            label="Discord"
            href="https://discord.gg/EBNj62AYXr"
          />
          <SocialLink
            icon={RiIcons.RiGithubLine}
            label="Github"
            href="https://github.com"
            locked={true}
          />
        </div>
      </div>
    </footer>
  );
}