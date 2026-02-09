import { Layout } from "@/components/layout";
import { JobForm } from "@/components/job-form";
import { useCreateJob } from "@/hooks/use-jobs";
import { useLocation } from "wouter";

export default function CreateJob() {
  const createJob = useCreateJob();
  const [, setLocation] = useLocation();

  const handleSubmit = (data: any) => {
    createJob.mutate(data, {
      onSuccess: () => {
        // Optional: redirect after brief delay or immediately
        setLocation("/");
      }
    });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <JobForm 
          title="Krijo Procesverbal të Ri"
          onSubmit={handleSubmit}
          isPending={createJob.isPending}
        />
      </div>
    </Layout>
  );
}
