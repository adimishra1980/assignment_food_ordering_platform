// src/components/Categories.tsx
const categories = [
  { name: 'Pizzas', icon: '🍕' },
  { name: 'Pasta', icon: '🍝' },
  { name: 'Burgers', icon: '🍔' },
  { name: 'Drinks', icon: '🥤' },
  
];

export default function Categories() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto text-center">
        <h3 className="text-3xl font-bold mb-10">Categories</h3>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {categories.map((category) => (
            <div key={category.name} className="bg-white p-6 rounded-xl shadow-md w-40 h-40 flex flex-col justify-center items-center cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all">
              <span className="text-5xl mb-2">{category.icon}</span>
              <p className="font-semibold text-lg">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}