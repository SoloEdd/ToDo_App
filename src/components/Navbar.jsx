export default function Navbar({ filter, setFilter, searchQuery, setSearchQuery }) {
  return (
    <nav className="flex items-center justify-between bg-zinc-900 px-6 py-4 text-white border-b border-zinc-700">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold">JS Todo List</h1>
        <button className="hover:text-gray-300">Home</button>
      </div>
      
      {/* Controles del Sprint 3 */}
      <div className="flex items-center gap-6">
        
        {/* Filtros de Radio Buttons */}
        <div className="flex items-center gap-3 text-sm text-blue-400">
          <span className="font-semibold">Filters</span>
          <label className="flex items-center gap-1 cursor-pointer text-white">
            <input 
              type="radio" 
              name="statusFilter" 
              value="All"
              checked={filter === "All"}
              onChange={(e) => setFilter(e.target.value)}
              className="accent-blue-500"
            /> All
          </label>
          <label className="flex items-center gap-1 cursor-pointer text-white">
            <input 
              type="radio" 
              name="statusFilter" 
              value="Completed"
              checked={filter === "Completed"}
              onChange={(e) => setFilter(e.target.value)}
              className="accent-blue-500"
            /> Completed
          </label>
          <label className="flex items-center gap-1 cursor-pointer text-white">
            <input 
              type="radio" 
              name="statusFilter" 
              value="Uncompleted"
              checked={filter === "Uncompleted"}
              onChange={(e) => setFilter(e.target.value)}
              className="accent-blue-500"
            /> Uncompleted
          </label>
        </div>

        {/* Buscador */}
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Words"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white text-black px-2 py-1 rounded w-48 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-transparent border border-zinc-600 text-blue-400 px-4 py-1 rounded text-sm hover:bg-zinc-800 transition-colors">
            Search
          </button>
        </div>
      </div>
    </nav>
  );
}