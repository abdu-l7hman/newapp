Database setup (Supabase)

1) Create a Supabase project
2) Add a `.env.local` with:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

3) Run the SQL below in the Supabase SQL editor.

Schema

```
-- Users (basic public profile)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  display_name text,
  role text check (role in ('student','investor','analyst')) default 'student',
  created_at timestamptz default now()
);

-- Projects posted by students
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.users(id) on delete set null,
  title text not null,
  description text,
  image_url text,
  funding_goal numeric,
  current_funding numeric default 0,
  category text,
  status text check (status in ('pending','reviewed','funded')) default 'pending',
  created_at timestamptz default now()
);

-- Project fields/tags (normalized)
create table if not exists public.fields (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

-- Project to fields many-to-many
create table if not exists public.project_fields (
  project_id uuid references public.projects(id) on delete cascade,
  field_id uuid references public.fields(id) on delete cascade,
  primary key (project_id, field_id)
);

-- Investor likes for projects
create table if not exists public.project_likes (
  project_id uuid references public.projects(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (project_id, user_id)
);

-- Helpful views
create view if not exists public.v_project_like_counts as
select p.id as project_id, count(pl.user_id) as like_count
from public.projects p
left join public.project_likes pl on pl.project_id = p.id
group by p.id;

-- Row Level Security
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.fields enable row level security;
alter table public.project_fields enable row level security;
alter table public.project_likes enable row level security;

-- Example permissive policies (adjust for production)
create policy if not exists "public read users" on public.users for select using (true);
create policy if not exists "public read projects" on public.projects for select using (true);
create policy if not exists "public read fields" on public.fields for select using (true);
create policy if not exists "public read project_fields" on public.project_fields for select using (true);
create policy if not exists "public read project_likes" on public.project_likes for select using (true);

-- Insert policies
create policy if not exists "authenticated insert users" on public.users for insert with check (true);
create policy if not exists "authenticated insert projects" on public.projects for insert with check (true);
create policy if not exists "authenticated insert fields" on public.fields for insert with check (true);
create policy if not exists "authenticated insert project_fields" on public.project_fields for insert with check (true);
create policy if not exists "authenticated like" on public.project_likes for insert with check (true);

-- Delete like policy (unlike)
create policy if not exists "authenticated unlike" on public.project_likes for delete using (auth.uid() is not null);
```

Notes

- "name of the passwords": Use Supabase Auth for passwords; we do not store passwords directly. The `users` table stores public profile info only.
- "save the likes for the investors": stored in `project_likes` keyed by `(project_id, user_id)`.
- "add the field of the project": fields/tags are modeled by `fields` and `project_fields`.
- "save the fields of projects of students": when a student creates a project, assign fields via `project_fields`.


