CREATE TABLE "attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"worker_id" integer NOT NULL,
	"date" text NOT NULL,
	"check_in" text,
	"check_out" text,
	"overtime_hours" real DEFAULT 0,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leave_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"worker_id" integer NOT NULL,
	"type" text DEFAULT 'Vjetor' NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"days" integer NOT NULL,
	"status" text DEFAULT 'Në Pritje' NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payslips" (
	"id" serial PRIMARY KEY NOT NULL,
	"worker_id" integer NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"gross_salary" real NOT NULL,
	"net_salary" real NOT NULL,
	"pension_contribution" real DEFAULT 0,
	"tax_amount" real DEFAULT 0,
	"bonuses" real DEFAULT 0,
	"deductions" real DEFAULT 0,
	"status" text DEFAULT 'E Papaguar' NOT NULL,
	"notes" text,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "worker_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"worker_id" integer NOT NULL,
	"change_type" text NOT NULL,
	"old_value" text,
	"new_value" text NOT NULL,
	"effective_date" text NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "workers" ADD COLUMN "payment_method" text DEFAULT 'bank' NOT NULL;--> statement-breakpoint
ALTER TABLE "workers" ADD COLUMN "portal_token" text;