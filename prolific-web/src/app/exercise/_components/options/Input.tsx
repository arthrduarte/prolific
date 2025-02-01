interface InputProps {
  value: string;
  isAnswered: boolean;
  isCorrect: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  value,
  isAnswered,
  isCorrect,
  onChange
}: InputProps) {
  return (
    <div className="w-full">
      <input
        type="text"
        value={value}
        onChange={onChange}
        disabled={isAnswered}
        className={`
          w-full px-4 py-4 text-lg
          border-2 rounded-xl
          transition-all duration-200
          focus:outline-none
          ${isAnswered
            ? isCorrect
              ? 'border-green-500 bg-green-50'
              : 'border-red-500 bg-red-50'
            : 'border-gray-200 focus:border-yellow-400'
          }
        `}
        placeholder="Type your answer..."
      />
    </div>
  );
} 