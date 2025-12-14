export interface AnalysisResult {
  repoUrl: string;
  repoName: string;
  owner: string;
  score: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  badge: 'Bronze' | 'Silver' | 'Gold';
  summary: string;
  categories: {
    name: string;
    score: number;
    maxScore: number;
    icon: string;
    description: string;
  }[];
  roadmap: {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
    completed: boolean;
  }[];
  stats: {
    files: number;
    commits: number;
    contributors: number;
    languages: { name: string; percentage: number; color: string }[];
    lastUpdated: string;
  };
}

export const mockAnalysisResults: Record<string, AnalysisResult> = {
  'todo-app': {
    repoUrl: 'https://github.com/rahul-dev-ai/todo-app',
    repoName: 'todo-app',
    owner: 'rahul-dev-ai',
    score: 78,
    level: 'Intermediate',
    badge: 'Silver',
    summary: 'Strong code consistency and folder structure with well-organized components. The project demonstrates good understanding of React patterns and state management. However, test coverage is minimal and documentation could be more comprehensive. The commit history shows regular development activity with meaningful messages.',
    categories: [
      { name: 'Code Quality', score: 85, maxScore: 100, icon: 'code', description: 'Clean, readable code with consistent styling' },
      { name: 'Documentation', score: 60, maxScore: 100, icon: 'file-text', description: 'Basic README, needs more details' },
      { name: 'Test Coverage', score: 45, maxScore: 100, icon: 'check-circle', description: 'Limited test coverage detected' },
      { name: 'Project Structure', score: 90, maxScore: 100, icon: 'folder', description: 'Well-organized folder hierarchy' },
      { name: 'Git Practices', score: 82, maxScore: 100, icon: 'git-branch', description: 'Good commit messages, regular updates' },
      { name: 'Real-world Relevance', score: 75, maxScore: 100, icon: 'globe', description: 'Practical project with useful features' },
    ],
    roadmap: [
      { id: '1', title: 'Add Comprehensive Unit Tests', description: 'Implement Jest or Vitest for component testing. Aim for 80% code coverage.', priority: 'high', category: 'Testing', completed: false },
      { id: '2', title: 'Enhance README Documentation', description: 'Add installation steps, usage examples, API documentation, and screenshots.', priority: 'high', category: 'Documentation', completed: false },
      { id: '3', title: 'Set Up CI/CD Pipeline', description: 'Configure GitHub Actions for automated testing and deployment.', priority: 'medium', category: 'DevOps', completed: false },
      { id: '4', title: 'Add TypeScript Strict Mode', description: 'Enable strict TypeScript checking for better type safety.', priority: 'medium', category: 'Code Quality', completed: false },
      { id: '5', title: 'Implement Error Boundaries', description: 'Add React error boundaries for graceful error handling.', priority: 'low', category: 'Code Quality', completed: false },
    ],
    stats: {
      files: 42,
      commits: 156,
      contributors: 1,
      languages: [
        { name: 'TypeScript', percentage: 68, color: '#3178c6' },
        { name: 'CSS', percentage: 22, color: '#563d7c' },
        { name: 'HTML', percentage: 10, color: '#e34c26' },
      ],
      lastUpdated: '2 days ago',
    },
  },
  'weather-dashboard': {
    repoUrl: 'https://github.com/sneha-codes/weather-dashboard',
    repoName: 'weather-dashboard',
    owner: 'sneha-codes',
    score: 42,
    level: 'Beginner',
    badge: 'Bronze',
    summary: 'Basic project structure with functional weather fetching. The codebase lacks proper organization and documentation is minimal. Commits are inconsistent with vague messages. The project shows potential but needs significant improvements in code organization and best practices.',
    categories: [
      { name: 'Code Quality', score: 50, maxScore: 100, icon: 'code', description: 'Code works but lacks consistency' },
      { name: 'Documentation', score: 25, maxScore: 100, icon: 'file-text', description: 'Missing README and comments' },
      { name: 'Test Coverage', score: 10, maxScore: 100, icon: 'check-circle', description: 'No tests found' },
      { name: 'Project Structure', score: 55, maxScore: 100, icon: 'folder', description: 'Flat structure, needs reorganization' },
      { name: 'Git Practices', score: 35, maxScore: 100, icon: 'git-branch', description: 'Irregular commits, poor messages' },
      { name: 'Real-world Relevance', score: 60, maxScore: 100, icon: 'globe', description: 'Useful concept, needs polish' },
    ],
    roadmap: [
      { id: '1', title: 'Create Comprehensive README', description: 'Add project overview, setup instructions, API documentation, and usage examples.', priority: 'high', category: 'Documentation', completed: false },
      { id: '2', title: 'Restructure Project Folders', description: 'Organize code into components, hooks, utils, and services directories.', priority: 'high', category: 'Structure', completed: false },
      { id: '3', title: 'Implement Consistent Coding Style', description: 'Add ESLint and Prettier for code consistency. Fix all linting errors.', priority: 'high', category: 'Code Quality', completed: false },
      { id: '4', title: 'Write Meaningful Commit Messages', description: 'Follow conventional commits format. Make atomic, focused commits.', priority: 'medium', category: 'Git Practices', completed: false },
      { id: '5', title: 'Add Basic Unit Tests', description: 'Start with testing utility functions and API calls.', priority: 'medium', category: 'Testing', completed: false },
      { id: '6', title: 'Handle API Errors Gracefully', description: 'Add loading states, error handling, and user-friendly error messages.', priority: 'medium', category: 'UX', completed: false },
    ],
    stats: {
      files: 12,
      commits: 23,
      contributors: 1,
      languages: [
        { name: 'JavaScript', percentage: 75, color: '#f1e05a' },
        { name: 'CSS', percentage: 20, color: '#563d7c' },
        { name: 'HTML', percentage: 5, color: '#e34c26' },
      ],
      lastUpdated: '3 weeks ago',
    },
  },
  'ecommerce-site': {
    repoUrl: 'https://github.com/manish-projects/ecommerce-site',
    repoName: 'ecommerce-site',
    owner: 'manish-projects',
    score: 91,
    level: 'Advanced',
    badge: 'Gold',
    summary: 'Excellent project with professional-grade codebase. Comprehensive documentation, robust test coverage, and clean architecture. The project follows industry best practices with well-structured components, proper state management, and CI/CD integration. Ready for production deployment.',
    categories: [
      { name: 'Code Quality', score: 95, maxScore: 100, icon: 'code', description: 'Exceptional code standards' },
      { name: 'Documentation', score: 92, maxScore: 100, icon: 'file-text', description: 'Thorough documentation' },
      { name: 'Test Coverage', score: 88, maxScore: 100, icon: 'check-circle', description: '85% code coverage' },
      { name: 'Project Structure', score: 94, maxScore: 100, icon: 'folder', description: 'Professional architecture' },
      { name: 'Git Practices', score: 90, maxScore: 100, icon: 'git-branch', description: 'Excellent version control' },
      { name: 'Real-world Relevance', score: 92, maxScore: 100, icon: 'globe', description: 'Production-ready application' },
    ],
    roadmap: [
      { id: '1', title: 'Increase Test Coverage to 90%', description: 'Add integration tests for checkout flow and user authentication.', priority: 'medium', category: 'Testing', completed: false },
      { id: '2', title: 'Implement Issue Tracking', description: 'Set up GitHub Issues with templates for bugs and features.', priority: 'low', category: 'Project Management', completed: false },
      { id: '3', title: 'Open Source Contribution', description: 'Add CONTRIBUTING.md and consider making the project public for community contributions.', priority: 'low', category: 'Community', completed: false },
      { id: '4', title: 'Performance Optimization', description: 'Implement code splitting, lazy loading, and image optimization.', priority: 'medium', category: 'Performance', completed: false },
    ],
    stats: {
      files: 187,
      commits: 423,
      contributors: 3,
      languages: [
        { name: 'TypeScript', percentage: 72, color: '#3178c6' },
        { name: 'SCSS', percentage: 18, color: '#c6538c' },
        { name: 'JavaScript', percentage: 8, color: '#f1e05a' },
        { name: 'HTML', percentage: 2, color: '#e34c26' },
      ],
      lastUpdated: '1 hour ago',
    },
  },
};

export const getAnalysisForUrl = (url: string): AnalysisResult | null => {
  const normalizedUrl = url.toLowerCase();
  
  if (normalizedUrl.includes('todo-app') || normalizedUrl.includes('todo')) {
    return mockAnalysisResults['todo-app'];
  }
  if (normalizedUrl.includes('weather') || normalizedUrl.includes('dashboard')) {
    return mockAnalysisResults['weather-dashboard'];
  }
  if (normalizedUrl.includes('ecommerce') || normalizedUrl.includes('shop') || normalizedUrl.includes('store')) {
    return mockAnalysisResults['ecommerce-site'];
  }
  
  // Default: return a random result for demo purposes
  const keys = Object.keys(mockAnalysisResults);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const result = { ...mockAnalysisResults[randomKey] };
  
  // Extract repo name from URL
  const urlParts = url.split('/');
  const repoName = urlParts[urlParts.length - 1] || 'repository';
  const owner = urlParts[urlParts.length - 2] || 'developer';
  
  result.repoUrl = url;
  result.repoName = repoName;
  result.owner = owner;
  
  return result;
};
