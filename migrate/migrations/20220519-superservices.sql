-- +migrate Up
-- TLMT-2546

CREATE TABLE public.super_services (
	id uuid NOT NULL DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	description text NOT NULL,
	CONSTRAINT super_services_pk PRIMARY KEY (id),
	CONSTRAINT super_services_name UNIQUE("name")

);

CREATE TABLE public.super_service_mapping (
	super_service_id uuid NOT NULL,
	service_id uuid NOT NULL
);


ALTER TABLE public.super_service_mapping ADD CONSTRAINT super_service_mapping_fk FOREIGN KEY (super_service_id) REFERENCES public.super_services(id);
ALTER TABLE public.super_service_mapping ADD CONSTRAINT super_service_mapping_service_fk FOREIGN KEY (service_id) REFERENCES public.services(id);