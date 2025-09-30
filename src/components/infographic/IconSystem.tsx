import React from 'react';
import { 
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  CogIcon,
  ChartBarIcon,
  UserIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  StarIcon,
  HeartIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  CloudIcon,
  LockClosedIcon,
  EyeIcon,
  HandThumbUpIcon,
  XCircleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  ExclamationCircleIcon,
  CheckBadgeIcon,
  SparklesIcon,
  FireIcon,
  BoltIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  HomeIcon,
  MapIcon,
  CalendarIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  BookmarkIcon,
  TagIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PlusIcon,
  MinusIcon as MinusIconSolid
} from '@heroicons/react/24/outline';

// Import design system CSS
import '../../styles/design-system.css';

// ========================================
// TYPE DEFINITIONS
// ========================================

export type IconSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
export type IconColor = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'neutral' | 'white' | 'black';
export type IconBackground = 'none' | 'subtle' | 'solid' | 'gradient';
export type IconVariant = 'outline' | 'solid' | 'mini';

export interface IconProps {
  name: IconName;
  size?: IconSize;
  color?: IconColor;
  background?: IconBackground;
  variant?: IconVariant;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

// ========================================
// ICON NAME TYPES
// ========================================

export type IconName = 
  // Status & Actions
  | 'alert' | 'search' | 'success' | 'settings' | 'trending-up' | 'trending-down' | 'neutral'
  | 'star' | 'heart' | 'like' | 'error' | 'info' | 'question' | 'warning' | 'verified'
  
  // Business & Data
  | 'user' | 'business' | 'money' | 'time' | 'analytics' | 'chart' | 'data' | 'report'
  | 'presentation' | 'document' | 'table' | 'pie-chart'
  
  // Technology & Innovation
  | 'idea' | 'rocket' | 'security' | 'globe' | 'mobile' | 'desktop' | 'cloud' | 'lock'
  | 'eye' | 'sparkles' | 'fire' | 'bolt' | 'education'
  
  // Work & Life
  | 'briefcase' | 'home' | 'map' | 'calendar' | 'photo' | 'video' | 'audio' | 'chat'
  | 'share' | 'bookmark' | 'tag' | 'tools' | 'checklist'
  
