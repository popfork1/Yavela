import { useState, useMemo } from "react";
import { Plus, MoreVertical, Edit2, Trash2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useListBookmarks, useDeleteBookmark, Bookmark } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListBookmarksQueryKey } from "@workspace/api-client-react";
import { getFaviconUrl, extractDomain } from "@/lib/utils";
import { BookmarkModal } from "./BookmarkModal";

export function BookmarkGrid() {
  const { data: bookmarks = [], isLoading } = useListBookmarks();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  // Derive categories
  const categories = useMemo(() => {
    const cats = new Set(bookmarks.map(b => b.category).filter(Boolean) as string[]);
    const catArray = Array.from(cats);
    // Ensure Pinned is first if it exists
    if (catArray.includes("Pinned")) {
      return ["All", "Pinned", ...catArray.filter(c => c !== "Pinned")];
    }
    return ["All", ...catArray];
  }, [bookmarks]);

  // Filter bookmarks
  const filteredBookmarks = useMemo(() => {
    if (activeCategory === "All") return bookmarks;
    return bookmarks.filter(b => b.category === activeCategory);
  }, [bookmarks, activeCategory]);

  const handleEdit = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBookmark(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-16 flex justify-center">
        <div className="animate-pulse flex gap-2 items-center text-muted-foreground">
          <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce animation-delay-2000" />
          <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce animation-delay-4000" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-16 px-4 md:px-8 pb-32">
      {/* Category Filter */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide mask-edges">
          {categories.map((cat, i) => (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                ${activeCategory === cat 
                  ? 'bg-white text-black shadow-lg shadow-white/10' 
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-white/5'
                }
              `}
            >
              {cat}
            </motion.button>
          ))}
        </div>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          onClick={handleAdd}
          className="ml-4 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
        </motion.button>
      </div>

      {/* Grid */}
      {filteredBookmarks.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <LinkIcon size={32} className="text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-display font-semibold text-foreground mb-2">No bookmarks found</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            {activeCategory === "All" 
              ? "Your dashboard is looking a bit empty. Add some quick links to get started." 
              : `No bookmarks in the ${activeCategory} category.`}
          </p>
          <button 
            onClick={handleAdd}
            className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> Add Bookmark
          </button>
        </motion.div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredBookmarks.map((bookmark, idx) => (
              <BookmarkCard 
                key={bookmark.id} 
                bookmark={bookmark} 
                onEdit={() => handleEdit(bookmark)}
                index={idx}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <BookmarkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        bookmarkToEdit={editingBookmark}
      />
    </div>
  );
}

function BookmarkCard({ bookmark, onEdit, index }: { bookmark: Bookmark, onEdit: () => void, index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const deleteMutation = useDeleteBookmark();
  const queryClient = useQueryClient();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Remove this bookmark?")) {
      await deleteMutation.mutateAsync({ id: bookmark.id });
      queryClient.invalidateQueries({ queryKey: getListBookmarksQueryKey() });
    }
  };

  const domain = extractDomain(bookmark.url);
  const favicon = getFaviconUrl(bookmark.url);

  return (
    <motion.a
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative block p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
          {bookmark.icon ? (
            <span className="text-2xl">{bookmark.icon}</span>
          ) : (
            <img src={favicon} alt="" className="w-6 h-6" onError={(e) => (e.currentTarget.style.display = 'none')} />
          )}
        </div>
        
        {/* Context Actions (Show on hover) */}
        <div className={`flex items-center gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-foreground transition-colors"
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {bookmark.title}
        </h3>
        <p className="text-sm text-muted-foreground truncate mt-0.5 font-medium">
          {domain}
        </p>
        
        {bookmark.description && (
          <p className="text-xs text-muted-foreground/70 mt-3 line-clamp-2 leading-relaxed">
            {bookmark.description}
          </p>
        )}
      </div>

      {bookmark.category && (
        <div className="mt-auto pt-4">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-white/5 border border-white/10 text-muted-foreground">
            {bookmark.category}
          </span>
        </div>
      )}
    </motion.a>
  );
}

// Just an icon for the empty state
function LinkIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
}
