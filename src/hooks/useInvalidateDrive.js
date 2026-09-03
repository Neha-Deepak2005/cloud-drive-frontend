import { useQueryClient } from "@tanstack/react-query";

/**
 * A file/folder change (rename, move, star, trash, restore, upload...) can
 * affect what several different views show (My Drive, Search, Starred,
 * Trash), so invalidate all of them together rather than just the view the
 * action was triggered from - otherwise switching views can show stale
 * React Query cache for a few seconds.
 */
export function useInvalidateDrive() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["folder"] });
    queryClient.invalidateQueries({ queryKey: ["starred"] });
    queryClient.invalidateQueries({ queryKey: ["search"] });
    queryClient.invalidateQueries({ queryKey: ["trash"] });
  };
}
