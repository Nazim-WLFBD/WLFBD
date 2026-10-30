import {
  Award,
  BookOpen,
  Briefcase,
  CalendarDays,
  ClipboardCheck,
  Clock,
  Compass,
  Film,
  Globe,
  GraduationCap,
  Headphones,
  MessageSquare,
  Mic,
  Monitor,
  Plane,
  Smartphone,
  Target,
  Trophy,
  Users,
  Video,
  type LucideProps,
} from 'lucide-react';
import { MapleLeaf } from './MapleLeaf';

const MAP = {
  award: Award,
  book: BookOpen,
  briefcase: Briefcase,
  calendar: CalendarDays,
  clipboard: ClipboardCheck,
  clock: Clock,
  compass: Compass,
  film: Film,
  globe: Globe,
  cap: GraduationCap,
  headphones: Headphones,
  message: MessageSquare,
  mic: Mic,
  monitor: Monitor,
  plane: Plane,
  phone: Smartphone,
  target: Target,
  trophy: Trophy,
  users: Users,
  video: Video,
} as const;

export type IconName = keyof typeof MAP | 'maple';

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  if (name === 'maple') return <MapleLeaf className={props.className} size={props.size} />;
  const C = MAP[name as keyof typeof MAP] ?? Globe;
  return <C aria-hidden {...props} />;
}
