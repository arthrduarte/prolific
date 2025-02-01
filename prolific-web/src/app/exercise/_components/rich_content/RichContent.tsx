interface RichContentProps {
  richContent: any; // You might want to type this more specifically based on your data structure
}

export default function RichContent({ richContent }: RichContentProps) {
  // You can expand this component to handle different types of rich content
  // For now, we'll just render it as pre-formatted text
  return (
    <div className="my-4 p-4 bg-gray-50 rounded-xl">
      <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm">
        {JSON.stringify(richContent, null, 2)}
      </pre>
    </div>
  );
} 