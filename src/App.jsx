import React, { useEffect, useState } from 'react';
import { listProjectsWithDetails, toggleLike, createProject } from './services/db.js';
import Login from './Login.jsx';
import { Search, Filter, TrendingUp, Clock, Sparkles, Heart, MessageCircle, Share2, Bookmark, Star, CheckCircle, DollarSign, Home, PlusCircle, User } from 'lucide-react';

// Button Component
const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
    ghost: 'hover:bg-gray-100',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
  };
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 text-sm',
    icon: 'h-10 w-10'
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Component
const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

// Badge Component
const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800'
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ProjectCard Component
const ProjectCard = ({ project, userRole, currentUserId, onLike, onComment, onShare, onBookmark, onReview, onInvest, onViewDetails }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [analystScoreLocal, setAnalystScoreLocal] = useState(project.analystScore || 0);
  const [investAmountOpen, setInvestAmountOpen] = useState(false);
  const [investAmount, setInvestAmount] = useState('');
  const [analystFeedback, setAnalystFeedback] = useState('');
  const [analystError, setAnalystError] = useState('');

  const handleLike = async () => {
    setLiked(!liked);
    onLike();
    if (currentUserId) {
      await toggleLike({ projectId: project.id, userId: currentUserId });
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    onBookmark();
  };

  const fundingPercentage = (project.currentFunding / project.fundingGoal) * 100;

  const getStatusBadge = () => {
    // featured badge high priority
    if (project.featured) return <Badge variant="success" className="flex items-center gap-1 bg-yellow-100 text-yellow-800">⭐ Featured</Badge>;
    switch (project.status) {
      case 'funded':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Funded</Badge>;
      case 'reviewed':
        return <Badge variant="default" className="flex items-center gap-1"><Star className="w-3 h-3" /> Reviewed</Badge>;
      // pending intentionally renders no badge (keeps the card cleaner)
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Project Image */}
        <div className="relative h-48 bg-gray-200 group">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-3 right-3">
            {getStatusBadge()}
          </div>
      </div>

      {/* Project Content */}
      <div className="p-4">
        {/* Author Info */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {project.author.avatar}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{project.author.name}</p>
            <p className="text-xs text-gray-500">{project.author.university} • {project.timeAgo}</p>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="font-bold text-lg mb-2">{project.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>

        {/* Category & Tags */}
        <div className="mb-3">
          <Badge className="mb-2">{project.category}</Badge>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tags.slice(0, 5).map((tag, idx) => (
                <span key={idx} className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">{tag}</span>
              ))}
            </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            {project.timelineMonths != null && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full">⏱ {project.timelineMonths}m</span>}
            {project.teamSize != null && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full">👥 {project.teamSize}</span>}
          </div>
        </div>

        {/* Funding Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Funding Progress</span>
            <span className="font-semibold">${project.currentFunding.toLocaleString()} / ${project.fundingGoal.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{fundingPercentage.toFixed(0)}% funded</p>
        </div>

        {/* Analyst Metrics (for analysts and investors) */}
        {userRole === 'analyst' && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">Analyst Score</p>
              <span className="font-bold text-lg text-blue-600">{analystScoreLocal}/10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={analystScoreLocal}
              onChange={(e) => setAnalystScoreLocal(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">Improvement suggestions (required)</label>
              <textarea
                value={analystFeedback}
                onChange={(e) => { setAnalystFeedback(e.target.value); if (analystError) setAnalystError(''); }}
                placeholder="Describe concrete steps the student can take to improve this project (e.g., validation plan, metrics, technical risks)."
                rows={3}
                className={`w-full rounded-md border px-3 py-2 text-sm ${analystError ? 'border-red-300' : 'border-gray-200'}`}
              />
              {analystError && <p className="mt-1 text-xs text-red-600">{analystError}</p>}
            </div>
            <div className="flex justify-end mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (!analystFeedback || analystFeedback.trim().length < 5) {
                    setAnalystError('Please provide a brief description (at least 5 characters).');
                    return;
                  }
                  console.log('Analyst rated project', project.id, analystScoreLocal, 'feedback:', analystFeedback.trim());
                  setAnalystError('');
                }}
              >
                Save rating
              </Button>
            </div>
          </div>
        )}
        {userRole === 'investor' && (
          <div className="flex gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="text-xs text-gray-500">Analyst Score</p>
              <p className="font-bold text-lg text-blue-600">{project.analystScore}/10</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <button onClick={handleLike} className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
              <Heart className={`w-5 h-5 ${liked ? 'fill-red-600 text-red-600' : ''}`} />
              <span className="text-sm">{project.likes + (liked ? 1 : 0)}</span>
            </button>
            <button onClick={onComment} className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{project.comments}</span>
            </button>
            <button onClick={onShare} className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="text-sm">{project.shares}</span>
            </button>
          </div>
          <button onClick={handleBookmark} className="text-gray-600 hover:text-yellow-600 transition-colors">
            <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-yellow-600 text-yellow-600' : ''}`} />
          </button>
        </div>

        {/* Role-specific CTAs */}
        <div className="mt-4">
          {userRole === 'analyst' && project.status === 'pending' && (
            <Button onClick={onReview} className="w-full">
              Review Project
            </Button>
          )}
          {userRole === 'investor' && project.status !== 'pending' && (
            <>
              <Button onClick={() => setInvestAmountOpen(true)} className="w-full flex items-center justify-center gap-2">
                <DollarSign className="w-4 h-4" />
                Invest Now
              </Button>
              {investAmountOpen && (
                <div className="mt-3 p-3 border rounded-md bg-gray-50">
                  <label className="block text-sm font-medium mb-1">Investment amount (USD)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full rounded-md border border-gray-200 px-3 py-2"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => { setInvestAmount(''); setInvestAmountOpen(false); }}>Cancel</Button>
                    <Button size="sm" onClick={() => { const amt = Number(investAmount) || 0; if (amt>0) { console.log('Invest', project.id, amt); onInvest && onInvest(project, amt); setInvestAmount(''); setInvestAmountOpen(false); } }}>Confirm</Button>
                  </div>
                </div>
              )}
            </>
          )}
          {userRole === 'student' && (
            <Button variant="outline" className="w-full" onClick={() => onViewDetails && onViewDetails(project)}>
              View Details
            </Button>
          )}
        </div>

        {/* Extra details (pitch, demo) */}
        {(project.elevatorPitch || project.demoUrl) && (
          <div className="mt-4 border-t pt-3 text-sm text-gray-700">
            {project.elevatorPitch && (
              <div className="mb-2">
                <p className="font-medium text-sm">Elevator pitch</p>
                <p className="text-sm text-gray-600">{project.elevatorPitch}</p>
              </div>
            )}
            {project.demoUrl && (
              <div>
                <p className="font-medium text-sm">Demo</p>
                <a href={project.demoUrl} target="_blank" rel="noreferrer" className="text-blue-600 break-words">{project.demoUrl}</a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Feed Component
const Feed = ({ userRole, userName = 'Student', refreshKey = 0, onViewDetails }) => {
  const [filter, setFilter] = useState('all');

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const { data } = await listProjectsWithDetails();
      if (!cancelled && data) {
        const mapped = data.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          author: {
            name: 'Student',
            university: '—',
            avatar: 'ST'
          },
          category: p.category,
          tags: p.tags || [],
          image: p.image_url || p.image || '',
          fundingGoal: p.funding_goal ?? p.fundingGoal ?? 0,
          currentFunding: p.current_funding ?? p.currentFunding ?? 0,
          likes: p.likes ?? 0,
          comments: 0,
          shares: 0,
          timeAgo: '',
          status: p.status ?? 'pending',
          analystScore: 0,
          investorInterest: 0,
          // extras
          timelineMonths: p.timeline_months ?? p.extra?.timelineMonths ?? null,
          teamSize: p.team_size ?? p.extra?.teamSize ?? null,
          elevatorPitch: p.elevator_pitch ?? p.extra?.elevatorPitch ?? '',
          demoUrl: p.demo_url ?? p.extra?.demoUrl ?? ''
        }));
        // put featured projects first
        mapped.sort((a,b) => (b.featured === true) - (a.featured === true));
        setProjects(mapped);
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const filterButtons = [
    { id: 'all', label: 'All Projects', icon: null },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'ai-recommended', label: 'AI Picks', icon: Sparkles },
  ];

  const getWelcomeMessage = () => {
    switch (userRole) {
      case 'student':
        return {
          title: `Welcome back, ${userName}!`,
          subtitle: 'Discover innovative projects and share your own ideas with the community.'
        };
      case 'analyst':
        return {
          title: `Welcome back, ${userName}!`,
          subtitle: 'Review new student projects and provide valuable insights.'
        };
      case 'investor':
        return {
          title: `Welcome back, ${userName}!`,
          subtitle: 'Explore vetted investment opportunities from talented students.'
        };
    }
  };

  const welcome = getWelcomeMessage();

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      {/* Featured carousel */}
      {projects.filter(p => p.featured).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Featured</h3>
          <div className="flex gap-4 overflow-x-auto py-2 scroll-snap-x">
            {projects.filter(p => p.featured).slice(0,5).map(p => (
              <div key={p.id} className="min-w-[280px] bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden scroll-snap-align-start">
                <div className="relative h-36">
                  <img src={p.image} className="w-full h-full object-cover" alt={p.title} />
                  <div className="absolute left-3 bottom-3 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md text-sm">{p.category}</div>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm line-clamp-2">{p.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="mb-6">
        <h2 className="font-bold text-2xl mb-1">{welcome.title}</h2>
        <p className="text-gray-600">{welcome.subtitle}</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search projects, technologies, or students..."
            className="pl-10 pr-12"
          />
          <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filterButtons.map((button) => {
            const Icon = button.icon;
            return (
              <Button
                key={button.id}
                variant={filter === button.id ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(button.id)}
                className="flex items-center space-x-1 shrink-0"
              >
                {Icon && <Icon className="w-3 h-3" />}
                <span>{button.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* AI Recommendations Banner */}
      {userRole === 'student' && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-purple-900">AI Business Analyst</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">Beta</Badge>
          </div>
          <p className="text-sm text-purple-800 mb-3">
            Get instant feedback on your project ideas from our AI-powered business analyst.
          </p>
          <Button size="sm" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
            Chat with AI Analyst
          </Button>
        </div>
      )}

      {/* Project Feed */}
  <div className="grid grid-cols-1 gap-4">
        {!loading && projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            userRole={userRole}
            currentUserId={userRole === 'investor' ? 'u-investor-1' : 'u-student-1'}
            onLike={() => console.log('Liked project:', project.id)}
            onComment={() => console.log('Comment on project:', project.id)}
            onShare={() => console.log('Share project:', project.id)}
            onBookmark={() => console.log('Bookmark project:', project.id)}
            onReview={() => console.log('Review project:', project.id)}
            onInvest={() => console.log('Invest in project:', project.id)}
            onViewDetails={onViewDetails}
          />
        ))}
        {loading && (
          <div className="text-center text-gray-500 text-sm">Loading projects…</div>
        )}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <Button variant="outline" className="w-full">
          Load More Projects
        </Button>
      </div>
    </div>
  );
};

// Main App Component with Role Selector
export default function App() {
  const [userRole, setUserRole] = useState('student');
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('feed'); // feed | explore | submit | profile
  // refresh key is bumped when new projects are created so Feed can re-fetch
  const [projectsRefreshKey, setProjectsRefreshKey] = useState(0);
  const [modalProject, setModalProject] = useState(null);

  function handleProjectCreated() {
    // move back to feed and trigger refresh
    setTab('feed');
    setProjectsRefreshKey(k => k + 1);
  }

  function openProjectModal(project) {
    setModalProject(project);
  }

  function closeProjectModal() {
    setModalProject(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!user && (
        <Login onSuccess={(u) => { setUser(u); setUserRole(u?.role || 'student'); }} />
      )}
      {user && (
        <>
          {/* Header with Role Switcher */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-blue-600">Investo</h1>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={userRole === 'student' ? 'default' : 'outline'}
                    onClick={() => setUserRole('student')}
                  >
                    Student
                  </Button>
                  <Button
                    size="sm"
                    variant={userRole === 'analyst' ? 'default' : 'outline'}
                    onClick={() => setUserRole('analyst')}
                  >
                    Analyst
                  </Button>
                  <Button
                    size="sm"
                    variant={userRole === 'investor' ? 'default' : 'outline'}
                    onClick={() => setUserRole('investor')}
                  >
                    Investor
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { setUser(null); }}>Logout</Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <div className="pb-24">
            {tab === 'feed' && <Feed userRole={userRole} userName={user?.displayName || user?.email || 'Student'} refreshKey={projectsRefreshKey} onViewDetails={openProjectModal} />}
            {tab === 'explore' && <Explore />}
            {tab === 'submit' && <SubmitForm currentUserId={user?.id} onCreated={handleProjectCreated} />}
            {tab === 'profile' && <Profile user={user} />}
          </div>

          <BottomNav tab={tab} setTab={setTab} />
        </>
      )}

      {modalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeProjectModal}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold">{modalProject.title}</h3>
              <button onClick={closeProjectModal} className="text-gray-500">Close</button>
            </div>
            <div className="mt-4">
              <img src={modalProject.image} className="w-full h-64 object-cover rounded-md" alt="" />
              <p className="mt-4 text-gray-700">{modalProject.description}</p>
              {modalProject.elevatorPitch && (
                <div className="mt-4">
                  <p className="font-medium">Elevator pitch</p>
                  <p className="text-gray-600">{modalProject.elevatorPitch}</p>
                </div>
              )}
              {modalProject.demoUrl && (
                <div className="mt-3">
                  <a href={modalProject.demoUrl} target="_blank" rel="noreferrer" className="text-blue-600">Open demo</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Bottom navigation component
function BottomNav({ tab, setTab }) {
  const itemClass = (t) => `flex-1 flex flex-col items-center justify-center py-2 ${tab===t ? 'text-blue-600' : 'text-gray-600'}`;
  return (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner z-20">
      <div className="max-w-2xl mx-auto flex">
        <button className={itemClass('feed')} onClick={() => setTab('feed')} aria-label="Feed">
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Feed</span>
        </button>
        <button className={itemClass('explore')} onClick={() => setTab('explore')} aria-label="Explore">
          <Search className="w-6 h-6" />
          <span className="text-xs mt-1">Explore</span>
        </button>
        <button className={itemClass('submit')} onClick={() => setTab('submit')} aria-label="Submit">
          <PlusCircle className="w-6 h-6" />
          <span className="text-xs mt-1">Submit</span>
        </button>
        <button className={itemClass('profile')} onClick={() => setTab('profile')} aria-label="Profile">
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
}

function Explore() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-2">Explore</h2>
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <p className="text-sm text-gray-600">Search and discovery features are still under development. Check back soon!</p>
        <div className="mt-4">
          <input className="w-full rounded-md border border-gray-200 px-3 py-2" placeholder="Search (coming soon)…" disabled />
        </div>
      </div>
    </div>
  );
}

function SubmitForm({ currentUserId, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [timelineMonths, setTimelineMonths] = useState('12');
  const [teamSize, setTeamSize] = useState('1');
  const [elevatorPitch, setElevatorPitch] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [category, setCategory] = useState('Select a category');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  function addTag() {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput('');
    }
  }

  function removeTag(t) {
    setTags(tags.filter(x => x !== t));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const goal = Number(fundingGoal) || 0;
    const payload = {
      authorId: currentUserId || 'u-local',
      title,
      description,
      imageUrl: '',
      fundingGoal: goal,
      category,
      fieldNames: tags,
      extra: {
        timelineMonths: Number(timelineMonths) || 0,
        teamSize: Number(teamSize) || 0,
        elevatorPitch,
        demoUrl
      }
    };
    const { error } = await createProject(payload);
    setLoading(false);
    if (error) setMessage('Failed to submit project.'); else {
      setMessage('Project submitted (demo).');
      setTitle(''); setDescription(''); setFundingGoal(''); setCategory('Select a category'); setTags([]); setTagInput(''); setTimelineMonths('12'); setTeamSize('1'); setElevatorPitch(''); setDemoUrl('');
      onCreated && onCreated();
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Submit Your Project</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Project Overview</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Project Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter your project title" required className="w-full rounded-md border border-gray-200 px-3 py-2 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your project, its purpose, and key features..." required rows={4} className="w-full rounded-md border border-gray-200 px-3 py-2 bg-gray-50" />
            </div>

            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-gray-200 px-3 py-2 bg-white">
                  <option>Select a category</option>
                  <option>AI</option>
                  <option>FinTech</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">Tags</label>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add a tag" className="flex-1 rounded-md border border-gray-200 px-3 py-2 bg-white" />
                  <button type="button" onClick={addTag} className="rounded-md bg-white border border-gray-200 px-3">+</button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map(t => (
                    <span key={t} className="inline-flex items-center gap-2 bg-gray-100 text-sm px-2 py-1 rounded-full">
                      {t} <button type="button" onClick={() => removeTag(t)} className="text-gray-500">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Project Details</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium mb-1">Funding Goal</label>
              <input value={fundingGoal} onChange={(e) => setFundingGoal(e.target.value)} className="w-full rounded-md border border-gray-200 px-3 py-2 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Timeline (months)</label>
              <input value={timelineMonths} onChange={(e) => setTimelineMonths(e.target.value)} className="w-full rounded-md border border-gray-200 px-3 py-2 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Team Size</label>
              <input value={teamSize} onChange={(e) => setTeamSize(e.target.value)} className="w-full rounded-md border border-gray-200 px-3 py-2 bg-gray-50" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Elevator Pitch</label>
            <textarea value={elevatorPitch} onChange={(e) => setElevatorPitch(e.target.value)} placeholder="Summarize your project in 2-3 sentences..." rows={3} className="w-full rounded-md border border-gray-200 px-3 py-2 bg-gray-50" />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Demo URL (optional)</label>
            <input value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} placeholder="https://..." className="w-full rounded-md border border-gray-200 px-3 py-2 bg-gray-50" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button type="submit" disabled={loading} className="rounded-md bg-blue-600 text-white px-4 py-2">{loading ? 'Submitting…' : 'Submit project'}</button>
          {message && <span className="text-sm text-gray-600">{message}</span>}
        </div>
      </form>
    </div>
  );
}

function Profile({ user }) {
  if (!user) return (
    <div className="max-w-2xl mx-auto p-4"> <p className="text-sm text-gray-600">No profile available.</p> </div>
  );
  const demo = {
    age: 22,
    major: 'Computer Science',
    university: 'Demo University',
    bio: 'Passionate student founder building AI tools for education and healthcare. Interested in product design and early-stage startups.',
    skills: ['React', 'Python', 'ML', 'Product', 'UX'],
    contact: { email: 'ali@example.com', website: 'https://ali.dev' },
    stats: { projects: 4, followers: 120, following: 15 },
    previousProjects: [
      { id: 'd1', title: 'AI-Powered Diagnosis', short: 'ML system analyzing images and patient data', year: 2023, role: 'Lead ML' },
      { id: 'd2', title: 'Micro-Invest Platform', short: 'Micro-investing for students', year: 2022, role: 'Frontend' }
    ]
  };
  const profile = { ...demo, ...user };
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-2">Profile</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold">{(user.displayName || user.email || 'U').charAt(0)}</div>
          <div>
            <p className="font-medium text-lg">{user.displayName || user.email || 'Unnamed'}</p>
            <p className="text-sm text-gray-500">{profile.university} • {user.role || 'student'}</p>
            <p className="mt-2 text-sm text-gray-700">{profile.bio}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.skills.map(s => (<span key={s} className="text-xs px-2 py-1 bg-gray-100 rounded-full">{s}</span>))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500">Projects</p>
            <p className="font-medium">{profile.stats.projects}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Followers</p>
            <p className="font-medium">{profile.stats.followers}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Following</p>
            <p className="font-medium">{profile.stats.following}</p>
          </div>
        </div>

        <div>
          <h3 className="font-medium">Contact</h3>
          <p className="text-sm text-gray-700">Email: <a href={`mailto:${profile.contact.email}`} className="text-blue-600">{profile.contact.email}</a></p>
          <p className="text-sm text-gray-700">Website: <a href={profile.contact.website} target="_blank" rel="noreferrer" className="text-blue-600">{profile.contact.website}</a></p>
        </div>

        <div>
          <h3 className="font-medium">Previous Projects</h3>
          <div className="mt-2 space-y-2">
            {profile.previousProjects.map(p => (
              <div key={p.id} className="p-3 bg-gray-50 rounded-md border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{p.title} <span className="text-xs text-gray-500">• {p.year}</span></p>
                    <p className="text-sm text-gray-600">{p.short}</p>
                  </div>
                  <div className="text-xs text-gray-500">Role: {p.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
