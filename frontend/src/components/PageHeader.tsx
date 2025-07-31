
const PageHeader = () => {
  return (
    <header className="bg-[#FFFFFF] h-20 flex items-center text-black p-4 shadow-2xl shadow-zinc-200 sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-around">
        <a href="/" className="text-2xl font-bold">JUST ORDER</a>
        <nav className="">
          <ul className="flex gap-10 text-lg">
            <li><a href="/" className="nav-link">Home</a></li>
            <li><a href="/menu" className="nav-link">Menu</a></li>
            <li><a href="/cart" className="nav-link">Cart</a></li>
            <li><a href="/orders" className="nav-link">Orders</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default PageHeader
