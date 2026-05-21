import { useAuth } from "../context/AuthContext";

export function useDeleteArtwork(onSuccess: () => void) {
  const { token } = useAuth();

  return async (id: string | number): Promise<void> => {
    if (!window.confirm("Delete this artwork?")) return;
    try {
      const res = await fetch(`/api/artworks/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed.");
      onSuccess();
    } catch (err) {
      alert(
        "Error deleting: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };
}