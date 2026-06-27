import React from 'react';
import * as Lucide from 'lucide-react';

interface IconProps extends React.ComponentPropsWithoutRef<'svg'> {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', size = 20, ...props }) => {
  // Safe lookup with fallback
  const LucideIcon = (Lucide as any)[name];
  
  if (!LucideIcon) {
    // Return a default icon like GraduationCap if the specified icon is not found
    const Fallback = Lucide.GraduationCap;
    return <Fallback className={className} size={size} {...props} />;
  }

  return <LucideIcon className={className} size={size} {...props} />;
};
export default Icon;
