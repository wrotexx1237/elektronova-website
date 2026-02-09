import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateJobRequest, type UpdateJobRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useJobs() {
  const { toast } = useToast();
  return useQuery({
    queryKey: [api.jobs.list.path],
    queryFn: async () => {
      const res = await fetch(api.jobs.list.path);
      if (!res.ok) {
        toast({ title: "Error", description: "Failed to fetch jobs", variant: "destructive" });
        throw new Error('Failed to fetch jobs');
      }
      return api.jobs.list.responses[200].parse(await res.json());
    },
  });
}

export function useJob(id: number) {
  const { toast } = useToast();
  return useQuery({
    queryKey: [api.jobs.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.jobs.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) {
        toast({ title: "Error", description: "Failed to fetch job details", variant: "destructive" });
        throw new Error('Failed to fetch job');
      }
      return api.jobs.get.responses[200].parse(await res.json());
    },
    enabled: !isNaN(id),
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateJobRequest) => {
      const validated = api.jobs.create.input.parse(data);
      const res = await fetch(api.jobs.create.path, {
        method: api.jobs.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.jobs.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to create job');
      }
      return api.jobs.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.jobs.list.path] });
      toast({ title: "Sukses", description: "Procesverbali u krijua me sukses!" });
    },
    onError: (error) => {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateJobRequest) => {
      const validated = api.jobs.update.input.parse(updates);
      const url = buildUrl(api.jobs.update.path, { id });
      
      const res = await fetch(url, {
        method: api.jobs.update.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.jobs.update.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 404) throw new Error('Job not found');
        throw new Error('Failed to update job');
      }
      return api.jobs.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.jobs.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.jobs.get.path, data.id] });
      toast({ title: "Sukses", description: "Procesverbali u përditësua!" });
    },
    onError: (error) => {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.jobs.delete.path, { id });
      const res = await fetch(url, { method: api.jobs.delete.method });
      
      if (res.status === 404) throw new Error('Job not found');
      if (!res.ok) throw new Error('Failed to delete job');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.jobs.list.path] });
      toast({ title: "U fshi", description: "Procesverbali u fshi me sukses." });
    },
    onError: (error) => {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    },
  });
}
