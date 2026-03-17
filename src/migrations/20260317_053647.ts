import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "cms"."enum_pages_blocks_hero_cta_buttons_variant" AS ENUM('fill', 'ghost', 'weconnect');
  CREATE TYPE "cms"."enum_pages_blocks_platform_teaser_features_accent_color" AS ENUM('green', 'amber');
  CREATE TABLE "cms"."pages_blocks_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"chinese_label" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_hero_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"variant" "cms"."enum_pages_blocks_hero_cta_buttons_variant" DEFAULT 'fill'
  );
  
  CREATE TABLE "cms"."pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar NOT NULL,
  	"headline_accent" varchar,
  	"headline_faint" varchar,
  	"chinese_subtitle" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"chinese_label" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_values_four_harmonies_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"chinese" varchar NOT NULL,
  	"english" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."pages_blocks_values_five_unities_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"chinese" varchar NOT NULL,
  	"english" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."pages_blocks_values_mottos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"chinese" varchar NOT NULL,
  	"english" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."pages_blocks_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_label" varchar,
  	"headline" varchar NOT NULL,
  	"chinese_headline" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_about_advantages" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_label" varchar,
  	"headline" varchar NOT NULL,
  	"headline_accent" varchar,
  	"body" jsonb,
  	"globe_stat_number" varchar,
  	"globe_stat_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_services_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"icon" varchar,
  	"title" varchar NOT NULL,
  	"chinese_title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_label" varchar,
  	"headline" varchar NOT NULL,
  	"headline_accent" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_platform_teaser_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"accent_color" "cms"."enum_pages_blocks_platform_teaser_features_accent_color" DEFAULT 'green'
  );
  
  CREATE TABLE "cms"."pages_blocks_platform_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_label" varchar,
  	"headline" varchar NOT NULL,
  	"headline_accent" varchar,
  	"body" jsonb,
  	"launch_cta_label" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages_blocks_clients_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."pages_blocks_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms"."pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "cms"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "cms"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "cms"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "cms"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."platform_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ai_matching_headline" varchar DEFAULT 'Describe what you''re looking for',
  	"ai_matching_description" varchar DEFAULT 'Tell us your needs in plain language — AI will find the best matches · 用自然语言描述需求，AI为您精准匹配',
  	"ai_matching_placeholder" varchar DEFAULT 'e.g. We are a biotech startup looking for a wet lab 500–1000 sqft near one-north Singapore, budget SGD 5 000/month…',
  	"funding_placeholder_title" varchar DEFAULT 'We''re still building this out',
  	"funding_placeholder_body" jsonb,
  	"markets_placeholder_title" varchar DEFAULT 'We''re still building this out',
  	"markets_placeholder_body" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"colors_amber" varchar,
  	"colors_green" varchar,
  	"colors_bg" varchar,
  	"colors_bg2" varchar,
  	"colors_text" varchar,
  	"colors_muted" varchar,
  	"colors_line" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "cms"."pages_blocks_hero_stats" ADD CONSTRAINT "pages_blocks_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_hero_cta_buttons" ADD CONSTRAINT "pages_blocks_hero_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_stats_stats" ADD CONSTRAINT "pages_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_values_four_harmonies_items" ADD CONSTRAINT "pages_blocks_values_four_harmonies_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages_blocks_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_values_five_unities_items" ADD CONSTRAINT "pages_blocks_values_five_unities_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages_blocks_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_values_mottos" ADD CONSTRAINT "pages_blocks_values_mottos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages_blocks_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_values" ADD CONSTRAINT "pages_blocks_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_about_advantages" ADD CONSTRAINT "pages_blocks_about_advantages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages_blocks_about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_about" ADD CONSTRAINT "pages_blocks_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_services_services" ADD CONSTRAINT "pages_blocks_services_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_services" ADD CONSTRAINT "pages_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_platform_teaser_features" ADD CONSTRAINT "pages_blocks_platform_teaser_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages_blocks_platform_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_platform_teaser" ADD CONSTRAINT "pages_blocks_platform_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_clients_clients" ADD CONSTRAINT "pages_blocks_clients_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages_blocks_clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."pages_blocks_clients" ADD CONSTRAINT "pages_blocks_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_stats_order_idx" ON "cms"."pages_blocks_hero_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_stats_parent_id_idx" ON "cms"."pages_blocks_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_cta_buttons_order_idx" ON "cms"."pages_blocks_hero_cta_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_cta_buttons_parent_id_idx" ON "cms"."pages_blocks_hero_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "cms"."pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "cms"."pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "cms"."pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_stats_order_idx" ON "cms"."pages_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_stats_parent_id_idx" ON "cms"."pages_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "cms"."pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "cms"."pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "cms"."pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_values_four_harmonies_items_order_idx" ON "cms"."pages_blocks_values_four_harmonies_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_values_four_harmonies_items_parent_id_idx" ON "cms"."pages_blocks_values_four_harmonies_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_values_five_unities_items_order_idx" ON "cms"."pages_blocks_values_five_unities_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_values_five_unities_items_parent_id_idx" ON "cms"."pages_blocks_values_five_unities_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_values_mottos_order_idx" ON "cms"."pages_blocks_values_mottos" USING btree ("_order");
  CREATE INDEX "pages_blocks_values_mottos_parent_id_idx" ON "cms"."pages_blocks_values_mottos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_values_order_idx" ON "cms"."pages_blocks_values" USING btree ("_order");
  CREATE INDEX "pages_blocks_values_parent_id_idx" ON "cms"."pages_blocks_values" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_values_path_idx" ON "cms"."pages_blocks_values" USING btree ("_path");
  CREATE INDEX "pages_blocks_about_advantages_order_idx" ON "cms"."pages_blocks_about_advantages" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_advantages_parent_id_idx" ON "cms"."pages_blocks_about_advantages" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_order_idx" ON "cms"."pages_blocks_about" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_parent_id_idx" ON "cms"."pages_blocks_about" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_path_idx" ON "cms"."pages_blocks_about" USING btree ("_path");
  CREATE INDEX "pages_blocks_services_services_order_idx" ON "cms"."pages_blocks_services_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_services_parent_id_idx" ON "cms"."pages_blocks_services_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_order_idx" ON "cms"."pages_blocks_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_parent_id_idx" ON "cms"."pages_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_path_idx" ON "cms"."pages_blocks_services" USING btree ("_path");
  CREATE INDEX "pages_blocks_platform_teaser_features_order_idx" ON "cms"."pages_blocks_platform_teaser_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_platform_teaser_features_parent_id_idx" ON "cms"."pages_blocks_platform_teaser_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_platform_teaser_order_idx" ON "cms"."pages_blocks_platform_teaser" USING btree ("_order");
  CREATE INDEX "pages_blocks_platform_teaser_parent_id_idx" ON "cms"."pages_blocks_platform_teaser" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_platform_teaser_path_idx" ON "cms"."pages_blocks_platform_teaser" USING btree ("_path");
  CREATE INDEX "pages_blocks_clients_clients_order_idx" ON "cms"."pages_blocks_clients_clients" USING btree ("_order");
  CREATE INDEX "pages_blocks_clients_clients_parent_id_idx" ON "cms"."pages_blocks_clients_clients" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_clients_order_idx" ON "cms"."pages_blocks_clients" USING btree ("_order");
  CREATE INDEX "pages_blocks_clients_parent_id_idx" ON "cms"."pages_blocks_clients" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_clients_path_idx" ON "cms"."pages_blocks_clients" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "cms"."pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "cms"."pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "cms"."pages" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "cms"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "cms"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "cms"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "cms"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "cms"."users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "cms"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "cms"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "cms"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "cms"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "cms"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "cms"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "cms"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "cms"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "cms"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "cms"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "cms"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "cms"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "cms"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "cms"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "cms"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "cms"."payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "cms"."pages_blocks_hero_stats" CASCADE;
  DROP TABLE "cms"."pages_blocks_hero_cta_buttons" CASCADE;
  DROP TABLE "cms"."pages_blocks_hero" CASCADE;
  DROP TABLE "cms"."pages_blocks_stats_stats" CASCADE;
  DROP TABLE "cms"."pages_blocks_stats" CASCADE;
  DROP TABLE "cms"."pages_blocks_values_four_harmonies_items" CASCADE;
  DROP TABLE "cms"."pages_blocks_values_five_unities_items" CASCADE;
  DROP TABLE "cms"."pages_blocks_values_mottos" CASCADE;
  DROP TABLE "cms"."pages_blocks_values" CASCADE;
  DROP TABLE "cms"."pages_blocks_about_advantages" CASCADE;
  DROP TABLE "cms"."pages_blocks_about" CASCADE;
  DROP TABLE "cms"."pages_blocks_services_services" CASCADE;
  DROP TABLE "cms"."pages_blocks_services" CASCADE;
  DROP TABLE "cms"."pages_blocks_platform_teaser_features" CASCADE;
  DROP TABLE "cms"."pages_blocks_platform_teaser" CASCADE;
  DROP TABLE "cms"."pages_blocks_clients_clients" CASCADE;
  DROP TABLE "cms"."pages_blocks_clients" CASCADE;
  DROP TABLE "cms"."pages" CASCADE;
  DROP TABLE "cms"."users_sessions" CASCADE;
  DROP TABLE "cms"."users" CASCADE;
  DROP TABLE "cms"."payload_kv" CASCADE;
  DROP TABLE "cms"."payload_locked_documents" CASCADE;
  DROP TABLE "cms"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "cms"."payload_preferences" CASCADE;
  DROP TABLE "cms"."payload_preferences_rels" CASCADE;
  DROP TABLE "cms"."payload_migrations" CASCADE;
  DROP TABLE "cms"."platform_settings" CASCADE;
  DROP TABLE "cms"."site_settings" CASCADE;
  DROP TYPE "cms"."enum_pages_blocks_hero_cta_buttons_variant";
  DROP TYPE "cms"."enum_pages_blocks_platform_teaser_features_accent_color";`)
}
