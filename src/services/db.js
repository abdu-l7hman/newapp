import { getSupabase } from '../lib/supabaseClient.js';
import { getMemory, seedWithDemoData } from './dbFallbackStore.js';

function useFallback() {
  const supabase = getSupabase();
  if (!supabase) {
    seedWithDemoData();
    return true;
  }
  return false;
}

// Users
export async function upsertUserProfile({ id, email, displayName, role }) {
  const isFallback = useFallback();
  if (isFallback) {
    const memory = getMemory();
    const existingIndex = memory.users.findIndex(u => u.id === id);
    const user = { id, email, display_name: displayName, role };
    if (existingIndex >= 0) memory.users[existingIndex] = user; else memory.users.push(user);
    return { data: user, error: null };
  }

  const supabase = getSupabase();
  const { data, error } = await supabase.from('users').upsert({ id, email, display_name: displayName, role }).select('*').single();
  return { data, error };
}

// Fields
export async function listFields() {
  const isFallback = useFallback();
  if (isFallback) {
    const memory = getMemory();
    return { data: memory.fields, error: null };
  }
  const supabase = getSupabase();
  const { data, error } = await supabase.from('fields').select('*').order('name');
  return { data, error };
}

export async function ensureFieldsByNames(fieldNames) {
  const isFallback = useFallback();
  if (isFallback) {
    const memory = getMemory();
    const created = [];
    for (const name of fieldNames) {
      let f = memory.fields.find(x => x.name === name);
      if (!f) {
        f = { id: `f-${name.toLowerCase()}`, name };
        memory.fields.push(f);
      }
      created.push(f);
    }
    return { data: created, error: null };
  }
  const supabase = getSupabase();
  const inserts = fieldNames.map(name => ({ name }));
  const { data, error } = await supabase.from('fields').upsert(inserts).select('*');
  return { data, error };
}

// Projects
export async function listProjectsWithDetails() {
  const isFallback = useFallback();
  if (isFallback) {
    const memory = getMemory();
    const projects = memory.projects.map(p => {
      const tagIds = memory.projectFields.filter(r => r.project_id === p.id).map(r => r.field_id);
      const tags = memory.fields.filter(f => tagIds.includes(f.id)).map(f => f.name);
      const likes = memory.projectLikes.filter(l => l.project_id === p.id).length;
      return { ...p, tags, likes };
    });
    return { data: projects, error: null };
  }
  const supabase = getSupabase();
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*, fields:project_fields(fields(*)), like_counts:v_project_like_counts(like_count)');
  if (error) return { data: null, error };
  const normalized = projects.map(p => ({
    ...p,
    tags: (p.fields || []).map(r => r.fields.name),
    likes: p.like_counts?.[0]?.like_count ?? 0
  }));
  return { data: normalized, error: null };
}

export async function createProject({ authorId, title, description, imageUrl, fundingGoal, category, status = 'pending', fieldNames = [] }) {
  const isFallback = useFallback();
  if (isFallback) {
    const memory = getMemory();
    const id = `p-${Math.random().toString(36).slice(2, 8)}`;
    const project = { id, author_id: authorId, title, description, image_url: imageUrl, funding_goal: fundingGoal, current_funding: 0, category, status };
    memory.projects.push(project);
    const { data: fields } = await ensureFieldsByNames(fieldNames);
    for (const f of fields) memory.projectFields.push({ project_id: id, field_id: f.id });
    return { data: project, error: null };
  }
  const supabase = getSupabase();
  const { data: project, error } = await supabase.from('projects')
    .insert({ author_id: authorId, title, description, image_url: imageUrl, funding_goal: fundingGoal, category, status })
    .select('*')
    .single();
  if (error) return { data: null, error };
  const { data: fields } = await ensureFieldsByNames(fieldNames);
  const linkRows = fields.map(f => ({ project_id: project.id, field_id: f.id }));
  await supabase.from('project_fields').upsert(linkRows);
  return { data: project, error: null };
}

// Likes
export async function toggleLike({ projectId, userId }) {
  const isFallback = useFallback();
  if (isFallback) {
    const memory = getMemory();
    const idx = memory.projectLikes.findIndex(l => l.project_id === projectId && l.user_id === userId);
    if (idx >= 0) {
      memory.projectLikes.splice(idx, 1);
      return { data: { liked: false }, error: null };
    } else {
      memory.projectLikes.push({ project_id: projectId, user_id: userId });
      return { data: { liked: true }, error: null };
    }
  }
  const supabase = getSupabase();
  const { data: existing } = await supabase.from('project_likes').select('*').eq('project_id', projectId).eq('user_id', userId);
  if (existing && existing.length > 0) {
    const { error } = await supabase.from('project_likes').delete().eq('project_id', projectId).eq('user_id', userId);
    if (error) return { data: null, error };
    return { data: { liked: false }, error: null };
  } else {
    const { error } = await supabase.from('project_likes').insert({ project_id: projectId, user_id: userId });
    if (error) return { data: null, error };
    return { data: { liked: true }, error: null };
  }
}


