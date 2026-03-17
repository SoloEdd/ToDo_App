export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-zinc-900 px-6 py-4 text-white border-b border-red-900/50">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold">JS Todo List</h1>
        <button className="hover:text-gray-300">Home</button>
      </div>
      {/* Aquí irán los filtros y el buscador en el Sprint 3 */}
    </nav>
  );
}