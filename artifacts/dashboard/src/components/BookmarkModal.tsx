import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Link as LinkIcon, Type, Tag, Image as ImageIcon } from "lucide-react";
import { useCreateBookmark, useUpdateBookmark, Bookmark } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListBookmarksQueryKey } from "@workspace/api-client-react";

const bookmarkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Must be a valid URL (e.g. https://example.com)"),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
});

type BookmarkFormData = z.infer<typeof bookmarkSchema>;

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkToEdit?: Bookmark | null;
}

export function BookmarkModal({ isOpen, onClose, bookmarkToEdit }: BookmarkModalProps) {
  const queryClient = useQueryClient();
  const createMutation = useCreateBookmark();
  const updateMutation = useUpdateBookmark();

  const isEditing = !!bookmarkToEdit;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<BookmarkFormData>({
    resolver: zodResolver(bookmarkSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
      category: "General",
      icon: "",
    }
  });

  useEffect(() => {
    if (isOpen && bookmarkToEdit) {
      reset({
        title: bookmarkToEdit.title,
        url: bookmarkToEdit.url,
        description: bookmarkToEdit.description || "",
        category: bookmarkToEdit.category || "General",
        icon: bookmarkToEdit.icon || "",
      });
    } else if (isOpen) {
      reset({
        title: "",
        url: "",
        description: "",
        category: "General",
        icon: "",
      });
    }
  }, [isOpen, bookmarkToEdit, reset]);

  const onSubmit = async (data: BookmarkFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: bookmarkToEdit.id,
          data: data
        });
      } else {
        await createMutation.mutateAsync({ data });
      }
      queryClient.invalidateQueries({ queryKey: getListBookmarksQueryKey() });
      onClose();
    } catch (error) {
      console.error("Failed to save bookmark", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-background/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h2 className="text-xl font-display font-semibold text-foreground">
                  {isEditing ? "Edit Bookmark" : "Add Bookmark"}
                </h2>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Type size={14} /> Title
                  </label>
                  <input 
                    {...register("title")}
                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-foreground"
                    placeholder="e.g. GitHub"
                  />
                  {errors.title && <span className="text-xs text-destructive">{errors.title.message}</span>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <LinkIcon size={14} /> URL
                  </label>
                  <input 
                    {...register("url")}
                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-foreground"
                    placeholder="https://..."
                  />
                  {errors.url && <span className="text-xs text-destructive">{errors.url.message}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Tag size={14} /> Category
                    </label>
                    <input 
                      {...register("category")}
                      className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-foreground"
                      placeholder="e.g. Work, Social"
                      list="categories"
                    />
                    <datalist id="categories">
                      <option value="Pinned" />
                      <option value="Work" />
                      <option value="Social" />
                      <option value="Tools" />
                      <option value="Reading" />
                    </datalist>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <ImageIcon size={14} /> Emoji Icon (opt)
                    </label>
                    <input 
                      {...register("icon")}
                      className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-foreground"
                      placeholder="🚀"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    Description (optional)
                  </label>
                  <input 
                    {...register("description")}
                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-foreground"
                    placeholder="A brief note about this link..."
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl font-medium text-muted-foreground hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl font-medium bg-white text-black hover:bg-gray-200 focus:ring-4 focus:ring-white/20 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? "Saving..." : "Save Bookmark"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
