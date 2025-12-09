import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/Layout';
import { Loading, FullPageLoading } from './components/Loading';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy Load Pages
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage').then(module => ({ default: module.RegisterPage })));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const AIChatPage = React.lazy(() => import('./pages/AIChatPage').then(module => ({ default: module.AIChatPage })));
const AssessmentListPage = React.lazy(() => import('./pages/assessments/AssessmentListPage').then(module => ({ default: module.AssessmentListPage })));
const AssessmentPlayerPage = React.lazy(() => import('./pages/assessments/AssessmentPlayerPage').then(module => ({ default: module.AssessmentPlayerPage })));
const AssessmentResultsPage = React.lazy(() => import('./pages/assessments/AssessmentResultsPage').then(module => ({ default: module.AssessmentResultsPage })));
const InterviewDashboard = React.lazy(() => import('./pages/interview/InterviewDashboard').then(module => ({ default: module.InterviewDashboard })));
const QuizSetupPage = React.lazy(() => import('./pages/interview/QuizSetupPage').then(module => ({ default: module.QuizSetupPage })));
const QuizPlayerPage = React.lazy(() => import('./pages/interview/QuizPlayerPage').then(module => ({ default: module.QuizPlayerPage })));
const QuizResultsPage = React.lazy(() => import('./pages/interview/QuizResultsPage').then(module => ({ default: module.QuizResultsPage })));
const TextSetupPage = React.lazy(() => import('./pages/interview/text/TextSetupPage').then(module => ({ default: module.TextSetupPage })));
const TextPlayerPage = React.lazy(() => import('./pages/interview/text/TextPlayerPage').then(module => ({ default: module.TextPlayerPage })));
const TextResultsPage = React.lazy(() => import('./pages/interview/text/TextResultsPage').then(module => ({ default: module.TextResultsPage })));
const VoiceSetupPage = React.lazy(() => import('./pages/interview/voice/VoiceSetupPage').then(module => ({ default: module.VoiceSetupPage })));
const VoicePlayerPage = React.lazy(() => import('./pages/interview/voice/VoicePlayerPage').then(module => ({ default: module.VoicePlayerPage })));
const VoiceResultsPage = React.lazy(() => import('./pages/interview/voice/VoiceResultsPage').then(module => ({ default: module.VoiceResultsPage })));
const BotSetupPage = React.lazy(() => import('./pages/interview/bot/BotSetupPage').then(module => ({ default: module.BotSetupPage })));
const BotInterviewPage = React.lazy(() => import('./pages/interview/bot/BotInterviewPage').then(module => ({ default: module.BotInterviewPage })));
const BotResultsPage = React.lazy(() => import('./pages/interview/bot/BotResultsPage').then(module => ({ default: module.BotResultsPage })));
const AnalyticsDashboard = React.lazy(() => import('./pages/analytics/AnalyticsDashboard').then(module => ({ default: module.AnalyticsDashboard })));
const HistoryPage = React.lazy(() => import('./pages/analytics/HistoryPage').then(module => ({ default: module.HistoryPage })));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const QuestionManagement = React.lazy(() => import('./pages/admin/QuestionManagement').then(module => ({ default: module.QuestionManagement })));
const UserManagement = React.lazy(() => import('./pages/admin/UserManagement').then(module => ({ default: module.UserManagement })));
const DatasetManagement = React.lazy(() => import('./pages/admin/DatasetManagement').then(module => ({ default: module.DatasetManagement })));
const SystemSettings = React.lazy(() => import('./pages/admin/SystemSettings').then(module => ({ default: module.SystemSettings })));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }: { children?: React.ReactNode, requireAdmin?: boolean }) => {
  const { user } = useAuthStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if logged in)
const PublicRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useAuthStore();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<FullPageLoading />}>
        <HashRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Suspense fallback={<Loading />}><Dashboard /></Suspense>} />
              
              {/* Assessment Routes */}
              <Route path="assessments" element={<Suspense fallback={<Loading />}><AssessmentListPage /></Suspense>} />
              <Route path="assessments/:id" element={<Suspense fallback={<Loading />}><AssessmentPlayerPage /></Suspense>} />
              <Route path="assessments/:id/results" element={<Suspense fallback={<Loading />}><AssessmentResultsPage /></Suspense>} />
              
              {/* Interview Prep Routes */}
              <Route path="interview" element={<Suspense fallback={<Loading />}><InterviewDashboard /></Suspense>} />
              
              {/* Quiz Mode */}
              <Route path="interview/setup" element={<Suspense fallback={<Loading />}><QuizSetupPage /></Suspense>} />
              <Route path="interview/quiz" element={<Suspense fallback={<Loading />}><QuizPlayerPage /></Suspense>} />
              <Route path="interview/results" element={<Suspense fallback={<Loading />}><QuizResultsPage /></Suspense>} />
              
              {/* Text Mode */}
              <Route path="interview/text/setup" element={<Suspense fallback={<Loading />}><TextSetupPage /></Suspense>} />
              <Route path="interview/text/active" element={<Suspense fallback={<Loading />}><TextPlayerPage /></Suspense>} />
              <Route path="interview/text/results" element={<Suspense fallback={<Loading />}><TextResultsPage /></Suspense>} />
              
              {/* Voice Mode */}
              <Route path="interview/voice/setup" element={<Suspense fallback={<Loading />}><VoiceSetupPage /></Suspense>} />
              <Route path="interview/voice/active" element={<Suspense fallback={<Loading />}><VoicePlayerPage /></Suspense>} />
              <Route path="interview/voice/results" element={<Suspense fallback={<Loading />}><VoiceResultsPage /></Suspense>} />

              {/* Bot Mode */}
              <Route path="interview/bot/setup" element={<Suspense fallback={<Loading />}><BotSetupPage /></Suspense>} />
              <Route path="interview/bot/active" element={<Suspense fallback={<Loading />}><BotInterviewPage /></Suspense>} />
              <Route path="interview/bot/results" element={<Suspense fallback={<Loading />}><BotResultsPage /></Suspense>} />
              
              {/* Analytics Routes */}
              <Route path="analytics" element={<Suspense fallback={<Loading />}><AnalyticsDashboard /></Suspense>} />
              <Route path="analytics/history" element={<Suspense fallback={<Loading />}><HistoryPage /></Suspense>} />

              {/* Admin Routes */}
              <Route path="admin" element={<ProtectedRoute requireAdmin={true}><Suspense fallback={<Loading />}><AdminDashboard /></Suspense></ProtectedRoute>} />
              <Route path="admin/questions" element={<ProtectedRoute requireAdmin={true}><Suspense fallback={<Loading />}><QuestionManagement /></Suspense></ProtectedRoute>} />
              <Route path="admin/users" element={<ProtectedRoute requireAdmin={true}><Suspense fallback={<Loading />}><UserManagement /></Suspense></ProtectedRoute>} />
              <Route path="admin/datasets" element={<ProtectedRoute requireAdmin={true}><Suspense fallback={<Loading />}><DatasetManagement /></Suspense></ProtectedRoute>} />
              <Route path="admin/settings" element={<ProtectedRoute requireAdmin={true}><Suspense fallback={<Loading />}><SystemSettings /></Suspense></ProtectedRoute>} />

              {/* Utilities */}
              <Route path="chat" element={<Suspense fallback={<Loading />}><AIChatPage /></Suspense>} />
              <Route path="profile" element={<div className="p-4">Profile Page Placeholder</div>} />
              <Route path="settings" element={<div className="p-4">Settings Page Placeholder</div>} />

               {/* 404 Route - This must be inside Layout to keep sidebar, or outside to be fullscreen. Let's keep inside Layout for logged in users? 
                   Actually, generic 404 is usually fullscreen or Layout-wrapped. Let's put a catch-all route here for authenticated 404s.
                */}
              <Route path="*" element={<Suspense fallback={<Loading />}><NotFoundPage /></Suspense>} />
            </Route>

            {/* Fallback for unauthenticated or strict 404s outside layout */}
            {/* <Route path="*" element={<Navigate to="/" replace />} /> - replaced with actual 404 page if desired, but Navigate is safer for "catch all to login" logic.
                However, for "Page Not Found", let's route to the 404 page if not matched above.
            */}
          </Routes>
        </HashRouter>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;