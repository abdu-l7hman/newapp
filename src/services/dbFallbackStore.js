// Simple in-memory store as a safe fallback when Supabase is not configured.

const memory = {
  users: [],
  projects: [],
  fields: [],
  projectFields: [],
  projectLikes: []
};

export function seedWithDemoData() {
  if (memory.projects.length > 0) return; // already seeded

  const studentUser = { id: 'u-student-1', email: 'student@example.com', display_name: 'Ali', role: 'student' };
  const investorUser = { id: 'u-investor-1', email: 'investor@example.com', display_name: 'Abdulmalik', role: 'investor' };
  memory.users.push(studentUser, investorUser);

  const fieldAI = { id: 'f-ai', name: 'AI' };
  const fieldFinTech = { id: 'f-fintech', name: 'FinTech' };
  memory.fields.push(fieldAI, fieldFinTech);

  const project1 = {
    id: 'p-1',
    author_id: studentUser.id,
    title: 'AI-Powered Medical Diagnosis Assistant',
    description: 'ML system analyzing images and patient data',
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop',
    funding_goal: 150000,
    current_funding: 87500,
    category: 'Healthcare',
    status: 'reviewed'
  };
  const project2 = {
    id: 'p-2',
    author_id: studentUser.id,
    title: 'Micro-Investment Platform for Students',
    description: 'Invest spare change with education',
    image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop',
    funding_goal: 100000,
    current_funding: 45000,
    category: 'FinTech',
    status: 'pending'
  };
  memory.projects.push(project1, project2);

  memory.projectFields.push({ project_id: 'p-1', field_id: 'f-ai' });
  memory.projectFields.push({ project_id: 'p-2', field_id: 'f-fintech' });
  memory.projectLikes.push({ project_id: 'p-1', user_id: investorUser.id });
}

export function getMemory() {
  return memory;
}


