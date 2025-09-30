import React from 'react';
import { 
  CogIcon, 
  PuzzlePieceIcon, 
  CpuChipIcon, 
  UserGroupIcon,
  ChartBarIcon,
  ArrowPathIcon,
  CubeIcon,
  BoltIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  CodeBracketIcon,
  CommandLineIcon,
  CloudIcon,
  ServerIcon,
  CursorArrowRaysIcon,
  SparklesIcon,
  FireIcon,
  StarIcon,
  EyeIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  MapIcon,
  LockClosedIcon,
  DocumentTextIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

// Custom Icon Component with Theme Colors
interface IconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent' | 'muted' | 'success' | 'danger' | 'custom';
  customColor?: string;
  className?: string;
}

const iconMap = {
  // System Icons
  'cog': CogIcon,
  'puzzle': PuzzlePieceIcon,
  'cpu': CpuChipIcon,
  'users': UserGroupIcon,
  'chart': ChartBarIcon,
  'refresh': ArrowPathIcon,
  'cube': CubeIcon,
  'bolt': BoltIcon,
  'target': EyeIcon, // Using EyeIcon as target alternative
  'globe': GlobeAltIcon,
  'academic': AcademicCapIcon,
  'rocket': RocketLaunchIcon,
  'lightbulb': LightBulbIcon,
  'shield': ShieldCheckIcon,
  'code': CodeBracketIcon,
  'terminal': CommandLineIcon,
  'cloud': CloudIcon,
  'server': ServerIcon,
  'cursor': CursorArrowRaysIcon,
  'sparkles': SparklesIcon,
  'fire': FireIcon,
  'star': StarIcon,
  'arrow': ArrowRightIcon,
  
  // Additional Icons for Landing Page
  'check-circle': CheckCircleIcon,
  'exclamation-triangle': ExclamationTriangleIcon,
  'currency-dollar': CurrencyDollarIcon,
  'clock': ClockIcon,
  'map': MapIcon,
  'lock-closed': LockClosedIcon,
  'document-text': DocumentTextIcon,
  'user-circle': UserCircleIcon,
  'question-mark-circle': QuestionMarkCircleIcon,
  'briefcase': BriefcaseIcon,
  'rocket-launch': RocketLaunchIcon,
  'academic-cap': AcademicCapIcon,
  'light-bulb': LightBulbIcon,
  'trophy': StarIcon, // Using StarIcon as trophy alternative
  'user-group': UserGroupIcon,
};

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorMap = {
  primary: '#6A9B6A',    // Green
  secondary: '#6A7B9B',  // Blue-gray
  accent: '#D44F4F',     // Red-orange
  muted: '#7B3A3A',      // Dark red
  success: '#6A9B6A',    // Green
  danger: '#D44F4F',     // Red-orange
};

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 'md', 
  color = 'primary', 
  customColor,
  className = '' 
}) => {
  const IconComponent = iconMap[name as keyof typeof iconMap];
  
  if (!IconComponent) {
    return <div className={`${sizeMap[size]} ${className}`} />;
  }

  const iconColor = color === 'custom' ? customColor : colorMap[color];

  return (
    <IconComponent 
      className={`${sizeMap[size]} ${className}`}
      style={{ color: iconColor }}
    />
  );
};

// Predefined Icon Sets for Different Sections
export const SystemIcons = {
  content: 'puzzle',
  mentoring: 'academic',
  management: 'cog',
  community: 'users',
  analytics: 'chart',
  sync: 'refresh',
  modular: 'cube',
  feedback: 'target',
  singleSource: 'globe',
  improvement: 'bolt',
};

export const ProcessIcons = {
  learning: 'academic',
  unlock: 'cursor',
  analytics: 'chart',
  progress: 'star',
  quest: 'target',
  consultation: 'lightbulb',
  feedback: 'sparkles',
  completion: 'shield',
  content: 'code',
  editor: 'terminal',
  synchronization: 'refresh',
  showcase: 'fire',
  peerReview: 'users',
  challenges: 'rocket',
  reputation: 'star',
};

export default Icon;
