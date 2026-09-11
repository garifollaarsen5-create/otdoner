-- ===== otdoner · пікірлер кестесі =====
-- Supabase Dashboard → SQL Editor → New query → осы файлды қойып, Run басыңыз.

create table if not exists public.otdoner_reviews (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 2 and 60),
  text        text not null check (char_length(text) between 3 and 1000),
  photos      jsonb not null default '[]'::jsonb
              check (jsonb_typeof(photos) = 'array' and jsonb_array_length(photos) <= 3
                     and pg_column_size(photos) < 2000000),
  published   boolean not null default true
);

create index if not exists otdoner_reviews_created_idx
  on public.otdoner_reviews (created_at desc);

-- Row Level Security: барлығы жарияланған пікірді оқи алады және жаңа пікір қоса алады.
-- Өзгерту/өшіру тек Dashboard арқылы (published = false етсеңіз, пікір сайттан жасырылады).
alter table public.otdoner_reviews enable row level security;

drop policy if exists "otdoner read published" on public.otdoner_reviews;
drop policy if exists "otdoner insert" on public.otdoner_reviews;

create policy "otdoner read published"
  on public.otdoner_reviews for select
  to anon, authenticated
  using (published = true);

create policy "otdoner insert"
  on public.otdoner_reviews for insert
  to anon, authenticated
  with check (published = true);

grant select, insert on public.otdoner_reviews to anon, authenticated;
grant usage, select on sequence public.otdoner_reviews_id_seq to anon, authenticated;
