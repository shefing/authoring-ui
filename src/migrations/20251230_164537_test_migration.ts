import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_templates_type" AS ENUM('survey', 'confirmation', 'notification', 'reminder', 'self-service');
  CREATE TYPE "public"."enum_templates_division" AS ENUM('Corporate', 'IT Operations', 'Engineering', 'Support', 'Sales', 'Finance', 'Marketing');
  CREATE TYPE "public"."enum_templates_category" AS ENUM('pre-defined', 'system', 'custom');
  CREATE TYPE "public"."enum_templates_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__templates_v_version_type" AS ENUM('survey', 'confirmation', 'notification', 'reminder', 'self-service');
  CREATE TYPE "public"."enum__templates_v_version_division" AS ENUM('Corporate', 'IT Operations', 'Engineering', 'Support', 'Sales', 'Finance', 'Marketing');
  CREATE TYPE "public"."enum__templates_v_version_category" AS ENUM('pre-defined', 'system', 'custom');
  CREATE TYPE "public"."enum__templates_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_branding_packages_theme_designer_scope" AS ENUM('all', 'survey', 'confirmation', 'notification', 'reminder', 'self-service', 'urgent', 'corporate', 'it-operations', 'engineering', 'support', 'sales', 'finance', 'marketing');
  CREATE TYPE "public"."enum_branding_packages_theme_designer_logo_pos" AS ENUM('left-inline', 'right-inline', 'before', 'after', 'center');
  CREATE TYPE "public"."enum_branding_packages_general_styling_direction" AS ENUM('ltr', 'rtl');
  CREATE TYPE "public"."enum_branding_packages_general_styling_title_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_branding_packages_signature_position" AS ENUM('left', 'right', 'center');
  CREATE TYPE "public"."enum_branding_packages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__branding_packages_v_version_theme_designer_scope" AS ENUM('all', 'survey', 'confirmation', 'notification', 'reminder', 'self-service', 'urgent', 'corporate', 'it-operations', 'engineering', 'support', 'sales', 'finance', 'marketing');
  CREATE TYPE "public"."enum__branding_packages_v_version_theme_designer_logo_pos" AS ENUM('left-inline', 'right-inline', 'before', 'after', 'center');
  CREATE TYPE "public"."enum__branding_packages_v_version_general_styling_direction" AS ENUM('ltr', 'rtl');
  CREATE TYPE "public"."enum__branding_packages_v_version_general_styling_title_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__branding_packages_v_version_signature_position" AS ENUM('left', 'right', 'center');
  CREATE TYPE "public"."enum__branding_packages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_policies_type" AS ENUM('fatigue', 'sequencing', 'vip', 'quietHours', 'routing', 'dndExceptions');
  CREATE TYPE "public"."enum_policies_vip_reminder_frequency" AS ENUM('more_frequent', 'less_frequent', 'custom');
  CREATE TYPE "public"."enum_policies_routing_preferred_channel" AS ENUM('device', 'teams', 'both');
  CREATE TYPE "public"."enum_policies_routing_both_strategy" AS ENUM('parallel', 'fallbackToTeams', 'fallbackToDevice');
  CREATE TYPE "public"."enum_policies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__policies_v_version_type" AS ENUM('fatigue', 'sequencing', 'vip', 'quietHours', 'routing', 'dndExceptions');
  CREATE TYPE "public"."enum__policies_v_version_vip_reminder_frequency" AS ENUM('more_frequent', 'less_frequent', 'custom');
  CREATE TYPE "public"."enum__policies_v_version_routing_preferred_channel" AS ENUM('device', 'teams', 'both');
  CREATE TYPE "public"."enum__policies_v_version_routing_both_strategy" AS ENUM('parallel', 'fallbackToTeams', 'fallbackToDevice');
  CREATE TYPE "public"."enum__policies_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_variables_type" AS ENUM('string', 'number', 'boolean', 'date', 'dateTime', 'url', 'email', 'enum');
  CREATE TYPE "public"."enum_variables_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__variables_v_version_type" AS ENUM('string', 'number', 'boolean', 'date', 'dateTime', 'url', 'email', 'enum');
  CREATE TYPE "public"."enum__variables_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_channels_supported_message_types" AS ENUM('survey', 'confirmation', 'notification', 'reminder', 'self-service');
  CREATE TYPE "public"."enum_channels_capabilities" AS ENUM('server-side', 'oauth');
  CREATE TYPE "public"."enum_channels_status" AS ENUM('configured', 'disabled');
  CREATE TYPE "public"."enum_messages_type" AS ENUM('survey', 'confirmation', 'notification', 'reminder', 'self-service');
  CREATE TYPE "public"."enum_messages_mode" AS ENUM('intrusive', 'non-intrusive');
  CREATE TYPE "public"."enum_messages_status" AS ENUM('active', 'draft', 'scheduled', 'completed');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
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
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"type" "enum_templates_type",
  	"division" "enum_templates_division",
  	"category" "enum_templates_category" DEFAULT 'custom',
  	"urgent" boolean DEFAULT false,
  	"dynamic_content_support" boolean DEFAULT false,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"body" jsonb,
  	"branding_ref_id" integer,
  	"usage_count" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_templates_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "templates_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"policies_id" integer,
  	"channels_id" integer,
  	"buttons_id" integer
  );
  
  CREATE TABLE "_templates_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_type" "enum__templates_v_version_type",
  	"version_division" "enum__templates_v_version_division",
  	"version_category" "enum__templates_v_version_category" DEFAULT 'custom',
  	"version_urgent" boolean DEFAULT false,
  	"version_dynamic_content_support" boolean DEFAULT false,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_body" jsonb,
  	"version_branding_ref_id" integer,
  	"version_usage_count" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__templates_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_templates_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"policies_id" integer,
  	"channels_id" integer,
  	"buttons_id" integer
  );
  
  CREATE TABLE "branding_packages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"theme_designer_primary_color" varchar,
  	"theme_designer_secondary_color" varchar,
  	"theme_designer_background_color" varchar,
  	"theme_designer_text_color" varchar,
  	"theme_designer_scope" "enum_branding_packages_theme_designer_scope" DEFAULT 'all',
  	"theme_designer_logo_id" integer,
  	"theme_designer_logo_pos" "enum_branding_packages_theme_designer_logo_pos" DEFAULT 'center',
  	"general_styling_text_color_text" varchar,
  	"general_styling_background_color_text" varchar,
  	"general_styling_direction" "enum_branding_packages_general_styling_direction" DEFAULT 'ltr',
  	"general_styling_message_width" numeric DEFAULT 500,
  	"general_styling_title_align" "enum_branding_packages_general_styling_title_align" DEFAULT 'left',
  	"signature_text" varchar,
  	"signature_position" "enum_branding_packages_signature_position" DEFAULT 'center',
  	"theme_tokens" jsonb,
  	"css_allowlist" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_branding_packages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "branding_packages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_branding_packages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_theme_designer_primary_color" varchar,
  	"version_theme_designer_secondary_color" varchar,
  	"version_theme_designer_background_color" varchar,
  	"version_theme_designer_text_color" varchar,
  	"version_theme_designer_scope" "enum__branding_packages_v_version_theme_designer_scope" DEFAULT 'all',
  	"version_theme_designer_logo_id" integer,
  	"version_theme_designer_logo_pos" "enum__branding_packages_v_version_theme_designer_logo_pos" DEFAULT 'center',
  	"version_general_styling_text_color_text" varchar,
  	"version_general_styling_background_color_text" varchar,
  	"version_general_styling_direction" "enum__branding_packages_v_version_general_styling_direction" DEFAULT 'ltr',
  	"version_general_styling_message_width" numeric DEFAULT 500,
  	"version_general_styling_title_align" "enum__branding_packages_v_version_general_styling_title_align" DEFAULT 'left',
  	"version_signature_text" varchar,
  	"version_signature_position" "enum__branding_packages_v_version_signature_position" DEFAULT 'center',
  	"version_theme_tokens" jsonb,
  	"version_css_allowlist" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__branding_packages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_branding_packages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "policies_quiet_hours_windows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"start" varchar,
  	"end" varchar,
  	"days" varchar
  );
  
  CREATE TABLE "policies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"type" "enum_policies_type",
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"fatigue_max_surveys_per_week" numeric DEFAULT 2,
  	"fatigue_min_days_between_surveys" numeric DEFAULT 3,
  	"sequencing_allow_parallel_execution" boolean DEFAULT false,
  	"sequencing_max_concurrent_actions" numeric DEFAULT 1,
  	"sequencing_queue_non_intrusive_messages" boolean DEFAULT true,
  	"vip_reminder_frequency" "enum_policies_vip_reminder_frequency" DEFAULT 'less_frequent',
  	"vip_custom_interval_days" numeric,
  	"quiet_hours_timezone" varchar DEFAULT 'UTC',
  	"quiet_hours_vip_user_ids" jsonb,
  	"routing_preferred_channel" "enum_policies_routing_preferred_channel" DEFAULT 'device',
  	"routing_both_strategy" "enum_policies_routing_both_strategy",
  	"dnd_exceptions_allowed_during_dnd_kinds" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_policies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_policies_v_version_quiet_hours_windows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"start" varchar,
  	"end" varchar,
  	"days" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_policies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_type" "enum__policies_v_version_type",
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_fatigue_max_surveys_per_week" numeric DEFAULT 2,
  	"version_fatigue_min_days_between_surveys" numeric DEFAULT 3,
  	"version_sequencing_allow_parallel_execution" boolean DEFAULT false,
  	"version_sequencing_max_concurrent_actions" numeric DEFAULT 1,
  	"version_sequencing_queue_non_intrusive_messages" boolean DEFAULT true,
  	"version_vip_reminder_frequency" "enum__policies_v_version_vip_reminder_frequency" DEFAULT 'less_frequent',
  	"version_vip_custom_interval_days" numeric,
  	"version_quiet_hours_timezone" varchar DEFAULT 'UTC',
  	"version_quiet_hours_vip_user_ids" jsonb,
  	"version_routing_preferred_channel" "enum__policies_v_version_routing_preferred_channel" DEFAULT 'device',
  	"version_routing_both_strategy" "enum__policies_v_version_routing_both_strategy",
  	"version_dnd_exceptions_allowed_during_dnd_kinds" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__policies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "variables_enum_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "variables" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"type" "enum_variables_type" DEFAULT 'string',
  	"required" boolean DEFAULT false,
  	"description" varchar,
  	"format_hint" varchar,
  	"sample_value" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_variables_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_variables_v_version_enum_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_variables_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_key" varchar,
  	"version_label" varchar,
  	"version_type" "enum__variables_v_version_type" DEFAULT 'string',
  	"version_required" boolean DEFAULT false,
  	"version_description" varchar,
  	"version_format_hint" varchar,
  	"version_sample_value" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__variables_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "channels_supported_message_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_channels_supported_message_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "channels_capabilities" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_channels_capabilities",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "channels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"status" "enum_channels_status" DEFAULT 'disabled' NOT NULL,
  	"description" varchar,
  	"configuration" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "buttons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"icon" varchar,
  	"other_attributes" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_messages_type" NOT NULL,
  	"channel_id" integer NOT NULL,
  	"mode" "enum_messages_mode" NOT NULL,
  	"status" "enum_messages_status" DEFAULT 'draft' NOT NULL,
  	"urgent" boolean DEFAULT false,
  	"response_rate_percentage" numeric,
  	"response_rate_count" numeric,
  	"response_rate_total" numeric,
  	"template_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"templates_id" integer,
  	"branding_packages_id" integer,
  	"policies_id" integer,
  	"variables_id" integer,
  	"channels_id" integer,
  	"buttons_id" integer,
  	"messages_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates" ADD CONSTRAINT "templates_branding_ref_id_branding_packages_id_fk" FOREIGN KEY ("branding_ref_id") REFERENCES "public"."branding_packages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_rels" ADD CONSTRAINT "templates_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_rels" ADD CONSTRAINT "templates_rels_policies_fk" FOREIGN KEY ("policies_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_rels" ADD CONSTRAINT "templates_rels_channels_fk" FOREIGN KEY ("channels_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_rels" ADD CONSTRAINT "templates_rels_buttons_fk" FOREIGN KEY ("buttons_id") REFERENCES "public"."buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_templates_v" ADD CONSTRAINT "_templates_v_parent_id_templates_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_templates_v" ADD CONSTRAINT "_templates_v_version_branding_ref_id_branding_packages_id_fk" FOREIGN KEY ("version_branding_ref_id") REFERENCES "public"."branding_packages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_templates_v_rels" ADD CONSTRAINT "_templates_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_templates_v_rels" ADD CONSTRAINT "_templates_v_rels_policies_fk" FOREIGN KEY ("policies_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_templates_v_rels" ADD CONSTRAINT "_templates_v_rels_channels_fk" FOREIGN KEY ("channels_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_templates_v_rels" ADD CONSTRAINT "_templates_v_rels_buttons_fk" FOREIGN KEY ("buttons_id") REFERENCES "public"."buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branding_packages" ADD CONSTRAINT "branding_packages_theme_designer_logo_id_media_id_fk" FOREIGN KEY ("theme_designer_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding_packages_rels" ADD CONSTRAINT "branding_packages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."branding_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branding_packages_rels" ADD CONSTRAINT "branding_packages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_branding_packages_v" ADD CONSTRAINT "_branding_packages_v_parent_id_branding_packages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."branding_packages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_packages_v" ADD CONSTRAINT "_branding_packages_v_version_theme_designer_logo_id_media_id_fk" FOREIGN KEY ("version_theme_designer_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_packages_v_rels" ADD CONSTRAINT "_branding_packages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_branding_packages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_branding_packages_v_rels" ADD CONSTRAINT "_branding_packages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "policies_quiet_hours_windows" ADD CONSTRAINT "policies_quiet_hours_windows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_policies_v_version_quiet_hours_windows" ADD CONSTRAINT "_policies_v_version_quiet_hours_windows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_policies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_policies_v" ADD CONSTRAINT "_policies_v_parent_id_policies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."policies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "variables_enum_options" ADD CONSTRAINT "variables_enum_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."variables"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_variables_v_version_enum_options" ADD CONSTRAINT "_variables_v_version_enum_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_variables_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_variables_v" ADD CONSTRAINT "_variables_v_parent_id_variables_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."variables"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "channels_supported_message_types" ADD CONSTRAINT "channels_supported_message_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "channels_capabilities" ADD CONSTRAINT "channels_capabilities_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "messages" ADD CONSTRAINT "messages_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "messages" ADD CONSTRAINT "messages_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_templates_fk" FOREIGN KEY ("templates_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_branding_packages_fk" FOREIGN KEY ("branding_packages_id") REFERENCES "public"."branding_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_policies_fk" FOREIGN KEY ("policies_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_variables_fk" FOREIGN KEY ("variables_id") REFERENCES "public"."variables"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_channels_fk" FOREIGN KEY ("channels_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_buttons_fk" FOREIGN KEY ("buttons_id") REFERENCES "public"."buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_messages_fk" FOREIGN KEY ("messages_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "templates_slug_idx" ON "templates" USING btree ("slug");
  CREATE INDEX "templates_branding_ref_idx" ON "templates" USING btree ("branding_ref_id");
  CREATE INDEX "templates_updated_at_idx" ON "templates" USING btree ("updated_at");
  CREATE INDEX "templates_created_at_idx" ON "templates" USING btree ("created_at");
  CREATE INDEX "templates__status_idx" ON "templates" USING btree ("_status");
  CREATE INDEX "templates_rels_order_idx" ON "templates_rels" USING btree ("order");
  CREATE INDEX "templates_rels_parent_idx" ON "templates_rels" USING btree ("parent_id");
  CREATE INDEX "templates_rels_path_idx" ON "templates_rels" USING btree ("path");
  CREATE INDEX "templates_rels_policies_id_idx" ON "templates_rels" USING btree ("policies_id");
  CREATE INDEX "templates_rels_channels_id_idx" ON "templates_rels" USING btree ("channels_id");
  CREATE INDEX "templates_rels_buttons_id_idx" ON "templates_rels" USING btree ("buttons_id");
  CREATE INDEX "_templates_v_parent_idx" ON "_templates_v" USING btree ("parent_id");
  CREATE INDEX "_templates_v_version_version_slug_idx" ON "_templates_v" USING btree ("version_slug");
  CREATE INDEX "_templates_v_version_version_branding_ref_idx" ON "_templates_v" USING btree ("version_branding_ref_id");
  CREATE INDEX "_templates_v_version_version_updated_at_idx" ON "_templates_v" USING btree ("version_updated_at");
  CREATE INDEX "_templates_v_version_version_created_at_idx" ON "_templates_v" USING btree ("version_created_at");
  CREATE INDEX "_templates_v_version_version__status_idx" ON "_templates_v" USING btree ("version__status");
  CREATE INDEX "_templates_v_created_at_idx" ON "_templates_v" USING btree ("created_at");
  CREATE INDEX "_templates_v_updated_at_idx" ON "_templates_v" USING btree ("updated_at");
  CREATE INDEX "_templates_v_latest_idx" ON "_templates_v" USING btree ("latest");
  CREATE INDEX "_templates_v_rels_order_idx" ON "_templates_v_rels" USING btree ("order");
  CREATE INDEX "_templates_v_rels_parent_idx" ON "_templates_v_rels" USING btree ("parent_id");
  CREATE INDEX "_templates_v_rels_path_idx" ON "_templates_v_rels" USING btree ("path");
  CREATE INDEX "_templates_v_rels_policies_id_idx" ON "_templates_v_rels" USING btree ("policies_id");
  CREATE INDEX "_templates_v_rels_channels_id_idx" ON "_templates_v_rels" USING btree ("channels_id");
  CREATE INDEX "_templates_v_rels_buttons_id_idx" ON "_templates_v_rels" USING btree ("buttons_id");
  CREATE UNIQUE INDEX "branding_packages_slug_idx" ON "branding_packages" USING btree ("slug");
  CREATE INDEX "branding_packages_theme_designer_theme_designer_logo_idx" ON "branding_packages" USING btree ("theme_designer_logo_id");
  CREATE INDEX "branding_packages_updated_at_idx" ON "branding_packages" USING btree ("updated_at");
  CREATE INDEX "branding_packages_created_at_idx" ON "branding_packages" USING btree ("created_at");
  CREATE INDEX "branding_packages__status_idx" ON "branding_packages" USING btree ("_status");
  CREATE INDEX "branding_packages_rels_order_idx" ON "branding_packages_rels" USING btree ("order");
  CREATE INDEX "branding_packages_rels_parent_idx" ON "branding_packages_rels" USING btree ("parent_id");
  CREATE INDEX "branding_packages_rels_path_idx" ON "branding_packages_rels" USING btree ("path");
  CREATE INDEX "branding_packages_rels_media_id_idx" ON "branding_packages_rels" USING btree ("media_id");
  CREATE INDEX "_branding_packages_v_parent_idx" ON "_branding_packages_v" USING btree ("parent_id");
  CREATE INDEX "_branding_packages_v_version_version_slug_idx" ON "_branding_packages_v" USING btree ("version_slug");
  CREATE INDEX "_branding_packages_v_version_theme_designer_version_them_idx" ON "_branding_packages_v" USING btree ("version_theme_designer_logo_id");
  CREATE INDEX "_branding_packages_v_version_version_updated_at_idx" ON "_branding_packages_v" USING btree ("version_updated_at");
  CREATE INDEX "_branding_packages_v_version_version_created_at_idx" ON "_branding_packages_v" USING btree ("version_created_at");
  CREATE INDEX "_branding_packages_v_version_version__status_idx" ON "_branding_packages_v" USING btree ("version__status");
  CREATE INDEX "_branding_packages_v_created_at_idx" ON "_branding_packages_v" USING btree ("created_at");
  CREATE INDEX "_branding_packages_v_updated_at_idx" ON "_branding_packages_v" USING btree ("updated_at");
  CREATE INDEX "_branding_packages_v_latest_idx" ON "_branding_packages_v" USING btree ("latest");
  CREATE INDEX "_branding_packages_v_rels_order_idx" ON "_branding_packages_v_rels" USING btree ("order");
  CREATE INDEX "_branding_packages_v_rels_parent_idx" ON "_branding_packages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_branding_packages_v_rels_path_idx" ON "_branding_packages_v_rels" USING btree ("path");
  CREATE INDEX "_branding_packages_v_rels_media_id_idx" ON "_branding_packages_v_rels" USING btree ("media_id");
  CREATE INDEX "policies_quiet_hours_windows_order_idx" ON "policies_quiet_hours_windows" USING btree ("_order");
  CREATE INDEX "policies_quiet_hours_windows_parent_id_idx" ON "policies_quiet_hours_windows" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "policies_slug_idx" ON "policies" USING btree ("slug");
  CREATE INDEX "policies_updated_at_idx" ON "policies" USING btree ("updated_at");
  CREATE INDEX "policies_created_at_idx" ON "policies" USING btree ("created_at");
  CREATE INDEX "policies__status_idx" ON "policies" USING btree ("_status");
  CREATE INDEX "_policies_v_version_quiet_hours_windows_order_idx" ON "_policies_v_version_quiet_hours_windows" USING btree ("_order");
  CREATE INDEX "_policies_v_version_quiet_hours_windows_parent_id_idx" ON "_policies_v_version_quiet_hours_windows" USING btree ("_parent_id");
  CREATE INDEX "_policies_v_parent_idx" ON "_policies_v" USING btree ("parent_id");
  CREATE INDEX "_policies_v_version_version_slug_idx" ON "_policies_v" USING btree ("version_slug");
  CREATE INDEX "_policies_v_version_version_updated_at_idx" ON "_policies_v" USING btree ("version_updated_at");
  CREATE INDEX "_policies_v_version_version_created_at_idx" ON "_policies_v" USING btree ("version_created_at");
  CREATE INDEX "_policies_v_version_version__status_idx" ON "_policies_v" USING btree ("version__status");
  CREATE INDEX "_policies_v_created_at_idx" ON "_policies_v" USING btree ("created_at");
  CREATE INDEX "_policies_v_updated_at_idx" ON "_policies_v" USING btree ("updated_at");
  CREATE INDEX "_policies_v_latest_idx" ON "_policies_v" USING btree ("latest");
  CREATE INDEX "variables_enum_options_order_idx" ON "variables_enum_options" USING btree ("_order");
  CREATE INDEX "variables_enum_options_parent_id_idx" ON "variables_enum_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "variables_key_idx" ON "variables" USING btree ("key");
  CREATE INDEX "variables_updated_at_idx" ON "variables" USING btree ("updated_at");
  CREATE INDEX "variables_created_at_idx" ON "variables" USING btree ("created_at");
  CREATE INDEX "variables__status_idx" ON "variables" USING btree ("_status");
  CREATE INDEX "_variables_v_version_enum_options_order_idx" ON "_variables_v_version_enum_options" USING btree ("_order");
  CREATE INDEX "_variables_v_version_enum_options_parent_id_idx" ON "_variables_v_version_enum_options" USING btree ("_parent_id");
  CREATE INDEX "_variables_v_parent_idx" ON "_variables_v" USING btree ("parent_id");
  CREATE INDEX "_variables_v_version_version_key_idx" ON "_variables_v" USING btree ("version_key");
  CREATE INDEX "_variables_v_version_version_updated_at_idx" ON "_variables_v" USING btree ("version_updated_at");
  CREATE INDEX "_variables_v_version_version_created_at_idx" ON "_variables_v" USING btree ("version_created_at");
  CREATE INDEX "_variables_v_version_version__status_idx" ON "_variables_v" USING btree ("version__status");
  CREATE INDEX "_variables_v_created_at_idx" ON "_variables_v" USING btree ("created_at");
  CREATE INDEX "_variables_v_updated_at_idx" ON "_variables_v" USING btree ("updated_at");
  CREATE INDEX "_variables_v_latest_idx" ON "_variables_v" USING btree ("latest");
  CREATE INDEX "channels_supported_message_types_order_idx" ON "channels_supported_message_types" USING btree ("order");
  CREATE INDEX "channels_supported_message_types_parent_idx" ON "channels_supported_message_types" USING btree ("parent_id");
  CREATE INDEX "channels_capabilities_order_idx" ON "channels_capabilities" USING btree ("order");
  CREATE INDEX "channels_capabilities_parent_idx" ON "channels_capabilities" USING btree ("parent_id");
  CREATE INDEX "channels_updated_at_idx" ON "channels" USING btree ("updated_at");
  CREATE INDEX "channels_created_at_idx" ON "channels" USING btree ("created_at");
  CREATE INDEX "buttons_updated_at_idx" ON "buttons" USING btree ("updated_at");
  CREATE INDEX "buttons_created_at_idx" ON "buttons" USING btree ("created_at");
  CREATE INDEX "messages_channel_idx" ON "messages" USING btree ("channel_id");
  CREATE INDEX "messages_template_idx" ON "messages" USING btree ("template_id");
  CREATE INDEX "messages_updated_at_idx" ON "messages" USING btree ("updated_at");
  CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("templates_id");
  CREATE INDEX "payload_locked_documents_rels_branding_packages_id_idx" ON "payload_locked_documents_rels" USING btree ("branding_packages_id");
  CREATE INDEX "payload_locked_documents_rels_policies_id_idx" ON "payload_locked_documents_rels" USING btree ("policies_id");
  CREATE INDEX "payload_locked_documents_rels_variables_id_idx" ON "payload_locked_documents_rels" USING btree ("variables_id");
  CREATE INDEX "payload_locked_documents_rels_channels_id_idx" ON "payload_locked_documents_rels" USING btree ("channels_id");
  CREATE INDEX "payload_locked_documents_rels_buttons_id_idx" ON "payload_locked_documents_rels" USING btree ("buttons_id");
  CREATE INDEX "payload_locked_documents_rels_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("messages_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "templates" CASCADE;
  DROP TABLE "templates_rels" CASCADE;
  DROP TABLE "_templates_v" CASCADE;
  DROP TABLE "_templates_v_rels" CASCADE;
  DROP TABLE "branding_packages" CASCADE;
  DROP TABLE "branding_packages_rels" CASCADE;
  DROP TABLE "_branding_packages_v" CASCADE;
  DROP TABLE "_branding_packages_v_rels" CASCADE;
  DROP TABLE "policies_quiet_hours_windows" CASCADE;
  DROP TABLE "policies" CASCADE;
  DROP TABLE "_policies_v_version_quiet_hours_windows" CASCADE;
  DROP TABLE "_policies_v" CASCADE;
  DROP TABLE "variables_enum_options" CASCADE;
  DROP TABLE "variables" CASCADE;
  DROP TABLE "_variables_v_version_enum_options" CASCADE;
  DROP TABLE "_variables_v" CASCADE;
  DROP TABLE "channels_supported_message_types" CASCADE;
  DROP TABLE "channels_capabilities" CASCADE;
  DROP TABLE "channels" CASCADE;
  DROP TABLE "buttons" CASCADE;
  DROP TABLE "messages" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_templates_type";
  DROP TYPE "public"."enum_templates_division";
  DROP TYPE "public"."enum_templates_category";
  DROP TYPE "public"."enum_templates_status";
  DROP TYPE "public"."enum__templates_v_version_type";
  DROP TYPE "public"."enum__templates_v_version_division";
  DROP TYPE "public"."enum__templates_v_version_category";
  DROP TYPE "public"."enum__templates_v_version_status";
  DROP TYPE "public"."enum_branding_packages_theme_designer_scope";
  DROP TYPE "public"."enum_branding_packages_theme_designer_logo_pos";
  DROP TYPE "public"."enum_branding_packages_general_styling_direction";
  DROP TYPE "public"."enum_branding_packages_general_styling_title_align";
  DROP TYPE "public"."enum_branding_packages_signature_position";
  DROP TYPE "public"."enum_branding_packages_status";
  DROP TYPE "public"."enum__branding_packages_v_version_theme_designer_scope";
  DROP TYPE "public"."enum__branding_packages_v_version_theme_designer_logo_pos";
  DROP TYPE "public"."enum__branding_packages_v_version_general_styling_direction";
  DROP TYPE "public"."enum__branding_packages_v_version_general_styling_title_align";
  DROP TYPE "public"."enum__branding_packages_v_version_signature_position";
  DROP TYPE "public"."enum__branding_packages_v_version_status";
  DROP TYPE "public"."enum_policies_type";
  DROP TYPE "public"."enum_policies_vip_reminder_frequency";
  DROP TYPE "public"."enum_policies_routing_preferred_channel";
  DROP TYPE "public"."enum_policies_routing_both_strategy";
  DROP TYPE "public"."enum_policies_status";
  DROP TYPE "public"."enum__policies_v_version_type";
  DROP TYPE "public"."enum__policies_v_version_vip_reminder_frequency";
  DROP TYPE "public"."enum__policies_v_version_routing_preferred_channel";
  DROP TYPE "public"."enum__policies_v_version_routing_both_strategy";
  DROP TYPE "public"."enum__policies_v_version_status";
  DROP TYPE "public"."enum_variables_type";
  DROP TYPE "public"."enum_variables_status";
  DROP TYPE "public"."enum__variables_v_version_type";
  DROP TYPE "public"."enum__variables_v_version_status";
  DROP TYPE "public"."enum_channels_supported_message_types";
  DROP TYPE "public"."enum_channels_capabilities";
  DROP TYPE "public"."enum_channels_status";
  DROP TYPE "public"."enum_messages_type";
  DROP TYPE "public"."enum_messages_mode";
  DROP TYPE "public"."enum_messages_status";`)
}
