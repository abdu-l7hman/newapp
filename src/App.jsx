import React, { useEffect, useState } from 'react';
import { listProjectsWithDetails, toggleLike } from './services/db.js';
import Login from './Login.jsx';
import { Search, Filter, TrendingUp, Clock, Sparkles, Heart, MessageCircle, Share2, Bookmark, Star, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';

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
const ProjectCard = ({ project, userRole, currentUserId, onLike, onComment, onShare, onBookmark, onReview, onInvest }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

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
    switch (project.status) {
      case 'funded':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Funded</Badge>;
      case 'reviewed':
        return <Badge variant="default" className="flex items-center gap-1"><Star className="w-3 h-3" /> Reviewed</Badge>;
      case 'pending':
        return <Badge variant="warning" className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Project Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
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
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
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
        {(userRole === 'analyst' || userRole === 'investor') && (
          <div className="flex gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="text-xs text-gray-500">Analyst Score</p>
              <p className="font-bold text-lg text-blue-600">{project.analystScore}/10</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Investor Interest</p>
              <p className="font-bold text-lg text-green-600">{project.investorInterest}%</p>
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
            <Button onClick={onInvest} className="w-full flex items-center justify-center gap-2">
              <DollarSign className="w-4 h-4" />
              Invest Now
            </Button>
          )}
          {userRole === 'student' && (
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Feed Component
const Feed = ({ userRole }) => {
  const [filter, setFilter] = useState('all');

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const { data } = await listProjectsWithDetails();
      if (!cancelled && data) setProjects(
        data.map((p) => ({
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
          image: p.image_url,
          fundingGoal: p.funding_goal ?? 0,
          currentFunding: p.current_funding ?? 0,
          likes: p.likes ?? 0,
          comments: 0,
          shares: 0,
          timeAgo: '',
          status: p.status ?? 'pending',
          analystScore: 0,
          investorInterest: 0
        }))
      );
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

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
          title: 'Welcome back, Ali!',
          subtitle: 'Discover innovative projects and share your own ideas with the community.'
        };
      case 'analyst':
        return {
          title: 'Welcome back, Dr. Kamil!',
          subtitle: 'Review new student projects and provide valuable insights.'
        };
      case 'investor':
        return {
          title: 'Welcome back, Abdulmalik!',
          subtitle: 'Explore vetted investment opportunities from talented students.'
        };
    }
  };

  const welcome = getWelcomeMessage();

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
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
      <div className="space-y-4">
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

  return (
    <div className="min-h-screen bg-gray-50">
      {!user && (
        <Login onSuccess={(u) => { setUser(u); setUserRole(u?.role || 'student'); }} />
      )}
      {user && (
      {/* Header with Role Switcher */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-blue-600">Student Projects Hub</h1>
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

      {/* Feed */}
      <Feed userRole={userRole} />
      )}
    </div>
  );
}
