interface TrueFalseProps {
  selectedOption: string | null;
  correctAnswer: string | null;
  isAnswered: boolean;
  onSelect: (option: string) => void;
}

export default function TrueFalse({
  selectedOption,
  correctAnswer,
  isAnswered,
  onSelect
}: TrueFalseProps) {
  const options = ['True', 'False'];

  const getOptionStyle = (option: string) => {
    if (!isAnswered) {
      return selectedOption === option
        ? 'bg-yellow-400 border-yellow-400 text-black'
        : 'bg-white border-gray-200 text-gray-900 hover:border-yellow-400';
    }

    if (option === correctAnswer) {
      return 'bg-green-50 border-green-500 text-green-700';
    }

    if (option === selectedOption) {
      return 'bg-red-50 border-red-500 text-red-700';
    }

    return 'bg-white border-gray-200 text-gray-400';
  };

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => !isAnswered && onSelect(option)}
          disabled={isAnswered}
          className={`
            w-full px-4 py-4
            border-2 rounded-xl
            font-medium text-base
            transition-all duration-200
            ${getOptionStyle(option)}
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
} 