export default function ErrorMessage({ message, onRetry }) {
  return (
    <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 text-sm font-medium underline">
          Try again
        </button>
      )}
    </div>
  );
}
