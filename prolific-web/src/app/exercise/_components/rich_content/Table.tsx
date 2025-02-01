'use client';

import { motion } from 'framer-motion';
import { RichContentProps, TableContent } from './rich_content.type';

export default function Table({ richContent }: RichContentProps) {
  if (!richContent?.data || !richContent?.head) return null;
  
  const tableContent = richContent as TableContent;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white"
    >
      <div className="rounded-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-yellow-400 flex">
          {tableContent.head.map((header, index) => (
            <div 
              key={index}
              className="flex-1 p-4 text-center font-semibold text-sm"
            >
              {header}
            </div>
          ))}
        </div>

        {/* Rows */}
        {tableContent.data.map((row, rowIndex) => (
          <div 
            key={rowIndex}
            className={`
              flex border-t border-gray-100
              ${rowIndex === tableContent.data.length - 1 ? 'border-b-0' : ''}
            `}
          >
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className="flex-1 p-4 text-center"
              >
                <span className={`
                  text-sm
                  ${!isNaN(Number(cell)) 
                    ? 'font-semibold text-black tabular-nums' 
                    : 'text-gray-600'
                  }
                `}>
                  {!isNaN(Number(cell)) ? Number(cell).toLocaleString() : cell}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {richContent.title && (
        <p className="text-sm font-semibold text-gray-600 mt-4 text-center">
          {richContent.title}
        </p>
      )}
    </motion.div>
  );
} 