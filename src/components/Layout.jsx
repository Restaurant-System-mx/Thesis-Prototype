

function Layout({ children }) {
  

  return (
    <div className="flex min-h-screen bg-bg-page">

      {/* Sidebar */}
      <div className="w-48 bg-white border-r border-border flex flex-col fixed h-full">
        
        {/* Logo */}
        <div className="px-4 py-5 border-b border-border">
          <h2 className="font-bold text-gray-800 text-base">Restaurant</h2>
          <p className="text-xs text-gray-400">Administration Panel</p>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-light text-primary font-medium text-sm">
            <span>🍽️</span>
            <span>Catalog</span>
          </a>
        </nav>

       
       <div className="px-4 py-4 border-t border-border">
         < p className="text-xs text-gray-400">v1.0.0</p>
      </div>

      </div>

      {/* Principal content */}
      <div className="flex-1 ml-48 flex flex-col">

        {/* TopBar */}
        <div className="bg-white border-b border-border px-6 py-3 flex items-center justify-end sticky top-0 z-10">
          

{/* Iconos derecha */}
<div className="flex items-center gap-3">
  <button className="text-gray-400 hover:text-gray-500">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  </button>
  <button className="text-gray-400 hover:text-gray-500">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  </button>
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
      A
    </div>
    <div>
      <p className="text-xs font-medium text-gray-700">Admin</p>
      <p className="text-xs text-gray-400">ADMIN</p>
    </div>
  </div>
  <button className="text-gray-400 hover:text-gray-600 ml-1">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  </button>
</div>

        </div>

        {/* actual page*/}
        <div className="flex-1">
          {children}
        </div>

      </div>

    </div>
  )
}

export default Layout