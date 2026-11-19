export default function ErrorMessage({ message, onRetry }) {
  return (
    <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-3.5 sm:p-4 text-sm sm:text-base text-red-700 break-words">
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 text-sm font-medium underline">
          Try again
        </button>
      )}
    </div>
  );
}
