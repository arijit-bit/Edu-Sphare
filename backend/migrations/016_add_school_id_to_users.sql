-- Add school_id to users table

ALTER TABLE public.users
ADD COLUMN school_id INT;

ALTER TABLE public.users
ADD CONSTRAINT fk_users_school_id FOREIGN KEY (school_id) 
  REFERENCES public.schools(id) ON DELETE SET NULL;
