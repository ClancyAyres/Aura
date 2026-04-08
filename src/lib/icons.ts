import {
  Mail,
  Phone,
  Github,
  Linkedin,
  Globe,
  MapPin,
  User,
  Link as LinkIcon,
  Twitter,
  Instagram,
} from "lucide-react";

export const ICONS = {
  mail: Mail,
  phone: Phone,
  github: Github,
  linkedin: Linkedin,
  globe: Globe,
  "map-pin": MapPin,
  user: User,
  link: LinkIcon,
  twitter: Twitter,
  instagram: Instagram,
} as const;

export const ICON_OPTIONS = [
  { key: "mail", label: "Email", Component: Mail },
  { key: "phone", label: "Phone", Component: Phone },
  { key: "github", label: "GitHub", Component: Github },
  { key: "linkedin", label: "LinkedIn", Component: Linkedin },
  { key: "globe", label: "Website", Component: Globe },
  { key: "map-pin", label: "Location", Component: MapPin },
  { key: "user", label: "Profile", Component: User },
  { key: "link", label: "Link", Component: LinkIcon },
  { key: "twitter", label: "Twitter", Component: Twitter },
  { key: "instagram", label: "Instagram", Component: Instagram },
];

