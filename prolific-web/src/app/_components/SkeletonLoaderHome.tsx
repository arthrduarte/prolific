interface SkeletonLoaderHomeProps {
  className?: string;
}

export default function SkeletonLoaderHome({ className }: SkeletonLoaderHomeProps) {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="h-12 w-48 mb-2 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-72 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Course Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div 
              key={index}
              className="h-[280px] w-full rounded-2xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
} 