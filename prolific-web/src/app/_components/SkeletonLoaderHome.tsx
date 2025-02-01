interface SkeletonLoaderHomeProps {
  className?: string;
}

export default function SkeletonLoaderHome({ className }: SkeletonLoaderHomeProps) {
  return (
    <div 
      className={`
        bg-gray-200 rounded
        animate-pulse
        ${className}
      `}
    />
  );
} 