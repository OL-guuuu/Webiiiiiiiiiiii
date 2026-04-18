import React from 'react';
import {
  Globe,
  Mail,
} from 'lucide-react';
import {
  FaDribbble as Dribbble,
  FaFacebook as Facebook,
  FaFigma as Figma,
  FaGithub as Github,
  FaInstagram as Instagram,
  FaLinkedin as Linkedin,
  FaTwitter as Twitter,
  FaYoutube as Youtube,
} from 'react-icons/fa';
import type { SiteSocialIconKey } from '../config/siteConfig';

type IconProps = {
  size?: number;
  strokeWidth?: number;
  className?: string;
};

// Behance icon redrawn in a Lucide-compatible 24x24 outline style.
export const BehanceIcon: React.FC<IconProps> = ({
  size = 24,
  strokeWidth = 1.5,
  className = ''
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide ${className}`.trim()}
  >
    <path d="M3 18v-12h4.5a3 3 0 0 1 0 6a3 3 0 0 1 0 6h-4.5" />
    <path d="M3 12h4.5" />
    <path d="M14 13h7a3.5 3.5 0 0 0 -7 0v2a3.5 3.5 0 0 0 6.64 1" />
    <path d="M16 6h3" />
  </svg>
);

export const InstagramIcon = Instagram;
export const LinkedinIcon = Linkedin;
export const GithubIcon = Github;
export const TwitterIcon = Twitter;
export const FacebookIcon = Facebook;
export const YoutubeIcon = Youtube;
export const DribbbleIcon = Dribbble;
export const FigmaIcon = Figma;
export const GlobeIcon = Globe;
export const MailIcon = Mail;

type SocialIconComponent = React.ComponentType<IconProps>;

export const SOCIAL_ICON_COMPONENTS: Record<SiteSocialIconKey, SocialIconComponent> = {
  behance: BehanceIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  github: GithubIcon,
  twitter: TwitterIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
  dribbble: DribbbleIcon,
  figma: FigmaIcon,
  globe: GlobeIcon,
  mail: MailIcon,
};

export const getSocialIconComponent = (icon: SiteSocialIconKey): SocialIconComponent => {
  return SOCIAL_ICON_COMPONENTS[icon] ?? GlobeIcon;
};