  // Navigation & UI
  | 'arrow-right' | 'arrow-left' | 'chevron-right' | 'chevron-left' | 'chevron-up' | 'chevron-down'
  | 'plus' | 'minus' | 'close';

// ========================================
// ICON MAPPING
// ========================================

const iconMap: Record<IconName, React.ComponentType<any>> = {
  // Status & Actions
  'alert': ExclamationTriangleIcon,
  'search': MagnifyingGlassIcon,
  'success': CheckCircleIcon,
  'settings': CogIcon,
  'trending-up': ArrowTrendingUpIcon,
  'trending-down': ArrowTrendingDownIcon,
  'neutral': MinusIcon,
  'star': StarIcon,
  'heart': HeartIcon,
  'like': HandThumbUpIcon,
  'error': XCircleIcon,
  'info': InformationCircleIcon,
  'question': QuestionMarkCircleIcon,
  'warning': ExclamationCircleIcon,
  'verified': CheckBadgeIcon,
  
  // Business & Data
  'user': UserIcon,
  'business': BuildingOfficeIcon,
  'money': CurrencyDollarIcon,
  'time': ClockIcon,
  'analytics': ChartBarIcon,
  'chart': ChartBarIcon,
  'data': ChartBarIcon,
  'report': DocumentTextIcon,
  'presentation': ChartBarIcon,
  'document': DocumentTextIcon,
  'table': ChartBarIcon,
  'pie-chart': ChartBarIcon,
  
  // Technology & Innovation
  'idea': LightBulbIcon,
  'rocket': RocketLaunchIcon,
  'security': ShieldCheckIcon,
  'globe': GlobeAltIcon,
  'mobile': DevicePhoneMobileIcon,
  'desktop': ComputerDesktopIcon,
  'cloud': CloudIcon,
  'lock': LockClosedIcon,
  'eye': EyeIcon,
  'sparkles': SparklesIcon,
  'fire': FireIcon,
  'bolt': BoltIcon,
  'education': AcademicCapIcon,
  
  // Work & Life
  'briefcase': BriefcaseIcon,
  'home': HomeIcon,
  'map': MapIcon,
  'calendar': CalendarIcon,
  'photo': PhotoIcon,
  'video': VideoCameraIcon,
  'audio': SpeakerWaveIcon,
  'chat': ChatBubbleLeftRightIcon,
  'share': ShareIcon,
  'bookmark': BookmarkIcon,
  'tag': TagIcon,
  'tools': WrenchScrewdriverIcon,
  'checklist': ClipboardDocumentListIcon,
  
  // Navigation & UI
  'arrow-right': ArrowRightIcon,
  'arrow-left': ArrowLeftIcon,
  'chevron-right': ChevronRightIcon,
  'chevron-left': ChevronLeftIcon,
  'chevron-up': ChevronUpIcon,
  'chevron-down': ChevronDownIcon,
  'plus': PlusIcon,
  'minus': MinusIconSolid,
  'close': XCircleIcon
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

const getSizeClasses = (size: IconSize): string => {
  const sizeMap = {
    xs: 'w-3 h-3',      // 12px
    sm: 'w-4 h-4',      // 16px
    base: 'w-5 h-5',    // 20px
    lg: 'w-6 h-6',      // 24px
    xl: 'w-8 h-8',      // 32px
    '2xl': 'w-12 h-12', // 48px
    '3xl': 'w-16 h-16'  // 64px
  };
  return sizeMap[size];
};

const getColorClasses = (color: IconColor): string => {
  const colorMap = {
    primary: 'text-blue-600',
    secondary: 'text-purple-600',
    accent: 'text-orange-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    neutral: 'text-gray-600',
    white: 'text-white',
    black: 'text-black'
  };
  return colorMap[color];
};

const getBackgroundClasses = (background: IconBackground, color: IconColor): string => {
  if (background === 'none') return '';
  
  const backgroundMap = {
    subtle: {
      primary: 'bg-blue-100',
      secondary: 'bg-purple-100',
      accent: 'bg-orange-100',
      success: 'bg-green-100',
      warning: 'bg-yellow-100',
      error: 'bg-red-100',
      neutral: 'bg-gray-100',
      white: 'bg-gray-100',
      black: 'bg-gray-200'
    },
    solid: {
      primary: 'bg-blue-600',
      secondary: 'bg-purple-600',
      accent: 'bg-orange-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      error: 'bg-red-600',
      neutral: 'bg-gray-600',
      white: 'bg-white',
      black: 'bg-black'
    },
    gradient: {
      primary: 'bg-gradient-to-br from-blue-500 to-blue-600',
      secondary: 'bg-gradient-to-br from-purple-500 to-purple-600',
      accent: 'bg-gradient-to-br from-orange-500 to-orange-600',
      success: 'bg-gradient-to-br from-green-500 to-green-600',
      warning: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      error: 'bg-gradient-to-br from-red-500 to-red-600',
      neutral: 'bg-gradient-to-br from-gray-500 to-gray-600',
      white: 'bg-gradient-to-br from-gray-100 to-gray-200',
      black: 'bg-gradient-to-br from-gray-800 to-gray-900'
    }
  };
  
  return backgroundMap[background][color];
};

const getBackgroundSizeClasses = (size: IconSize): string => {
  const sizeMap = {
    xs: 'w-6 h-6',      // 24px
    sm: 'w-8 h-8',      // 32px
    base: 'w-10 h-10',  // 40px
    lg: 'w-12 h-12',    // 48px
    xl: 'w-16 h-16',    // 64px
    '2xl': 'w-20 h-20', // 80px
    '3xl': 'w-24 h-24'  // 96px
  };
  return sizeMap[size];
};

const getPaddingClasses = (size: IconSize): string => {
  const paddingMap = {
    xs: 'p-1',
    sm: 'p-1.5',
    base: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3',
    '2xl': 'p-4',
    '3xl': 'p-5'
  };
  return paddingMap[size];
};

// ========================================
// MAIN ICON COMPONENT
// ========================================

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'base',
  color = 'neutral',
  background = 'none',
  variant = 'outline',
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = false,
  ...props
}) => {
  // Get the icon component
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon map`);
    return null;
  }
  
  // Build classes
  const sizeClasses = getSizeClasses(size);
  const colorClasses = getColorClasses(color);
  const backgroundClasses = getBackgroundClasses(background, color);
  const backgroundSizeClasses = background !== 'none' ? getBackgroundSizeClasses(size) : '';
  const paddingClasses = background !== 'none' ? getPaddingClasses(size) : '';
  
  // Determine icon color based on background
  const iconColorClasses = background === 'solid' || background === 'gradient' 
    ? 'text-white' 
    : colorClasses;
  
  // Build final classes
  const iconClasses = [
    sizeClasses,
    iconColorClasses,
    'transition-colors',
    'duration-fast',
    className
  ].filter(Boolean).join(' ');
  
  // Build background classes
  const backgroundElementClasses = [
    'flex',
    'items-center',
    'justify-center',
    'rounded-lg',
    backgroundSizeClasses,
    paddingClasses,
    backgroundClasses
  ].filter(Boolean).join(' ');
  
  // Render with or without background
  if (background === 'none') {
    return (
      <IconComponent
        className={iconClasses}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        {...props}
      />
    );
  }
  
  return (
    <div className={backgroundElementClasses}>
      <IconComponent
        className={iconClasses}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        {...props}
      />
    </div>
  );
};

// ========================================
// SEMANTIC ICON COMPONENTS
// ========================================

// Status icons
export const AlertIcon = (props: Omit<IconProps, 'name'>) => <Icon name="alert" color="error" {...props} />;
export const SearchIcon = (props: Omit<IconProps, 'name'>) => <Icon name="search" color="primary" {...props} />;
export const SuccessIcon = (props: Omit<IconProps, 'name'>) => <Icon name="success" color="success" {...props} />;
export const SettingsIcon = (props: Omit<IconProps, 'name'>) => <Icon name="settings" color="accent" {...props} />;
export const TrendingUpIcon = (props: Omit<IconProps, 'name'>) => <Icon name="trending-up" color="success" {...props} />;
export const TrendingDownIcon = (props: Omit<IconProps, 'name'>) => <Icon name="trending-down" color="error" {...props} />;
export const WarningIcon = (props: Omit<IconProps, 'name'>) => <Icon name="warning" color="warning" {...props} />;
export const InfoIcon = (props: Omit<IconProps, 'name'>) => <Icon name="info" color="primary" {...props} />;
export const ErrorIcon = (props: Omit<IconProps, 'name'>) => <Icon name="error" color="error" {...props} />;

// Business icons
export const UserIconComponent = (props: Omit<IconProps, 'name'>) => <Icon name="user" color="neutral" {...props} />;
export const BusinessIcon = (props: Omit<IconProps, 'name'>) => <Icon name="business" color="primary" {...props} />;
export const MoneyIcon = (props: Omit<IconProps, 'name'>) => <Icon name="money" color="success" {...props} />;
export const TimeIcon = (props: Omit<IconProps, 'name'>) => <Icon name="time" color="neutral" {...props} />;
export const AnalyticsIcon = (props: Omit<IconProps, 'name'>) => <Icon name="analytics" color="primary" {...props} />;
export const ChartIcon = (props: Omit<IconProps, 'name'>) => <Icon name="chart" color="secondary" {...props} />;

// Technology icons
export const IdeaIcon = (props: Omit<IconProps, 'name'>) => <Icon name="idea" color="accent" {...props} />;
export const RocketIcon = (props: Omit<IconProps, 'name'>) => <Icon name="rocket" color="primary" {...props} />;
export const SecurityIcon = (props: Omit<IconProps, 'name'>) => <Icon name="security" color="success" {...props} />;
export const GlobeIcon = (props: Omit<IconProps, 'name'>) => <Icon name="globe" color="primary" {...props} />;
export const MobileIcon = (props: Omit<IconProps, 'name'>) => <Icon name="mobile" color="neutral" {...props} />;
export const DesktopIcon = (props: Omit<IconProps, 'name'>) => <Icon name="desktop" color="neutral" {...props} />;
export const CloudIconComponent = (props: Omit<IconProps, 'name'>) => <Icon name="cloud" color="secondary" {...props} />;

// ========================================
// ICON WITH BACKGROUND COMPONENT
// ========================================

export interface IconWithBackgroundProps extends IconProps {
  backgroundSize?: IconSize;
  backgroundPadding?: 'none' | 'sm' | 'md' | 'lg';
}

export const IconWithBackground: React.FC<IconWithBackgroundProps> = ({
  backgroundSize = 'lg',
  backgroundPadding = 'md',
  background = 'subtle',
  ...props
}) => {
  const paddingMap = {
    none: 'p-0',
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };
  
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    base: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
    '3xl': 'w-24 h-24'
  };
  
  const backgroundClasses = [
    'flex',
    'items-center',
    'justify-center',
    'rounded-xl',
    sizeMap[backgroundSize],
    paddingMap[backgroundPadding],
    getBackgroundClasses(background, props.color || 'neutral')
  ].join(' ');
  
  return (
    <div className={backgroundClasses}>
      <Icon {...props} size={props.size || 'lg'} />
    </div>
  );
};

// ========================================
// ICON UTILITIES
// ========================================

export const getIconForCardType = (cardType: string): IconName => {
  const typeMap: Record<string, IconName> = {
    hero: 'sparkles',
    content: 'document',
    metric: 'analytics',
    process: 'checklist',
    comparison: 'chart'
  };
  return typeMap[cardType] || 'document';
};

export const getIconForContent = (content: string): IconName => {
  const contentMap: Record<string, IconName> = {
    problem: 'alert',
    discovery: 'search',
    solution: 'success',
    implementation: 'settings',
    future: 'trending-up',
    user: 'user',
    business: 'business',
    technology: 'desktop',
    data: 'analytics',
    security: 'security',
    performance: 'bolt',
    growth: 'trending-up'
  };
  
  const lowerContent = content.toLowerCase();
  for (const [key, icon] of Object.entries(contentMap)) {
    if (lowerContent.includes(key)) {
      return icon;
    }
  }
  
  return 'document';
};

// ========================================
// DEFAULT EXPORT
// ========================================

export default Icon;
