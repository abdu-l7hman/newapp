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

  // Add more users
  const sara = { id: 'u-student-2', email: 'sara@example.com', display_name: 'Sara', role: 'student' };
  const lina = { id: 'u-student-3', email: 'lina@example.com', display_name: 'Lina', role: 'student' };
  const omar = { id: 'u-student-4', email: 'omar@example.com', display_name: 'Omar', role: 'student' };
  memory.users.push(sara, lina, omar);

  const fieldHealth = { id: 'f-health', name: 'Healthcare' };
  const fieldEdu = { id: 'f-edu', name: 'Education' };
  const fieldSustain = { id: 'f-sustain', name: 'Sustainability' };
  const fieldRobotics = { id: 'f-robotics', name: 'Robotics' };
  memory.fields.push(fieldAI, fieldFinTech, fieldHealth, fieldEdu, fieldSustain, fieldRobotics);

  // Helper to create picsum image with a stable seed
  const img = (seed) => `https://picsum.photos/seed/${seed}/800/480`;

  const projects = [
    {
      id: 'p-1',
      author_id: studentUser.id,
      title: 'AI-Powered Medical Diagnosis Assistant',
      description: 'ML system analyzing images and patient data to help clinicians triage cases.',
      image_url: img('medical-ai'),
      funding_goal: 150000,
      current_funding: 87500,
      category: 'Healthcare',
      status: 'reviewed'
    },
    {
      id: 'p-2',
      author_id: studentUser.id,
      title: 'Micro-Investment Platform for Students',
      description: 'A platform to invest spare change while learning financial literacy.',
      image_url: img('micro-invest'),
      funding_goal: 100000,
      current_funding: 45000,
      category: 'FinTech',
      status: 'pending'
    },
    {
      id: 'p-3',
      author_id: sara.id,
      title: 'Sustainable Campus Garden Network',
      description: 'IoT sensors and a community app to coordinate student-run campus gardens.',
      image_url: img('garden'),
      funding_goal: 20000,
      current_funding: 12000,
      category: 'Sustainability',
      status: 'pending'
    },
    {
      id: 'p-4',
      author_id: lina.id,
      title: 'Adaptive Learning Tutor',
      description: 'Personalized education assistant that adapts to each student’s pace.',
      image_url: img('tutor'),
      funding_goal: 50000,
      current_funding: 15000,
      category: 'Education',
      status: 'reviewed'
    },
    {
      id: 'p-5',
      author_id: omar.id,
      title: 'Low-Cost Prosthetics with 3D Printing',
      description: 'Open-source designs for low-cost prosthetic components.',
      image_url: img('prosthetics'),
      funding_goal: 80000,
      current_funding: 30000,
      category: 'Healthcare',
      status: 'pending'
    },
    {
      id: 'p-6',
      author_id: lina.id,
      title: 'Robotics Club: Swarm Drones',
      description: 'Research project exploring swarm coordination algorithms for drones.',
      image_url: img('drones'),
      funding_goal: 120000,
      current_funding: 60000,
      category: 'Robotics',
      status: 'reviewed'
    }
    ,
    {
      id: 'p-7',
      author_id: sara.id,
      title: 'Green Energy Dashboard',
      description: 'Analytics dashboard for campus energy usage with ML-driven savings suggestions.',
      image_url: img('green-energy'),
      funding_goal: 30000,
      current_funding: 22000,
      category: 'Sustainability',
      status: 'reviewed',
      featured: true
    },
    {
      id: 'p-8',
      author_id: omar.id,
      title: 'Clinic Queue Optimizer',
      description: 'A queue management system for clinics to reduce patient wait times.',
      image_url: img('clinic-queue'),
      funding_goal: 45000,
      current_funding: 18000,
      category: 'Healthcare',
      status: 'pending'
    },
    {
      id: 'p-9',
      author_id: studentUser.id,
      title: 'AI Essay Grader',
      description: 'Tool to provide feedback on student essays using NLP models.',
      image_url: img('essay-grader'),
      funding_goal: 25000,
      current_funding: 12500,
      category: 'Education',
      status: 'pending',
      featured: true
    },
    {
      id: 'p-10',
      author_id: lina.id,
      title: 'Accessible Notes App',
      description: 'Notes app focused on accessibility for visually impaired students.',
      image_url: img('notes-app'),
      funding_goal: 12000,
      current_funding: 4000,
      category: 'Education',
      status: 'pending'
    }
  ];

  // More demo projects
  const more = [
    {
      id: 'p-11',
      author_id: sara.id,
      title: 'Peer Tutoring Marketplace',
      description: 'Connect students for on-demand peer tutoring sessions.',
      image_url: img('tutoring'),
      funding_goal: 8000,
      current_funding: 3200,
      category: 'Education',
      status: 'reviewed',
      featured: true
    },
    {
      id: 'p-12',
      author_id: omar.id,
      title: 'Smart Recycling Bins',
      description: 'IoT-enabled recycling bins that track usage and incentives.',
      image_url: img('recycling'),
      funding_goal: 22000,
      current_funding: 5000,
      category: 'Sustainability',
      status: 'pending'
    },
    {
      id: 'p-13',
      author_id: studentUser.id,
      title: 'Campus Event Finder',
      description: 'Discover student-run events and RSVP with friends.',
      image_url: img('events'),
      funding_goal: 6000,
      current_funding: 6000,
      category: 'Community',
      status: 'funded',
      featured: true
    },
    {
      id: 'p-14',
      author_id: lina.id,
      title: 'Sleep Cycle Coach',
      description: 'Wearable-linked app that coaches students to healthier sleep habits.',
      image_url: img('sleep'),
      funding_goal: 15000,
      current_funding: 7300,
      category: 'HealthTech',
      status: 'pending'
    },
    {
      id: 'p-15',
      author_id: sara.id,
      title: 'Local Volunteer Match',
      description: 'Match students with local volunteer opportunities and track hours.',
      image_url: img('volunteer'),
      funding_goal: 9000,
      current_funding: 2100,
      category: 'Community',
      status: 'pending'
    }
  ];

  memory.projects.push(...more);

  memory.projects.push(...projects);

  // Link some fields (tags) to projects
  memory.projectFields.push({ project_id: 'p-1', field_id: 'f-ai' });
  memory.projectFields.push({ project_id: 'p-2', field_id: 'f-fintech' });
  memory.projectFields.push({ project_id: 'p-3', field_id: 'f-sustain' });
  memory.projectFields.push({ project_id: 'p-4', field_id: 'f-edu' });
  memory.projectFields.push({ project_id: 'p-5', field_id: 'f-health' });
  memory.projectFields.push({ project_id: 'p-6', field_id: 'f-robotics' });
  memory.projectFields.push({ project_id: 'p-7', field_id: 'f-sustain' });
  memory.projectFields.push({ project_id: 'p-8', field_id: 'f-health' });
  memory.projectFields.push({ project_id: 'p-9', field_id: 'f-ai' });
  memory.projectFields.push({ project_id: 'p-10', field_id: 'f-edu' });
  memory.projectFields.push({ project_id: 'p-11', field_id: 'f-edu' });
  memory.projectFields.push({ project_id: 'p-12', field_id: 'f-sustain' });
  memory.projectFields.push({ project_id: 'p-13', field_id: 'f-ai' });
  memory.projectFields.push({ project_id: 'p-14', field_id: 'f-health' });
  memory.projectFields.push({ project_id: 'p-15', field_id: 'f-sustain' });

  // Some likes to make counts non-zero
  memory.projectLikes.push({ project_id: 'p-1', user_id: investorUser.id });
  memory.projectLikes.push({ project_id: 'p-4', user_id: studentUser.id });
  memory.projectLikes.push({ project_id: 'p-3', user_id: lina.id });
}

export function getMemory() {
  return memory;
}


