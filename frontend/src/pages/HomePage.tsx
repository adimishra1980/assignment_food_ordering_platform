import Categories from "../components/Categories";
import HeroSection from "../components/HeroSection";
import MenuSection from "../components/MenuSection";
import PageHeader from "../components/PageHeader";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <PageHeader />

      <main>
        <HeroSection />
        <Categories />

        <MenuSection/>
      </main>
    </div>
  );
}
