import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "cms"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__pages_v_blocks_hero_cta_buttons_variant" AS ENUM('fill', 'ghost', 'weconnect');
  CREATE TYPE "cms"."enum__pages_v_blocks_platform_teaser_features_accent_color" AS ENUM('green', 'amber');
  CREATE TYPE "cms"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "cms"."_pages_v_blocks_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"label" varchar,
  	"chinese_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_hero_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"variant" "cms"."enum__pages_v_blocks_hero_cta_buttons_variant" DEFAULT 'fill',
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"headline_accent" varchar,
  	"headline_faint" varchar,
  	"chinese_subtitle" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"label" varchar,
  	"chinese_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_values_four_harmonies_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"chinese" varchar,
  	"english" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_values_five_unities_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"chinese" varchar,
  	"english" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_values_mottos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"chinese" varchar,
  	"english" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_label" varchar,
  	"headline" varchar,
  	"chinese_headline" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_about_advantages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_label" varchar,
  	"headline" varchar,
  	"headline_accent" varchar,
  	"body" jsonb,
  	"globe_stat_number" varchar,
  	"globe_stat_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_services_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"icon" varchar,
  	"title" varchar,
  	"chinese_title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_label" varchar,
  	"headline" varchar,
  	"headline_accent" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_platform_teaser_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"accent_color" "cms"."enum__pages_v_blocks_platform_teaser_features_accent_color" DEFAULT 'green',
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_platform_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_label" varchar,
  	"headline" varchar,
  	"headline_accent" varchar,
  	"body" jsonb,
  	"launch_cta_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_clients_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_pages_v_blocks_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "cms"."enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "cms"."pages_blocks_hero_stats" ALTER COLUMN "number" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_hero_stats" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_hero_cta_buttons" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_hero_cta_buttons" ALTER COLUMN "href" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_hero" ALTER COLUMN "headline" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_stats_stats" ALTER COLUMN "number" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_stats_stats" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_values_four_harmonies_items" ALTER COLUMN "chinese" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_values_four_harmonies_items" ALTER COLUMN "english" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_values_five_unities_items" ALTER COLUMN "chinese" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_values_five_unities_items" ALTER COLUMN "english" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_values_mottos" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_values_mottos" ALTER COLUMN "chinese" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_values_mottos" ALTER COLUMN "english" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_values" ALTER COLUMN "headline" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_about_advantages" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_about" ALTER COLUMN "headline" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_services_services" ALTER COLUMN "number" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_services_services" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_services" ALTER COLUMN "headline" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_platform_teaser_features" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_platform_teaser" ALTER COLUMN "headline" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_platform_teaser" ALTER COLUMN "launch_cta_label" DROP NOT NULL;
  ALTER TABLE "cms"."pages_blocks_clients_clients" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "cms"."pages" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "cms"."pages" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "cms"."pages" ADD COLUMN "_status" "cms"."enum_pages_status" DEFAULT 'draft';
  ALTER TABLE "cms"."_pages_v_blocks_hero_stats" ADD CONSTRAINT "_pages_v_blocks_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_hero_cta_buttons" ADD CONSTRAINT "_pages_v_blocks_hero_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_stats_stats" ADD CONSTRAINT "_pages_v_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_values_four_harmonies_items" ADD CONSTRAINT "_pages_v_blocks_values_four_harmonies_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v_blocks_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_values_five_unities_items" ADD CONSTRAINT "_pages_v_blocks_values_five_unities_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v_blocks_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_values_mottos" ADD CONSTRAINT "_pages_v_blocks_values_mottos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v_blocks_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_values" ADD CONSTRAINT "_pages_v_blocks_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_about_advantages" ADD CONSTRAINT "_pages_v_blocks_about_advantages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v_blocks_about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_about" ADD CONSTRAINT "_pages_v_blocks_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_services_services" ADD CONSTRAINT "_pages_v_blocks_services_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_services" ADD CONSTRAINT "_pages_v_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_platform_teaser_features" ADD CONSTRAINT "_pages_v_blocks_platform_teaser_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v_blocks_platform_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_platform_teaser" ADD CONSTRAINT "_pages_v_blocks_platform_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_clients_clients" ADD CONSTRAINT "_pages_v_blocks_clients_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v_blocks_clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v_blocks_clients" ADD CONSTRAINT "_pages_v_blocks_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_pages_v_blocks_hero_stats_order_idx" ON "cms"."_pages_v_blocks_hero_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_stats_parent_id_idx" ON "cms"."_pages_v_blocks_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_cta_buttons_order_idx" ON "cms"."_pages_v_blocks_hero_cta_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_cta_buttons_parent_id_idx" ON "cms"."_pages_v_blocks_hero_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "cms"."_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "cms"."_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "cms"."_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_stats_order_idx" ON "cms"."_pages_v_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_stats_parent_id_idx" ON "cms"."_pages_v_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "cms"."_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "cms"."_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "cms"."_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_values_four_harmonies_items_order_idx" ON "cms"."_pages_v_blocks_values_four_harmonies_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_values_four_harmonies_items_parent_id_idx" ON "cms"."_pages_v_blocks_values_four_harmonies_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_values_five_unities_items_order_idx" ON "cms"."_pages_v_blocks_values_five_unities_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_values_five_unities_items_parent_id_idx" ON "cms"."_pages_v_blocks_values_five_unities_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_values_mottos_order_idx" ON "cms"."_pages_v_blocks_values_mottos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_values_mottos_parent_id_idx" ON "cms"."_pages_v_blocks_values_mottos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_values_order_idx" ON "cms"."_pages_v_blocks_values" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_values_parent_id_idx" ON "cms"."_pages_v_blocks_values" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_values_path_idx" ON "cms"."_pages_v_blocks_values" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_about_advantages_order_idx" ON "cms"."_pages_v_blocks_about_advantages" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_advantages_parent_id_idx" ON "cms"."_pages_v_blocks_about_advantages" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_order_idx" ON "cms"."_pages_v_blocks_about" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_parent_id_idx" ON "cms"."_pages_v_blocks_about" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_path_idx" ON "cms"."_pages_v_blocks_about" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_services_services_order_idx" ON "cms"."_pages_v_blocks_services_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_services_parent_id_idx" ON "cms"."_pages_v_blocks_services_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_order_idx" ON "cms"."_pages_v_blocks_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_parent_id_idx" ON "cms"."_pages_v_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_path_idx" ON "cms"."_pages_v_blocks_services" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_platform_teaser_features_order_idx" ON "cms"."_pages_v_blocks_platform_teaser_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_platform_teaser_features_parent_id_idx" ON "cms"."_pages_v_blocks_platform_teaser_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_platform_teaser_order_idx" ON "cms"."_pages_v_blocks_platform_teaser" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_platform_teaser_parent_id_idx" ON "cms"."_pages_v_blocks_platform_teaser" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_platform_teaser_path_idx" ON "cms"."_pages_v_blocks_platform_teaser" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_clients_clients_order_idx" ON "cms"."_pages_v_blocks_clients_clients" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_clients_clients_parent_id_idx" ON "cms"."_pages_v_blocks_clients_clients" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_clients_order_idx" ON "cms"."_pages_v_blocks_clients" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_clients_parent_id_idx" ON "cms"."_pages_v_blocks_clients" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_clients_path_idx" ON "cms"."_pages_v_blocks_clients" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "cms"."_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "cms"."_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "cms"."_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "cms"."_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "cms"."_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "cms"."_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "cms"."_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "cms"."_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "cms"."_pages_v" USING btree ("autosave");
  CREATE INDEX "pages__status_idx" ON "cms"."pages" USING btree ("_status");`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms"."_pages_v_blocks_hero_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_pages_v_blocks_hero_cta_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_pages_v_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_pages_v_blocks_stats_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_pages_v_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_pages_v_blocks_values_four_harmonies_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_pages_v_blocks_values_five_unities_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_pages_v_blocks_values_mottos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_pages_v_blocks_values" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_pages_v_blocks_about_advantages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_pages_v_blocks_about" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_pages_v_blocks_services_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_pages_v_blocks_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_pages_v_blocks_platform_teaser_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_pages_v_blocks_platform_teaser" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_pages_v_blocks_clients_clients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_pages_v_blocks_clients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_pages_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cms"."_pages_v_blocks_hero_stats" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_hero_cta_buttons" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_hero" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_stats_stats" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_stats" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_values_four_harmonies_items" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_values_five_unities_items" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_values_mottos" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_values" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_about_advantages" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_about" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_services_services" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_services" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_platform_teaser_features" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_platform_teaser" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_clients_clients" CASCADE;
  DROP TABLE "cms"."_pages_v_blocks_clients" CASCADE;
  DROP TABLE "cms"."_pages_v" CASCADE;
  DROP INDEX "cms"."pages__status_idx";
  ALTER TABLE "cms"."pages_blocks_hero_stats" ALTER COLUMN "number" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_hero_stats" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_hero_cta_buttons" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_hero_cta_buttons" ALTER COLUMN "href" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_hero" ALTER COLUMN "headline" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_stats_stats" ALTER COLUMN "number" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_stats_stats" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_values_four_harmonies_items" ALTER COLUMN "chinese" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_values_four_harmonies_items" ALTER COLUMN "english" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_values_five_unities_items" ALTER COLUMN "chinese" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_values_five_unities_items" ALTER COLUMN "english" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_values_mottos" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_values_mottos" ALTER COLUMN "chinese" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_values_mottos" ALTER COLUMN "english" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_values" ALTER COLUMN "headline" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_about_advantages" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_about" ALTER COLUMN "headline" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_services_services" ALTER COLUMN "number" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_services_services" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_services" ALTER COLUMN "headline" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_platform_teaser_features" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_platform_teaser" ALTER COLUMN "headline" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_platform_teaser" ALTER COLUMN "launch_cta_label" SET NOT NULL;
  ALTER TABLE "cms"."pages_blocks_clients_clients" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "cms"."pages" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "cms"."pages" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "cms"."pages" DROP COLUMN "_status";
  DROP TYPE "cms"."enum_pages_status";
  DROP TYPE "cms"."enum__pages_v_blocks_hero_cta_buttons_variant";
  DROP TYPE "cms"."enum__pages_v_blocks_platform_teaser_features_accent_color";
  DROP TYPE "cms"."enum__pages_v_version_status";`)
}
