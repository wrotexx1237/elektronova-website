CREATE TABLE "catalog_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"name" text NOT NULL,
	"unit" text DEFAULT 'copë' NOT NULL,
	"purchase_price" real DEFAULT 0,
	"sale_price" real DEFAULT 0,
	"current_stock" real DEFAULT 0,
	"min_stock_level" real DEFAULT 0,
	"notes" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"address" text,
	"email" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"amount" real NOT NULL,
	"category" text DEFAULT 'tjeter' NOT NULL,
	"date" text NOT NULL,
	"job_id" integer,
	"supplier_id" integer,
	"notes" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"client_id" integer,
	"rating" integer DEFAULT 5 NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "job_snapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"snapshot_type" text DEFAULT 'quote' NOT NULL,
	"material_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"prices" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"purchase_prices" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"total_sale" real DEFAULT 0,
	"total_purchase" real DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_number" text,
	"client_name" text NOT NULL,
	"client_phone" text,
	"client_address" text NOT NULL,
	"work_date" text NOT NULL,
	"work_type" text NOT NULL,
	"category" text DEFAULT 'electric',
	"status" text DEFAULT 'oferte',
	"notes" text,
	"scheduled_date" text,
	"location_url" text,
	"latitude" real,
	"longitude" real,
	"feedback_token" text,
	"is_template" integer DEFAULT 0,
	"user_id" integer,
	"client_id" integer,
	"supplier_id" integer,
	"discount_type" text DEFAULT 'percent',
	"discount_value" real DEFAULT 0,
	"vat_rate" real DEFAULT 0,
	"payment_status" text DEFAULT 'pa_paguar',
	"paid_amount" real DEFAULT 0,
	"payment_date" text,
	"payment_method" text,
	"warranty_months" integer DEFAULT 12,
	"completed_date" text,
	"table1_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"table2_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"camera_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"intercom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"alarm_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"service_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"prices" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"purchase_prices" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"checklist_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"room_progress_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"job_id" integer,
	"catalog_item_id" integer,
	"is_read" integer DEFAULT 0 NOT NULL,
	"user_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "price_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"catalog_item_id" integer NOT NULL,
	"item_name" text NOT NULL,
	"old_purchase_price" real,
	"new_purchase_price" real,
	"old_sale_price" real,
	"new_sale_price" real,
	"changed_by" text,
	"changed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stock_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"catalog_item_id" integer NOT NULL,
	"item_name" text NOT NULL,
	"entry_type" text DEFAULT 'in' NOT NULL,
	"quantity" real NOT NULL,
	"previous_stock" real DEFAULT 0,
	"new_stock" real DEFAULT 0,
	"job_id" integer,
	"notes" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "supplier_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"supplier_id" integer NOT NULL,
	"catalog_item_id" integer NOT NULL,
	"price" real DEFAULT 0 NOT NULL,
	"notes" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"email" text,
	"address" text,
	"categories" jsonb DEFAULT '[]'::jsonb,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"sid" text PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp (6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"full_name" text NOT NULL,
	"role" text DEFAULT 'technician' NOT NULL,
	"phone" text,
	"email" text,
	"is_active" integer DEFAULT 1 NOT NULL,
	"assigned_categories" jsonb DEFAULT '[]'::jsonb,
	"two_factor_secret" text,
	"two_factor_enabled" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "supplier_catalog_unique" ON "supplier_prices" USING btree ("supplier_id","catalog_item_id");