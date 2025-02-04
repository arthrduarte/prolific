export default function SkeletonLoaderQuestion() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="p-6 pb-6 bg-white border-b border-gray-100">
        <div className="h-1 bg-gray-100 rounded overflow-hidden mb-4">
          <div className="h-full w-[30%] bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-8 w-[60%] bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Question Text Skeletons */}
        <div className="mb-8">
          <div className="h-4 w-[90%] bg-gray-200 rounded animate-pulse mb-3" />
          <div className="h-4 w-[75%] bg-gray-200 rounded animate-pulse mb-3" />
          <div className="h-4 w-[85%] bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Options Container */}
        <div className="space-y-3 mb-8">
          {[1, 2, 3, 4].map((_, index) => (
            <div 
              key={index}
              className="h-14 w-full bg-gray-200 rounded-xl animate-pulse" 
            />
          ))}
        </div>

        {/* Submit Button */}
        <div className="h-14 w-full bg-gray-200 rounded-xl animate-pulse mt-auto" />
      </div>
    </div>
  );
} 