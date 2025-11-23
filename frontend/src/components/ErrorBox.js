export default function ErrorBox({ message }) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
      {message}
    </div>
  );
}
