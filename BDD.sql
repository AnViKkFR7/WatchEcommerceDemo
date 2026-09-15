-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.companies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  description text,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  website_url text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  last_edited_by uuid,
  color text,
  CONSTRAINT companies_pkey PRIMARY KEY (id),
  CONSTRAINT companies_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT companies_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES auth.users(id)
);
CREATE TABLE public.company_members (
  company_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'editor'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  last_edited_by uuid,
  full_name text NOT NULL DEFAULT ''::text,
  phone text,
  avatar_url text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT company_members_pkey PRIMARY KEY (company_id, user_id),
  CONSTRAINT company_members_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id),
  CONSTRAINT company_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT company_members_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT company_members_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES auth.users(id)
);
CREATE TABLE public.items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  title text NOT NULL,
  summary text,
  status text NOT NULL DEFAULT 'draft'::text,
  item_type text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  last_edited_by uuid,
  CONSTRAINT items_pkey PRIMARY KEY (id),
  CONSTRAINT items_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id),
  CONSTRAINT items_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT items_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES auth.users(id)
);
CREATE TABLE public.attribute_definitions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  item_type text NOT NULL,
  key text NOT NULL,
  label text NOT NULL,
  data_type text NOT NULL,
  is_filterable boolean NOT NULL DEFAULT false,
  is_required boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  last_edited_by uuid,
  CONSTRAINT attribute_definitions_pkey PRIMARY KEY (id),
  CONSTRAINT attribute_definitions_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id),
  CONSTRAINT attribute_definitions_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT attribute_definitions_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES auth.users(id)
);
CREATE TABLE public.attribute_values (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL,
  attribute_id uuid NOT NULL,
  value_text text,
  value_number numeric,
  value_boolean boolean,
  value_date date,
  value_json jsonb,
  value_text_array ARRAY,
  value_number_array ARRAY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  last_edited_by uuid,
  CONSTRAINT attribute_values_pkey PRIMARY KEY (id),
  CONSTRAINT attribute_values_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id),
  CONSTRAINT attribute_values_attribute_id_fkey FOREIGN KEY (attribute_id) REFERENCES public.attribute_definitions(id),
  CONSTRAINT attribute_values_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT attribute_values_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES auth.users(id)
);
CREATE TABLE public.item_media (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL,
  file_type text NOT NULL,
  url_externa text NOT NULL,
  title text,
  alt_text text,
  sort_order integer NOT NULL DEFAULT 0,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  last_edited_by uuid,
  is_cover boolean NOT NULL DEFAULT false,
  CONSTRAINT item_media_pkey PRIMARY KEY (id),
  CONSTRAINT item_media_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id),
  CONSTRAINT item_media_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT item_media_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES auth.users(id)
);
CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  title text NOT NULL,
  heading text,
  intro text,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'draft'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  last_edited_by uuid,
  CONSTRAINT blog_posts_pkey PRIMARY KEY (id),
  CONSTRAINT blog_posts_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id),
  CONSTRAINT blog_posts_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT blog_posts_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES auth.users(id)
);
CREATE TABLE public.blog_media (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL,
  file_type text NOT NULL,
  url_externa text NOT NULL,
  title text,
  alt_text text,
  sort_order integer NOT NULL DEFAULT 0,
  metadata jsonb,
  is_cover_image boolean NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  last_edited_by uuid,
  CONSTRAINT blog_media_pkey PRIMARY KEY (id),
  CONSTRAINT blog_media_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.blog_posts(id),
  CONSTRAINT blog_media_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT blog_media_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES auth.users(id)
);
CREATE TABLE public.user_filter_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  page text NOT NULL,
  filter_config jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_filter_preferences_pkey PRIMARY KEY (id),
  CONSTRAINT user_filter_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.client_company (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  phone text,
  email text,
  responsible text,
  color text,
  created_at timestamp with time zone DEFAULT now(),
  company_id uuid,
  CONSTRAINT client_company_pkey PRIMARY KEY (id),
  CONSTRAINT client_company_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT client_company_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id)
);
CREATE TABLE public.planning_task (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_company_id uuid,
  title text NOT NULL,
  description text,
  type text CHECK (type = ANY (ARRAY['recibir_pago'::text, 'realizar_pago'::text, 'todo'::text, 'entregable'::text, 'reunion'::text])),
  start_datetime timestamp with time zone NOT NULL,
  end_datetime timestamp with time zone,
  is_all_day boolean DEFAULT false,
  recurrence_type text DEFAULT 'none'::text CHECK (recurrence_type = ANY (ARRAY['none'::text, 'hourly'::text, 'daily'::text, 'weekly'::text, 'yearly'::text])),
  recurrence_value integer,
  files jsonb,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  company_id uuid,
  attachments jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT planning_task_pkey PRIMARY KEY (id),
  CONSTRAINT planning_task_client_company_id_fkey FOREIGN KEY (client_company_id) REFERENCES public.client_company(id),
  CONSTRAINT planning_task_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT planning_task_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id)
);
CREATE TABLE public.billing (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_company_id uuid,
  title text NOT NULL,
  description text,
  billing_date date NOT NULL,
  amount numeric NOT NULL,
  direction text CHECK (direction = ANY (ARRAY['pagar'::text, 'cobrar'::text])),
  recurrence_type text DEFAULT 'none'::text CHECK (recurrence_type = ANY (ARRAY['none'::text, 'hourly'::text, 'daily'::text, 'weekly'::text, 'yearly'::text])),
  recurrence_value integer,
  files jsonb,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  attachments jsonb DEFAULT '[]'::jsonb,
  company_id uuid,
  CONSTRAINT billing_pkey PRIMARY KEY (id),
  CONSTRAINT billing_client_company_id_fkey FOREIGN KEY (client_company_id) REFERENCES public.client_company(id),
  CONSTRAINT billing_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT billing_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id)
);
CREATE TABLE public.attached_file (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  url text NOT NULL,
  task_id uuid,
  billing_id uuid,
  uploaded_by uuid,
  uploaded_at timestamp with time zone DEFAULT now(),
  CONSTRAINT attached_file_pkey PRIMARY KEY (id),
  CONSTRAINT attached_file_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.planning_task(id),
  CONSTRAINT attached_file_billing_id_fkey FOREIGN KEY (billing_id) REFERENCES public.billing(id),
  CONSTRAINT attached_file_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES auth.users(id)
);
CREATE TABLE public.client_company_members (
  client_company_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'editor'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT client_company_members_pkey PRIMARY KEY (client_company_id, user_id),
  CONSTRAINT client_company_members_client_company_id_fkey FOREIGN KEY (client_company_id) REFERENCES public.client_company(id),
  CONSTRAINT client_company_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.analytics_event_definitions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  key text NOT NULL,
  label text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid,
  last_edited_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT analytics_event_definitions_pkey PRIMARY KEY (id),
  CONSTRAINT analytics_event_definitions_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id),
  CONSTRAINT analytics_event_definitions_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT analytics_event_definitions_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES auth.users(id)
);
CREATE TABLE public.analytics_events (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  company_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type = ANY (ARRAY['page_view'::text, 'cta_click'::text])),
  event_key text,
  path text,
  session_id text NOT NULL,
  device text CHECK (device = ANY (ARRAY['mobile'::text, 'desktop'::text, 'tablet'::text])),
  country text,
  region text,
  city text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT analytics_events_pkey PRIMARY KEY (id),
  CONSTRAINT analytics_events_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id)
);
CREATE TABLE public.analytics_daily (
  company_id uuid NOT NULL,
  day date NOT NULL,
  unique_visitors integer NOT NULL DEFAULT 0,
  page_views integer NOT NULL DEFAULT 0,
  by_path jsonb NOT NULL DEFAULT '{}'::jsonb,
  by_device jsonb NOT NULL DEFAULT '{}'::jsonb,
  by_country jsonb NOT NULL DEFAULT '{}'::jsonb,
  by_event jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT analytics_daily_pkey PRIMARY KEY (company_id, day),
  CONSTRAINT analytics_daily_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id)
);