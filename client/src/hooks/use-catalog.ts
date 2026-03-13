import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertCatalogItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useCatalog() {
  return useQuery({
    queryKey: [api.catalog.list.path],
    queryFn: async () => {
      const res = await fetch(api.catalog.list.path);
      if (!res.ok) throw new Error('Failed to fetch catalog');
      return res.json();
    },
  });
}

export function useCreateCatalogItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertCatalogItem) => {
      const res = await fetch(api.catalog.create.path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create item');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.catalog.list.path] });
      toast({ title: "Sukses", description: "Artikulli u shtua!" });
    },
    onError: () => toast({ title: "Gabim", variant: "destructive" }),
  });
}

export function useUpdateCatalogItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertCatalogItem>) => {
      const url = buildUrl(api.catalog.update.path, { id });
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update item');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.catalog.list.path] });
      toast({ title: "Sukses", description: "Artikulli u përditësua!" });
    },
    onError: () => toast({ title: "Gabim", variant: "destructive" }),
  });
}

export function useDeleteCatalogItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.catalog.delete.path, { id });
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.catalog.list.path] });
      toast({ title: "U fshi", description: "Artikulli u fshi." });
    },
    onError: () => toast({ title: "Gabim", variant: "destructive" }),
  });
}
