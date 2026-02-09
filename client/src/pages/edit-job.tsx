import { Layout } from "@/components/layout";
import { JobForm } from "@/components/job-form";
import { useJob, useUpdateJob } from "@/hooks/use-jobs";
import { useRoute, useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function EditJob() {
  const [, params] = useRoute("/edit/:id");
  const id = parseInt(params?.id || "0");
  const { data: job, isLoading } = useJob(id);
  const updateJob = useUpdateJob();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <Layout>
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="h-[60vh] flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold mb-2">Procesverbali nuk u gjet</h2>
          <p className="text-muted-foreground">Kërkimi juaj nuk ktheu asnjë rezultat.</p>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (data: any) => {
    updateJob.mutate({ id, ...data }, {
      onSuccess: () => {
        setLocation("/");
      }
    });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <JobForm 
          title={`Ndrysho: ${job.clientName}`}
          initialData={job}
          onSubmit={handleSubmit}
          isPending={updateJob.isPending}
        />
      </div>
    </Layout>
  );
}
