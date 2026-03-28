import { Background } from "@/components/Background";
import { Clock } from "@/components/Clock";
import { SearchBar } from "@/components/SearchBar";
import { WidgetsArea } from "@/components/Widgets";
import { BookmarkGrid } from "@/components/BookmarkGrid";

export function Dashboard() {
  return (
    <main className="min-h-screen w-full relative flex flex-col">
      <Background />
      <WidgetsArea />
      
      <div className="flex-1 flex flex-col pt-24 md:pt-32 px-4 z-10">
        <Clock />
        <SearchBar />
        <BookmarkGrid />
      </div>
    </main>
  );
}
