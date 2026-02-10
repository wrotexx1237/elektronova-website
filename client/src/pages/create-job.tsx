import { Layout } from "@/components/layout";
import { JobForm } from "@/components/job-form";
import { useCreateJob } from "@/hooks/use-jobs";
import { useLocation, useSearch } from "wouter";
import { type JobCategory, JOB_CATEGORIES } from "@shared/schema";

const validCategories: readonly string[] = JOB_CATEGORIES;

export default function CreateJob() {
  const createJob = useCreateJob();
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const rawCategory = params.get("category") || "electric";
  const category: JobCategory = validCategories.includes(rawCategory) ? (rawCategory as JobCategory) : "electric";

  const handleSubmit = (data: any) => {
    createJob.mutate(data, {
      onSuccess: () => {
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
          defaultCategory={category}
        />
      </div>
    </Layout>
  );
}
