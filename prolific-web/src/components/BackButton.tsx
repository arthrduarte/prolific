'use client';

import { FaChevronLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()}
      className="
        w-10 h-10 rounded-full 
        bg-gray-100 
        flex items-center justify-center
        mb-6 transition-all duration-200
        hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300
      "
    >
      <FaChevronLeft className="w-4 h-4 text-black" />
    </button>
  );
} 