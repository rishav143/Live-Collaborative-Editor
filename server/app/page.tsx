export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">AI Server is running</h1>
      <p className="text-sm mt-2">Available endpoints:</p>
      <ul className="list-disc list-inside text-sm mt-2">
        <li>POST /api/edit</li>
        <li>POST /api/chat</li>
        <li>POST /api/agent/search</li>
      </ul>
    </div>
  );
}
