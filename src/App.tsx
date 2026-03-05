import React, { useState, useEffect } from 'react';
import { 
  Play, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Bell, 
  HelpCircle, 
  User as UserIcon, 
  LayoutGrid, 
  BookOpen, 
  Award, 
  Bookmark, 
  FileText,
  Settings,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, Module, Lesson, User } from './types';

// --- Components ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-nutror-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-xl font-bold">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const Header = ({ onAdminClick, user, onLogout, setView, currentView, settings }: { onAdminClick: () => void, user: User | null, onLogout: () => void, setView: (v: any) => void, currentView: string, settings: any }) => (
  <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-3 flex items-center justify-between">
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
        {settings.logo_url ? (
          <img src={settings.logo_url} alt="Logo" className="h-8 w-auto object-contain" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-8 h-8 bg-nutror-accent rounded-full flex items-center justify-center font-bold text-black italic">ITL</div>
        )}
        <span className="text-xl font-bold tracking-tight">{settings.app_name}</span>
      </div>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-nutror-muted">
        <button 
          onClick={() => setView('home')} 
          className={`${currentView === 'home' ? 'text-white border-b-2 border-nutror-accent pb-1' : 'hover:text-white transition-colors'}`}
        >
          Meus Cursos
        </button>
        <button 
          onClick={() => setView('certificates')} 
          className={`${currentView === 'certificates' ? 'text-white border-b-2 border-nutror-accent pb-1' : 'hover:text-white transition-colors'}`}
        >
          Certificados
        </button>
        <button 
          onClick={() => setView('saved')} 
          className={`${currentView === 'saved' ? 'text-white border-b-2 border-nutror-accent pb-1' : 'hover:text-white transition-colors'}`}
        >
          Aulas Salvas
        </button>
        <button 
          onClick={() => setView('notes')} 
          className={`${currentView === 'notes' ? 'text-white border-b-2 border-nutror-accent pb-1' : 'hover:text-white transition-colors'}`}
        >
          Minhas Anotações
        </button>
      </nav>
    </div>
    <div className="flex items-center gap-4">
      <div className="relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nutror-muted" />
        <input 
          type="text" 
          placeholder="Procurar cursos e autores" 
          className="bg-nutror-bg border border-white/10 rounded-md py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-nutror-accent/50 w-64"
        />
      </div>
      {user?.role === 'admin' && (
        <button onClick={onAdminClick} className="p-2 hover:bg-white/5 rounded-full transition-colors text-nutror-muted hover:text-white">
          <Settings className="w-5 h-5" />
        </button>
      )}
      <div className="flex items-center gap-2 pl-2 border-l border-white/10 group relative">
        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
          <UserIcon className="w-5 h-5 text-nutror-muted" />
        </div>
        <span className="text-sm font-medium hidden lg:block">{user?.name || 'Usuário'}</span>
        <ChevronDown className="w-4 h-4 text-nutror-muted" />
        
        {/* Dropdown Logout */}
        <div className="absolute top-full right-0 mt-2 w-48 bg-nutror-card border border-white/5 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 z-50">
          <button 
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Sair da conta
          </button>
        </div>
      </div>
    </div>
  </header>
);

const CourseCard = ({ course, onClick }: { course: Course, onClick: (c: Course) => void | Promise<void>, key?: React.Key }) => {
  const percent = course.lesson_count ? Math.round(((course.completed_count || 0) / course.lesson_count) * 100) : 0;
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={() => onClick(course)}
      className="bg-nutror-card rounded-xl overflow-hidden cursor-pointer group border border-white/5 hover:border-nutror-accent/30 transition-all"
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={course.thumbnail || `https://picsum.photos/seed/${course.id}/640/360`} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <button className="bg-nutror-accent text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm">
            <Play className="w-4 h-4 fill-current" /> Continuar
          </button>
        </div>
        {percent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              className="h-full bg-nutror-accent" 
            />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-nutror-accent transition-colors">{course.title}</h3>
        <div className="flex items-center gap-2 text-xs text-nutror-muted mb-3">
          <span className="flex items-center gap-1"><LayoutGrid className="w-3 h-3" /> {course.module_count || 0} Módulos</span>
          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.lesson_count || 0} Aulas</span>
        </div>
        
        {percent > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-nutror-muted mb-1">
              <span>Progresso</span>
              <span>{percent}%</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div className="bg-nutror-accent h-full" style={{ width: `${percent}%` }} />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-nutror-accent/20 flex items-center justify-center">
            <div className="w-3 h-3 bg-nutror-accent rounded-full" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-nutror-muted">EAD ITL</span>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'login' | 'home' | 'course' | 'lesson' | 'admin' | 'notes' | 'saved' | 'certificates'>('login');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'courses' | 'members' | 'users' | 'settings'>('dashboard');
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [lessonComments, setLessonComments] = useState<any[]>([]);
  const [lessonNotes, setLessonNotes] = useState<any[]>([]);
  const [allUserNotes, setAllUserNotes] = useState<any[]>([]);
  const [lessonTab, setLessonTab] = useState<'description' | 'comments' | 'notes'>('description');
  const [newNote, setNewNote] = useState('');
  const [newComment, setNewComment] = useState('');
  const [dashboardStats, setDashboardStats] = useState<any[]>([]);
  const [savedLessons, setSavedLessons] = useState<Lesson[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState({ app_name: 'ITL Cursos', logo_url: '' });

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Admin state
  const [newCourse, setNewCourse] = useState({ title: '', description: '', thumbnail: '' });
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [userLessonIds, setUserLessonIds] = useState<number[]>([]);

  // Modal states
  const [modalType, setModalType] = useState<'module' | 'lesson' | 'permissions' | 'edit-course' | 'edit-module' | 'edit-lesson' | null>(null);
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [modalData, setModalData] = useState<any>({});

  useEffect(() => {
    // Check if user is already logged in (simple session simulation)
    fetchSettings();
    const savedUser = localStorage.getItem('itl_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setView('home');
      fetchData(user);
    }
  }, []);

  useEffect(() => {
    if (currentUser && view === 'notes') {
      fetchAllUserNotes(currentUser.id);
    }
  }, [view, currentUser]);

  const fetchData = (user: User) => {
    fetchCourses(user);
    if (user.role === 'admin') {
      fetchUsers();
      fetchDashboardStats();
      fetchAdminUsers();
    }
    fetchAllUserNotes(user.id);
    fetchSavedLessons(user.id);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data);
        localStorage.setItem('itl_user', JSON.stringify(data));
        setView('home');
        fetchData(data);
      } else {
        setLoginError(data.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setLoginError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('itl_user');
    setView('login');
  };

  const fetchCourses = async (user: User) => {
    setLoading(true);
    try {
      const url = user.role === 'admin' ? '/api/admin/courses' : `/api/users/${user.id}/courses`;
      const res = await fetch(url);
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setAdminUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard/stats');
      const data = await res.json();
      setDashboardStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
      if (data.app_name) {
        document.title = data.app_name;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSavedLessons = async (userId: number) => {
    try {
      const res = await fetch(`/api/users/${userId}/saved`);
      const data = await res.json();
      setSavedLessons(data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSaveLesson = async (lessonId: number) => {
    if (!currentUser) return;
    const isSaved = savedLessons.some(l => l.id === lessonId);
    const method = isSaved ? 'DELETE' : 'POST';
    try {
      await fetch(`/api/users/${currentUser.id}/saved/${lessonId}`, { method });
      fetchSavedLessons(currentUser.id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserCourses = async (userId: number) => {
    try {
      const res = await fetch(`/api/users/${userId}/courses`);
      const data = await res.json();
      setUserCourses(data);
      
      const resLessons = await fetch(`/api/users/${userId}/lessons`);
      const dataLessons = await resLessons.json();
      setUserLessonIds(dataLessons);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourseDetails = async (id: number, userId?: number) => {
    try {
      const url = userId ? `/api/courses/${id}?userId=${userId}` : `/api/courses/${id}`;
      const res = await fetch(url);
      const data = await res.json();
      setSelectedCourse(data);
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const handleCourseClick = async (course: Course) => {
    const details = await fetchCourseDetails(course.id, currentUser?.role === 'student' ? currentUser.id : undefined);
    if (details) {
      setView('course');
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1].split('?')[0];
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const fetchCompletedLessons = async (userId: number) => {
    try {
      const res = await fetch(`/api/users/${userId}/completed`);
      const data = await res.json();
      setCompletedLessonIds(data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLessonCompletion = async (lessonId: number) => {
    if (!currentUser) return;
    const isCompleted = completedLessonIds.includes(lessonId);
    const method = isCompleted ? 'DELETE' : 'POST';
    try {
      await fetch(`/api/users/${currentUser.id}/completed/${lessonId}`, { method });
      fetchCompletedLessons(currentUser.id);
      // Also refresh course list to update progress bars if needed
      fetchCourses(currentUser);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLessonComments = async (lessonId: number) => {
    try {
      const res = await fetch(`/api/lessons/${lessonId}/comments`);
      const data = await res.json();
      setLessonComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    if (!currentUser || !selectedLesson || !newComment.trim()) return;
    try {
      await fetch(`/api/lessons/${selectedLesson.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, content: newComment })
      });
      setNewComment('');
      fetchLessonComments(selectedLesson.id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLessonNotes = async (userId: number, lessonId: number) => {
    try {
      const res = await fetch(`/api/users/${userId}/lessons/${lessonId}/notes`);
      const data = await res.json();
      setLessonNotes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllUserNotes = async (userId: number) => {
    try {
      const res = await fetch(`/api/users/${userId}/notes`);
      const data = await res.json();
      setAllUserNotes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async () => {
    if (!currentUser || !selectedLesson || !newNote.trim()) return;
    try {
      await fetch(`/api/users/${currentUser.id}/lessons/${selectedLesson.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote })
      });
      setNewNote('');
      fetchLessonNotes(currentUser.id, selectedLesson.id);
      fetchAllUserNotes(currentUser.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm('Deseja excluir esta anotação?')) return;
    try {
      await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
      if (currentUser) {
        if (selectedLesson) fetchLessonNotes(currentUser.id, selectedLesson.id);
        fetchAllUserNotes(currentUser.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setView('lesson');
    if (currentUser) {
      fetchCompletedLessons(currentUser.id);
      fetchLessonComments(lesson.id);
      fetchLessonNotes(currentUser.id, lesson.id);
    }
  };

  const handleAddCourse = async () => {
    if (!newCourse.title) return;
    await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCourse)
    });
    setNewCourse({ title: '', description: '', thumbnail: '' });
    if (currentUser) fetchCourses(currentUser);
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Deseja excluir este curso?')) return;
    await fetch(`/api/courses/${id}`, { method: 'DELETE' });
    if (currentUser) fetchCourses(currentUser);
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Preencha todos os campos, incluindo a senha.');
      return;
    }
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    setNewUser({ name: '', email: '', password: '' });
    fetchUsers();
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Deseja excluir este aluno?')) return;
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  const handleGrantAccess = async (userId: number, courseId: number) => {
    await fetch(`/api/users/${userId}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id: courseId })
    });
    fetchUserCourses(userId);
  };

  const handleRevokeAccess = async (userId: number, courseId: number) => {
    if (!confirm('Deseja revogar o acesso a este curso?')) return;
    await fetch(`/api/users/${userId}/courses/${courseId}`, { method: 'DELETE' });
    fetchUserCourses(userId);
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      await fetch(`/api/users/${selectedUser.id}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_ids: userLessonIds })
      });
      setModalType(null);
      alert('Permissões salvas com sucesso!');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLessonPermission = (lessonId: number) => {
    setUserLessonIds(prev => 
      prev.includes(lessonId) ? prev.filter(id => id !== lessonId) : [...prev, lessonId]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {view !== 'login' && (
        <Header 
          onAdminClick={() => setView('admin')} 
          user={currentUser} 
          onLogout={handleLogout}
          setView={setView}
          currentView={view}
          settings={settings}
        />
      )}

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.div 
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen flex items-center justify-center p-6 bg-nutror-bg"
            >
              <div className="w-full max-w-md bg-nutror-card p-8 rounded-3xl border border-white/5 shadow-2xl">
                <div className="text-center mb-8">
                  {settings.logo_url ? (
                    <img src={settings.logo_url} alt="Logo" className="h-16 w-auto object-contain mx-auto mb-4" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-16 h-16 bg-nutror-accent rounded-full flex items-center justify-center font-bold text-black italic text-2xl mx-auto mb-4">ITL</div>
                  )}
                  <h1 className="text-2xl font-bold">{settings.app_name}</h1>
                  <p className="text-nutror-muted text-sm mt-2">Acesse sua área de membros</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-nutror-muted uppercase mb-2">E-mail</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nutror-muted" />
                      <input 
                        type="email" 
                        required
                        value={loginForm.email}
                        onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                        className="w-full bg-nutror-bg border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-nutror-accent transition-colors"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-nutror-muted uppercase mb-2">Senha</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nutror-muted" />
                      <input 
                        type="password" 
                        required
                        value={loginForm.password}
                        onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                        className="w-full bg-nutror-bg border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-nutror-accent transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                      {loginError}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-nutror-accent text-black font-bold py-4 rounded-xl hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Entrando...' : 'Entrar na Plataforma'}
                  </button>

                  <div className="text-center">
                    <a href="#" className="text-xs text-nutror-muted hover:text-white transition-colors">Esqueceu sua senha?</a>
                  </div>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                  <p className="text-xs text-nutror-muted">Ainda não tem acesso? <span className="text-nutror-accent cursor-pointer hover:underline">Saiba mais</span></p>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-6 py-12"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Meus Cursos</h1>
                  <p className="text-nutror-muted">Continue de onde você parou</p>
                </div>
                <div className="flex gap-4">
                  <select className="bg-nutror-card border border-white/10 rounded-md px-4 py-2 text-sm focus:outline-none">
                    <option>Exibir por: Recentes</option>
                  </select>
                  <select className="bg-nutror-card border border-white/10 rounded-md px-4 py-2 text-sm focus:outline-none">
                    <option>Filtrar por: Todos</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-nutror-card aspect-video rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {courses.map(course => (
                    <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
                  ))}
                  {courses.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-2xl">
                      <BookOpen className="w-12 h-12 text-nutror-muted mx-auto mb-4" />
                      <p className="text-nutror-muted">Nenhum curso cadastrado ainda.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {view === 'course' && selectedCourse && (
            <motion.div 
              key="course"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-6 py-12"
            >
              <button onClick={() => setView('home')} className="mb-8 text-nutror-muted hover:text-white flex items-center gap-2 text-sm">
                <ChevronRight className="w-4 h-4 rotate-180" /> Voltar para Meus Cursos
              </button>

              <div className="relative rounded-3xl overflow-hidden aspect-[21/9] mb-12">
                <img 
                  src={selectedCourse.thumbnail || `https://picsum.photos/seed/${selectedCourse.id}/1920/1080`} 
                  alt={selectedCourse.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-12">
                  <h1 className="text-5xl font-bold mb-4">{selectedCourse.title}</h1>
                  <p className="text-xl text-nutror-muted max-w-2xl mb-8">{selectedCourse.description}</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        if (selectedCourse.modules?.[0]?.lessons?.[0]) {
                          handleLessonClick(selectedCourse.modules[0].lessons[0]);
                        }
                      }}
                      className="bg-nutror-accent text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                      <Play className="w-5 h-5 fill-current" /> Começar Agora
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-xl font-bold transition-colors">
                      Matricule-se
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold mb-6">Conteúdo do Curso</h2>
                  <div className="space-y-4">
                    {selectedCourse.modules?.map((module, idx) => (
                      <div key={module.id} className="bg-nutror-card rounded-xl border border-white/5 overflow-hidden">
                        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-nutror-accent/10 text-nutror-accent flex items-center justify-center font-bold">
                              {idx + 1}
                            </div>
                            <span className="font-bold">{module.title}</span>
                          </div>
                          <span className="text-xs text-nutror-muted">{module.lessons.length} aulas</span>
                        </div>
                        <div className="border-t border-white/5">
                          {module.lessons.map((lesson, lIdx) => (
                            <div 
                              key={lesson.id} 
                              onClick={() => handleLessonClick(lesson)}
                              className="p-4 pl-16 flex items-center justify-between hover:bg-white/5 cursor-pointer group transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                  <Play className="w-4 h-4 text-nutror-muted group-hover:text-nutror-accent" />
                                  <span className="text-sm text-nutror-muted group-hover:text-white">{lesson.title}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleSaveLesson(lesson.id);
                                    }}
                                    className={`p-1.5 hover:bg-white/5 rounded-lg transition-colors ${
                                      savedLessons.some(l => l.id === lesson.id) ? 'text-nutror-accent' : 'text-nutror-muted opacity-0 group-hover:opacity-100'
                                    }`}
                                  >
                                    <Bookmark className={`w-3.5 h-3.5 ${savedLessons.some(l => l.id === lesson.id) ? 'fill-current' : ''}`} />
                                  </button>
                                  <span className="text-xs text-nutror-muted">{lesson.duration || '00:00'}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="bg-nutror-card rounded-2xl p-6 border border-white/5">
                    <h3 className="font-bold mb-4">Sobre o Instrutor</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-zinc-800" />
                      <div>
                        <p className="font-bold">Equipe ITL</p>
                        <p className="text-xs text-nutror-muted">Especialistas em Tecnologia</p>
                      </div>
                    </div>
                    <p className="text-sm text-nutror-muted leading-relaxed">
                      Transformando conhecimento em resultados através de metodologias práticas e diretas.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'lesson' && selectedLesson && selectedCourse && (
            <motion.div 
              key="lesson"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden"
            >
              {/* Main Content */}
              <div className="flex-1 flex flex-col bg-black overflow-y-auto custom-scrollbar">
                <div className="p-4 flex items-center justify-between bg-nutror-bg/50 border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setView('course')} className="p-2 hover:bg-white/5 rounded-full">
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div>
                      <p className="text-[10px] text-nutror-muted uppercase tracking-widest font-bold">{selectedCourse.title}</p>
                      <h2 className="text-lg font-bold">{selectedLesson.title}</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleSaveLesson(selectedLesson.id)}
                      className={`p-2 hover:bg-white/5 rounded-full transition-colors ${
                        savedLessons.some(l => l.id === selectedLesson.id) ? 'text-nutror-accent' : 'text-nutror-muted'
                      }`}
                      title={savedLessons.some(l => l.id === selectedLesson.id) ? 'Remover das aulas salvas' : 'Salvar aula'}
                    >
                      <Bookmark className={`w-5 h-5 ${savedLessons.some(l => l.id === selectedLesson.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-full text-nutror-muted"><FileText className="w-5 h-5" /></button>
                  </div>
                </div>

                <div className="relative bg-black flex items-center justify-center aspect-video w-full max-w-5xl mx-auto mt-4 shadow-2xl">
                  <iframe 
                    src={getYoutubeEmbedUrl(selectedLesson.youtube_url)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div className="max-w-5xl mx-auto w-full p-6">
                  {/* Navigation & Completion */}
                  <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                    <button 
                      onClick={() => {
                        const allLessons = selectedCourse.modules.flatMap(m => m.lessons);
                        const currentIndex = allLessons.findIndex(l => l.id === selectedLesson.id);
                        if (currentIndex > 0) handleLessonClick(allLessons[currentIndex - 1]);
                      }}
                      className="flex items-center gap-2 text-sm text-nutror-muted hover:text-white transition-colors group"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> 
                      <div className="text-left">
                        <p className="text-[10px] font-bold opacity-50">AULA ANTERIOR</p>
                        <p className="text-xs">Voltar</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => toggleLessonCompletion(selectedLesson.id)}
                      className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                        completedLessonIds.includes(selectedLesson.id) 
                          ? 'bg-nutror-accent text-black' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {completedLessonIds.includes(selectedLesson.id) ? 'Concluída' : 'Marcar como Concluída'}
                    </button>

                    <button 
                      onClick={() => {
                        const allLessons = selectedCourse.modules.flatMap(m => m.lessons);
                        const currentIndex = allLessons.findIndex(l => l.id === selectedLesson.id);
                        if (currentIndex < allLessons.length - 1) handleLessonClick(allLessons[currentIndex + 1]);
                      }}
                      className="flex items-center gap-2 text-sm text-nutror-muted hover:text-white transition-colors group"
                    >
                      <div className="text-right">
                        <p className="text-[10px] font-bold opacity-50">PRÓXIMA AULA</p>
                        <p className="text-xs">Avançar</p>
                      </div>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-8 border-b border-white/5 mb-6">
                    {(['description', 'comments', 'notes'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setLessonTab(tab)}
                        className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
                          lessonTab === tab ? 'text-nutror-accent' : 'text-nutror-muted hover:text-white'
                        }`}
                      >
                        {tab === 'description' ? 'Descrição' : tab === 'comments' ? 'Comentários' : 'Anotações'}
                        {lessonTab === tab && (
                          <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-nutror-accent" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-[300px]">
                    {lessonTab === 'description' && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <p className="text-nutror-muted leading-relaxed whitespace-pre-wrap">
                          {selectedLesson.description || 'Nenhuma descrição disponível para esta aula.'}
                        </p>
                      </div>
                    )}

                    {lessonTab === 'comments' && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0" />
                          <div className="flex-1">
                            <textarea 
                              value={newComment}
                              onChange={e => setNewComment(e.target.value)}
                              placeholder="Escreva um comentário..."
                              className="w-full bg-nutror-card border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-nutror-accent h-24 resize-none"
                            />
                            <div className="flex justify-end mt-2">
                              <button 
                                onClick={handleAddComment}
                                className="bg-nutror-accent text-black px-6 py-2 rounded-lg font-bold text-sm hover:brightness-110"
                              >
                                Comentar
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-6">
                          {lessonComments.map(comment => (
                            <div key={comment.id} className="flex gap-4">
                              <div className="w-10 h-10 rounded-full bg-nutror-accent/20 text-nutror-accent flex items-center justify-center font-bold text-xs">
                                {comment.user_name?.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-sm">{comment.user_name}</span>
                                  <span className="text-[10px] text-nutror-muted uppercase">{new Date(comment.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-nutror-muted">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {lessonTab === 'notes' && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                        <div className="bg-nutror-card border border-white/10 rounded-xl p-6">
                          <h4 className="text-sm font-bold mb-4">Nova Anotação</h4>
                          <textarea 
                            value={newNote}
                            onChange={e => setNewNote(e.target.value)}
                            placeholder="Suas anotações privadas sobre esta aula..."
                            className="w-full bg-nutror-bg border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-nutror-accent h-32 resize-none mb-4"
                          />
                          <div className="flex justify-end">
                            <button 
                              onClick={handleAddNote}
                              className="bg-nutror-accent text-black px-6 py-2 rounded-lg font-bold text-sm hover:brightness-110"
                            >
                              Salvar Anotação
                            </button>
                          </div>
                        </div>
                        <div className="space-y-4">
                          {lessonNotes.map(note => (
                            <div key={note.id} className="bg-white/5 border border-white/5 rounded-xl p-4 group">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] text-nutror-muted uppercase font-bold">{new Date(note.created_at).toLocaleString()}</span>
                                <button onClick={() => handleDeleteNote(note.id)} className="text-nutror-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-sm text-nutror-muted whitespace-pre-wrap">{note.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-96 glass border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col h-[40vh] lg:h-full order-2 lg:order-none">
                <div className="p-6 border-b border-white/5">
                  <h3 className="font-bold mb-2 truncate">{selectedCourse.title}</h3>
                  {(() => {
                    const allLessons = selectedCourse.modules.flatMap(m => m.lessons);
                    const total = allLessons.length;
                    const completed = allLessons.filter(l => completedLessonIds.includes(l.id)).length;
                    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
                    return (
                      <>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            className="bg-nutror-accent h-full" 
                          />
                        </div>
                        <p className="text-[10px] text-nutror-muted mt-2 font-bold uppercase">
                          {percent}% CONCLUÍDO: {completed} DE {total} AULAS
                        </p>
                      </>
                    );
                  })()}
                </div>
                
                <div className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nutror-muted" />
                    <input 
                      type="text" 
                      placeholder="Procurar Aula" 
                      className="w-full bg-nutror-bg border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-nutror-accent/50"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {selectedCourse.modules?.map((module, mIdx) => (
                    <div key={module.id} className="border-b border-white/5 last:border-0">
                      <div className="p-4 bg-white/5 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            module.lessons.every(l => completedLessonIds.includes(l.id)) 
                              ? 'border-nutror-accent bg-nutror-accent' 
                              : 'border-nutror-accent'
                          }`}>
                            {module.lessons.every(l => completedLessonIds.includes(l.id)) ? (
                              <ChevronRight className="w-3 h-3 text-black" />
                            ) : (
                              <div className="w-1.5 h-1.5 bg-nutror-accent rounded-full" />
                            )}
                          </div>
                          <span className="text-sm font-bold truncate max-w-[200px]">{module.title}</span>
                        </div>
                        <span className="text-[10px] text-nutror-muted font-bold">{module.lessons.length} aulas</span>
                      </div>
                      <div className="bg-black/20">
                        {module.lessons.map((lesson) => (
                          <div 
                            key={lesson.id}
                            onClick={() => handleLessonClick(lesson)}
                            className={`p-4 pl-12 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors group ${
                              selectedLesson.id === lesson.id ? 'bg-nutror-accent/5 border-l-2 border-nutror-accent' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                completedLessonIds.includes(lesson.id) 
                                  ? 'border-nutror-accent bg-nutror-accent' 
                                  : 'border-white/20 group-hover:border-white/40'
                              }`}>
                                {completedLessonIds.includes(lesson.id) && <ChevronRight className="w-2.5 h-2.5 text-black" />}
                              </div>
                              <span className={`text-sm transition-colors ${
                                selectedLesson.id === lesson.id ? 'text-nutror-accent font-medium' : 'text-nutror-muted group-hover:text-white'
                              }`}>{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSaveLesson(lesson.id);
                                }}
                                className={`p-1.5 hover:bg-white/5 rounded-lg transition-colors ${
                                  savedLessons.some(l => l.id === lesson.id) ? 'text-nutror-accent' : 'text-nutror-muted opacity-0 group-hover:opacity-100'
                                }`}
                              >
                                <Bookmark className={`w-3 h-3 ${savedLessons.some(l => l.id === lesson.id) ? 'fill-current' : ''}`} />
                              </button>
                              {lesson.duration && <span className="text-[10px] text-nutror-muted font-bold">{lesson.duration}</span>}
                              {selectedLesson.id === lesson.id && <Play className="w-3 h-3 text-nutror-accent animate-pulse" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'saved' && (
            <motion.div 
              key="saved"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto px-6 py-12"
            >
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Aulas Salvas</h1>
                  <p className="text-nutror-muted">Suas aulas favoritas organizadas em um só lugar.</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-nutror-accent/10 flex items-center justify-center text-nutror-accent">
                  <Bookmark className="w-6 h-6 fill-current" />
                </div>
              </div>

              {savedLessons.length === 0 ? (
                <div className="bg-nutror-card rounded-3xl p-12 text-center border border-white/5">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <Bookmark className="w-8 h-8 text-nutror-muted" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Nenhuma aula salva</h3>
                  <p className="text-nutror-muted max-w-sm mx-auto">
                    Salve suas aulas favoritas para acessá-las rapidamente aqui.
                  </p>
                  <button 
                    onClick={() => setView('home')}
                    className="mt-8 bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors"
                  >
                    Explorar Cursos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {savedLessons.map(lesson => (
                    <motion.div 
                      key={lesson.id}
                      layout
                      className="bg-nutror-card rounded-2xl border border-white/5 overflow-hidden hover:border-nutror-accent/30 transition-all group"
                    >
                      <div className="aspect-video relative">
                        <img 
                          src={`https://img.youtube.com/vi/${getYoutubeEmbedUrl(lesson.youtube_url).split('/').pop()}/mqdefault.jpg`} 
                          alt={lesson.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={async () => {
                              const course = courses.find(c => c.id === (lesson as any).course_id) || await fetchCourseDetails((lesson as any).course_id, currentUser?.id);
                              if (course) {
                                setSelectedCourse(course);
                                handleLessonClick(lesson);
                              }
                            }}
                            className="bg-nutror-accent text-black w-12 h-12 rounded-full flex items-center justify-center"
                          >
                            <Play className="w-6 h-6 fill-current" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-[10px] font-bold text-nutror-accent uppercase tracking-widest mb-1">{(lesson as any).course_title}</p>
                            <h3 className="font-bold text-sm line-clamp-1">{lesson.title}</h3>
                          </div>
                          <button 
                            onClick={() => toggleSaveLesson(lesson.id)}
                            className="text-nutror-accent p-1 hover:bg-white/5 rounded-lg"
                          >
                            <Bookmark className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                        <p className="text-xs text-nutror-muted">{(lesson as any).module_title}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {view === 'certificates' && (
            <motion.div 
              key="certificates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto px-6 py-12"
            >
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Meus Certificados</h1>
                  <p className="text-nutror-muted">Conclua seus cursos para emitir seus certificados de conclusão.</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-nutror-accent/10 flex items-center justify-center text-nutror-accent">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {courses.filter(c => {
                  const percent = c.lesson_count ? Math.round(((c.completed_count || 0) / c.lesson_count) * 100) : 0;
                  return percent === 100;
                }).map(course => (
                  <div key={course.id} className="bg-nutror-card rounded-3xl border border-white/10 p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-nutror-accent/5 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-nutror-accent/20 flex items-center justify-center text-nutror-accent mb-6">
                        <Award className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                      <p className="text-nutror-muted text-sm mb-8">Concluído em {new Date().toLocaleDateString()}</p>
                      
                      <div className="flex items-center gap-4">
                        <button className="bg-nutror-accent text-black px-6 py-3 rounded-xl font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2">
                          <ExternalLink className="w-4 h-4" /> Visualizar Certificado
                        </button>
                        <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all">
                          Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {courses.filter(c => {
                  const percent = c.lesson_count ? Math.round(((c.completed_count || 0) / c.lesson_count) * 100) : 0;
                  return percent === 100;
                }).length === 0 && (
                  <div className="col-span-full bg-nutror-card rounded-3xl p-12 text-center border border-white/5">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                      <Award className="w-8 h-8 text-nutror-muted opacity-20" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Nenhum certificado disponível</h3>
                    <p className="text-nutror-muted max-w-sm mx-auto">
                      Conclua 100% das aulas de um curso para liberar seu certificado de conclusão.
                    </p>
                    <button 
                      onClick={() => setView('home')}
                      className="mt-8 bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors"
                    >
                      Continuar Estudando
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          {view === 'notes' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto px-6 py-12"
            >
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Minhas Anotações</h1>
                  <p className="text-nutror-muted">Todas as suas anotações privadas organizadas por curso e aula.</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-nutror-accent/10 flex items-center justify-center text-nutror-accent">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              {allUserNotes.length === 0 ? (
                <div className="bg-nutror-card rounded-3xl p-12 text-center border border-white/5">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <Bookmark className="w-8 h-8 text-nutror-muted" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Nenhuma anotação ainda</h3>
                  <p className="text-nutror-muted max-w-sm mx-auto">
                    Suas anotações feitas durante as aulas aparecerão aqui automaticamente.
                  </p>
                  <button 
                    onClick={() => setView('home')}
                    className="mt-8 bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors"
                  >
                    Explorar Cursos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {allUserNotes.map(note => (
                    <motion.div 
                      key={note.id}
                      layout
                      className="bg-nutror-card rounded-2xl border border-white/5 p-6 hover:border-nutror-accent/30 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-[10px] font-bold text-nutror-accent uppercase tracking-widest mb-1">{note.course_title}</p>
                          <h3 className="font-bold text-lg">{note.lesson_title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-nutror-muted font-bold uppercase">{new Date(note.created_at).toLocaleDateString()}</span>
                          <button 
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                        <p className="text-sm text-nutror-muted leading-relaxed whitespace-pre-wrap">{note.content}</p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={async () => {
                            const course = courses.find(c => c.id === note.course_id) || await fetchCourseDetails(note.course_id, currentUser?.id);
                            if (course) {
                              setSelectedCourse(course);
                              const lesson = course.modules.flatMap(m => m.lessons).find(l => l.id === note.lesson_id);
                              if (lesson) handleLessonClick(lesson);
                            }
                          }}
                          className="text-xs font-bold text-nutror-accent flex items-center gap-1 hover:underline"
                        >
                          Ir para aula <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
          {view === 'admin' && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto px-6 py-12"
            >
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Painel Administrativo</h1>
                <button onClick={() => setView('home')} className="p-2 hover:bg-white/5 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex gap-4 mb-8 border-b border-white/5">
                <button 
                  onClick={() => setAdminTab('dashboard')}
                  className={`pb-4 px-4 text-sm font-bold transition-colors ${adminTab === 'dashboard' ? 'text-nutror-accent border-b-2 border-nutror-accent' : 'text-nutror-muted hover:text-white'}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setAdminTab('courses')}
                  className={`pb-4 px-4 text-sm font-bold transition-colors ${adminTab === 'courses' ? 'text-nutror-accent border-b-2 border-nutror-accent' : 'text-nutror-muted hover:text-white'}`}
                >
                  Cursos & Aulas
                </button>
                <button 
                  onClick={() => setAdminTab('members')}
                  className={`pb-4 px-4 text-sm font-bold transition-colors ${adminTab === 'members' ? 'text-nutror-accent border-b-2 border-nutror-accent' : 'text-nutror-muted hover:text-white'}`}
                >
                  Membros (Alunos)
                </button>
                <button 
                  onClick={() => setAdminTab('users')}
                  className={`pb-4 px-4 text-sm font-bold transition-colors ${adminTab === 'users' ? 'text-nutror-accent border-b-2 border-nutror-accent' : 'text-nutror-muted hover:text-white'}`}
                >
                  Usuários
                </button>
                <button 
                  onClick={() => setAdminTab('settings')}
                  className={`pb-4 px-4 text-sm font-bold transition-colors ${adminTab === 'settings' ? 'text-nutror-accent border-b-2 border-nutror-accent' : 'text-nutror-muted hover:text-white'}`}
                >
                  Configuração
                </button>
              </div>

              {adminTab === 'dashboard' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-nutror-card p-6 rounded-2xl border border-white/5">
                      <p className="text-xs font-bold text-nutror-muted uppercase mb-1">Total de Alunos</p>
                      <p className="text-3xl font-bold">{dashboardStats.length}</p>
                    </div>
                    <div className="bg-nutror-card p-6 rounded-2xl border border-white/5">
                      <p className="text-xs font-bold text-nutror-muted uppercase mb-1">Cursos Ativos</p>
                      <p className="text-3xl font-bold">{courses.length}</p>
                    </div>
                    <div className="bg-nutror-card p-6 rounded-2xl border border-white/5">
                      <p className="text-xs font-bold text-nutror-muted uppercase mb-1">Aulas Totais</p>
                      <p className="text-3xl font-bold">{courses.reduce((acc, c) => acc + (c.lesson_count || 0), 0)}</p>
                    </div>
                  </div>

                  <div className="bg-nutror-card rounded-2xl border border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5">
                      <h2 className="text-xl font-bold">Desempenho dos Membros</h2>
                      <p className="text-sm text-nutror-muted">Acompanhe o progresso individual de cada aluno.</p>
                    </div>
                    <div className="divide-y divide-white/5">
                      {dashboardStats.map(stat => {
                        const percent = stat.total_lessons > 0 ? Math.round((stat.completed_lessons / stat.total_lessons) * 100) : 0;
                        return (
                          <div key={stat.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-nutror-accent/10 text-nutror-accent flex items-center justify-center font-bold">
                                {stat.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold">{stat.name}</p>
                                <p className="text-xs text-nutror-muted">{stat.email}</p>
                              </div>
                            </div>
                            <div className="w-64">
                              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-nutror-muted mb-1">
                                <span>Progresso</span>
                                <span>{percent}%</span>
                              </div>
                              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-nutror-accent h-full" style={{ width: `${percent}%` }} />
                              </div>
                              <p className="text-[10px] text-nutror-muted mt-1">
                                {stat.completed_lessons} de {stat.total_lessons} aulas concluídas
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      {dashboardStats.length === 0 && (
                        <div className="p-12 text-center text-nutror-muted">
                          Nenhum aluno cadastrado para exibir estatísticas.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {adminTab === 'courses' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Add Course */}
                  <div className="bg-nutror-card p-8 rounded-2xl border border-white/5 h-fit">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-nutror-accent" /> Novo Curso
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Título</label>
                        <input 
                          type="text" 
                          value={newCourse.title}
                          onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                          className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent"
                          placeholder="Ex: React para Iniciantes"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Descrição</label>
                        <textarea 
                          value={newCourse.description}
                          onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                          className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent h-24"
                          placeholder="Breve descrição do curso"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">URL da Thumbnail</label>
                        <input 
                          type="text" 
                          value={newCourse.thumbnail}
                          onChange={e => setNewCourse({...newCourse, thumbnail: e.target.value})}
                          className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent"
                          placeholder="https://..."
                        />
                      </div>
                      <button 
                        onClick={handleAddCourse}
                        className="w-full bg-nutror-accent text-black font-bold py-3 rounded-lg hover:brightness-110 transition-all"
                      >
                        Criar Curso
                      </button>
                    </div>
                  </div>

                  {/* Manage Content */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold mb-4">Cursos Ativos</h2>
                    {courses.map(course => (
                      <div key={course.id} className="bg-nutror-card p-6 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img src={course.thumbnail || `https://picsum.photos/seed/${course.id}/100/100`} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                            <div>
                              <p className="font-bold">{course.title}</p>
                              <p className="text-xs text-nutror-muted">ID: {course.id}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setActiveCourseId(course.id);
                                setModalType('edit-course');
                                setModalData({ title: course.title, description: course.description, thumbnail: course.thumbnail });
                              }}
                              className="p-2 hover:bg-white/5 rounded-lg text-nutror-muted hover:text-white" title="Editar Curso"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setActiveCourseId(course.id);
                                setModalType('module');
                                setModalData({ title: '' });
                              }}
                              className="p-2 hover:bg-white/5 rounded-lg text-nutror-accent" title="Adicionar Módulo"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleDeleteCourse(course.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-500">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Modules List in Admin */}
                        <div className="space-y-3 pl-4 border-l border-white/5">
                          {course.modules?.map(module => (
                            <div key={module.id} className="bg-white/5 rounded-lg p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold flex items-center gap-2">
                                  <ChevronRight className="w-3 h-3 text-nutror-accent" /> {module.title}
                                </span>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => {
                                      setActiveModuleId(module.id);
                                      setModalType('edit-module');
                                      setModalData({ title: module.title });
                                    }}
                                    className="p-1.5 hover:bg-white/5 rounded text-nutror-muted hover:text-white" title="Editar Módulo"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setActiveModuleId(module.id);
                                      setModalType('lesson');
                                      setModalData({ title: '', description: '', youtube_url: '' });
                                    }}
                                    className="p-1.5 hover:bg-white/5 rounded text-nutror-accent" title="Adicionar Aula"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={async () => {
                                      if (confirm('Deseja excluir este módulo e todas as suas aulas?')) {
                                        await fetch(`/api/modules/${module.id}`, { method: 'DELETE' });
                                        if (currentUser) fetchCourses(currentUser);
                                      }
                                    }}
                                    className="p-1.5 hover:bg-red-500/10 rounded text-red-500/70 hover:text-red-500" title="Excluir Módulo"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              <div className="space-y-1 pl-4">
                                {module.lessons?.map(lesson => (
                                  <div key={lesson.id} className="text-xs text-nutror-muted flex items-center justify-between group py-1 border-b border-white/5 last:border-0">
                                    <span>• {lesson.title}</span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button 
                                        onClick={() => {
                                          setActiveLessonId(lesson.id);
                                          setModalType('edit-lesson');
                                          setModalData({ title: lesson.title, description: lesson.description || '', youtube_url: lesson.youtube_url });
                                        }}
                                        className="text-nutror-muted hover:text-white"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </button>
                                      <button 
                                        onClick={async () => {
                                          if (confirm('Deseja excluir esta aula?')) {
                                            await fetch(`/api/lessons/${lesson.id}`, { method: 'DELETE' });
                                            if (currentUser) fetchCourses(currentUser);
                                          }
                                        }}
                                        className="text-red-500/50 hover:text-red-500"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                                {(!module.lessons || module.lessons.length === 0) && (
                                  <p className="text-[10px] text-nutror-muted italic">Nenhuma aula cadastrada</p>
                                )}
                              </div>
                            </div>
                          ))}
                          {(!course.modules || course.modules.length === 0) && (
                            <p className="text-xs text-nutror-muted italic">Nenhum módulo cadastrado</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminTab === 'members' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Add Member */}
                  <div className="bg-nutror-card p-6 rounded-2xl border border-white/5 h-fit">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-nutror-accent" /> Novo Aluno
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Nome</label>
                        <input 
                          type="text" 
                          value={newUser.name}
                          onChange={e => setNewUser({...newUser, name: e.target.value})}
                          className="w-full bg-nutror-bg border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-nutror-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">E-mail</label>
                        <input 
                          type="email" 
                          value={newUser.email}
                          onChange={e => setNewUser({...newUser, email: e.target.value})}
                          className="w-full bg-nutror-bg border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-nutror-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Senha</label>
                        <input 
                          type="password" 
                          value={newUser.password}
                          onChange={e => setNewUser({...newUser, password: e.target.value})}
                          className="w-full bg-nutror-bg border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-nutror-accent"
                          placeholder="Defina uma senha"
                        />
                      </div>
                      <button 
                        onClick={handleAddUser}
                        className="w-full bg-nutror-accent text-black font-bold py-2 rounded-lg hover:brightness-110 transition-all text-sm"
                      >
                        Cadastrar Aluno
                      </button>
                    </div>
                  </div>

                  {/* Members List */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold mb-4">Alunos Cadastrados</h2>
                    {users.map(user => (
                      <div 
                        key={user.id} 
                        onClick={() => {
                          setSelectedUser(user);
                          fetchUserCourses(user.id);
                        }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedUser?.id === user.id ? 'bg-nutror-accent/10 border-nutror-accent' : 'bg-nutror-card border-white/5 hover:border-white/20'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-sm">{user.name}</p>
                            <p className="text-xs text-nutror-muted">{user.email}</p>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(user.id);
                            }}
                            className="p-1 text-nutror-muted hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Permissions */}
                  <div className="bg-nutror-card p-6 rounded-2xl border border-white/5 h-fit">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <Award className="w-5 h-5 text-nutror-accent" /> Permissões
                    </h2>
                    {selectedUser ? (
                      <div className="space-y-6">
                        <div>
                          <p className="text-xs font-bold text-nutror-muted uppercase mb-4">Acessos de {selectedUser.name}</p>
                          <div className="space-y-2">
                            {courses.map(course => {
                              const hasAccess = userCourses.some(uc => uc.id === course.id);
                              return (
                                <div key={course.id} className="flex items-center justify-between p-2 rounded bg-white/5">
                                  <span className="text-xs truncate max-w-[150px]">{course.title}</span>
                                  <div className="flex gap-1">
                                    <button 
                                      onClick={() => {
                                        fetchCourseDetails(course.id).then((details) => {
                                          setSelectedCourse(details);
                                          setModalType('permissions');
                                        });
                                      }}
                                      className="text-[10px] font-bold px-2 py-1 rounded bg-white/10 text-white hover:bg-white/20"
                                    >
                                      Aulas
                                    </button>
                                    <button 
                                      onClick={() => hasAccess ? handleRevokeAccess(selectedUser.id, course.id) : handleGrantAccess(selectedUser.id, course.id)}
                                      className={`text-[10px] font-bold px-2 py-1 rounded ${hasAccess ? 'bg-red-500/20 text-red-500' : 'bg-nutror-accent/20 text-nutror-accent'}`}
                                    >
                                      {hasAccess ? 'Revogar' : 'Permitir'}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <UserIcon className="w-8 h-8 text-nutror-muted mx-auto mb-2 opacity-20" />
                        <p className="text-xs text-nutror-muted">Selecione um aluno para gerenciar acessos</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {adminTab === 'users' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Add Admin User */}
                  <div className="bg-nutror-card p-8 rounded-2xl border border-white/5 h-fit">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-nutror-accent" /> Novo Usuário Administrativo
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Nome</label>
                        <input 
                          type="text" 
                          value={newUser.name}
                          onChange={e => setNewUser({...newUser, name: e.target.value})}
                          className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent"
                          placeholder="Nome Completo"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">E-mail</label>
                        <input 
                          type="email" 
                          value={newUser.email}
                          onChange={e => setNewUser({...newUser, email: e.target.value})}
                          className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent"
                          placeholder="email@itl.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Senha</label>
                        <input 
                          type="password" 
                          value={newUser.password}
                          onChange={e => setNewUser({...newUser, password: e.target.value})}
                          className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent"
                          placeholder="Defina uma senha"
                        />
                      </div>
                      <button 
                        onClick={async () => {
                          if (!newUser.name || !newUser.email || !newUser.password) {
                            alert('Preencha todos os campos.');
                            return;
                          }
                          try {
                            const res = await fetch('/api/admin/users', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(newUser)
                            });
                            if (res.ok) {
                              setNewUser({ name: '', email: '', password: '' });
                              fetchAdminUsers();
                              alert('Usuário administrativo cadastrado com sucesso!');
                            } else {
                              const err = await res.json();
                              alert(`Erro: ${err.error}`);
                            }
                          } catch (err) {
                            alert('Erro de conexão.');
                          }
                        }}
                        className="w-full bg-nutror-accent text-black font-bold py-3 rounded-lg hover:brightness-110 transition-all"
                      >
                        Cadastrar Usuário Administrativo
                      </button>
                    </div>
                  </div>

                  {/* Admin Users List */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold mb-4">Usuários com Permissão Total</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {adminUsers.map(user => (
                        <div key={user.id} className="bg-nutror-card p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-nutror-accent/10 text-nutror-accent flex items-center justify-center font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold">{user.name}</p>
                              <p className="text-xs text-nutror-muted">{user.email}</p>
                            </div>
                          </div>
                          <button 
                            onClick={async () => {
                              if (confirm('Deseja excluir este usuário administrativo?')) {
                                await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
                                fetchAdminUsers();
                              }
                            }}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-red-500"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      {adminUsers.length === 0 && (
                        <p className="text-nutror-muted text-center py-8">Nenhum outro usuário administrativo cadastrado.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {adminTab === 'settings' && (
                <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-nutror-card p-8 rounded-2xl border border-white/5">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-nutror-accent" /> Configuração do Sistema
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Nome da Plataforma</label>
                        <input 
                          type="text" 
                          value={settings.app_name}
                          onChange={e => setSettings({...settings, app_name: e.target.value})}
                          className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent"
                          placeholder="Ex: ITL Cursos"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">URL da Logo</label>
                        <input 
                          type="text" 
                          value={settings.logo_url || ''}
                          onChange={e => setSettings({...settings, logo_url: e.target.value})}
                          className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent"
                          placeholder="https://exemplo.com/logo.png"
                        />
                        <p className="text-[10px] text-nutror-muted mt-1">Recomendado: Logo com fundo transparente (PNG) e altura de 32px.</p>
                      </div>
                      
                      {settings.logo_url && (
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <p className="text-[10px] font-bold text-nutror-muted uppercase mb-2">Pré-visualização da Logo</p>
                          <div className="bg-nutror-bg p-4 rounded-lg flex items-center justify-center">
                            <img src={settings.logo_url} alt="Preview" className="h-8 w-auto object-contain" referrerPolicy="no-referrer" />
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={async () => {
                          try {
                            const res = await fetch('/api/admin/settings', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(settings)
                            });
                            if (res.ok) {
                              alert('Configurações salvas com sucesso!');
                              fetchSettings();
                            } else {
                              alert('Erro ao salvar configurações.');
                            }
                          } catch (err) {
                            alert('Erro de conexão.');
                          }
                        }}
                        className="w-full bg-nutror-accent text-black font-bold py-3 rounded-lg hover:brightness-110 transition-all"
                      >
                        Salvar Alterações
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <Modal 
          isOpen={modalType === 'edit-course'} 
          onClose={() => setModalType(null)} 
          title="Editar Curso"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Título</label>
              <input 
                type="text" 
                value={modalData.title}
                onChange={e => setModalData({...modalData, title: e.target.value})}
                className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Descrição</label>
              <textarea 
                value={modalData.description}
                onChange={e => setModalData({...modalData, description: e.target.value})}
                className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent h-24"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">URL da Thumbnail</label>
              <input 
                type="text" 
                value={modalData.thumbnail}
                onChange={e => setModalData({...modalData, thumbnail: e.target.value})}
                className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent"
              />
            </div>
            <button 
              onClick={async () => {
                if (!modalData.title) {
                  alert('O título do curso é obrigatório.');
                  return;
                }
                if (!activeCourseId) {
                  alert('Erro: ID do curso não encontrado.');
                  return;
                }
                try {
                  const res = await fetch(`/api/courses/${activeCourseId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(modalData)
                  });
                  if (res.ok) {
                    setModalType(null);
                    if (currentUser) fetchCourses(currentUser);
                  } else {
                    const err = await res.json();
                    alert(`Erro ao salvar curso: ${err.error || 'Erro desconhecido'}`);
                  }
                } catch (err) {
                  alert('Erro de conexão ao salvar curso.');
                }
              }}
              className="w-full bg-nutror-accent text-black font-bold py-3 rounded-lg hover:brightness-110 transition-all"
            >
              Salvar Alterações
            </button>
          </div>
        </Modal>

        <Modal 
          isOpen={modalType === 'module'} 
          onClose={() => setModalType(null)} 
          title="Novo Módulo"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Título do Módulo</label>
              <input 
                type="text" 
                value={modalData.title}
                onChange={e => setModalData({...modalData, title: e.target.value})}
                className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent"
                placeholder="Ex: Introdução ao Curso"
              />
            </div>
            <button 
              onClick={async () => {
                if (!modalData.title) {
                  alert('O título do módulo é obrigatório.');
                  return;
                }
                if (!activeCourseId) {
                  alert('Erro: ID do curso não encontrado.');
                  return;
                }
                try {
                  const res = await fetch('/api/modules', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ course_id: activeCourseId, title: modalData.title, order_index: 0 })
                  });
                  if (res.ok) {
                    setModalType(null);
                    if (currentUser) fetchCourses(currentUser);
                  } else {
                    const err = await res.json();
                    alert(`Erro ao adicionar módulo: ${err.error || 'Erro desconhecido'}`);
                  }
                } catch (err) {
                  alert('Erro de conexão ao adicionar módulo.');
                }
              }}
              className="w-full bg-nutror-accent text-black font-bold py-3 rounded-lg hover:brightness-110 transition-all"
            >
              Adicionar Módulo
            </button>
          </div>
        </Modal>

        <Modal 
          isOpen={modalType === 'edit-module'} 
          onClose={() => setModalType(null)} 
          title="Editar Módulo"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Título do Módulo</label>
              <input 
                type="text" 
                value={modalData.title}
                onChange={e => setModalData({...modalData, title: e.target.value})}
                className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent"
              />
            </div>
            <button 
              onClick={async () => {
                if (!modalData.title) {
                  alert('O título do módulo é obrigatório.');
                  return;
                }
                if (!activeModuleId) {
                  alert('Erro: ID do módulo não encontrado.');
                  return;
                }
                try {
                  const res = await fetch(`/api/modules/${activeModuleId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: modalData.title, order_index: 0 })
                  });
                  if (res.ok) {
                    setModalType(null);
                    if (currentUser) fetchCourses(currentUser);
                  } else {
                    const err = await res.json();
                    alert(`Erro ao salvar módulo: ${err.error || 'Erro desconhecido'}`);
                  }
                } catch (err) {
                  alert('Erro de conexão ao salvar módulo.');
                }
              }}
              className="w-full bg-nutror-accent text-black font-bold py-3 rounded-lg hover:brightness-110 transition-all"
            >
              Salvar Alterações
            </button>
          </div>
        </Modal>

        <Modal 
          isOpen={modalType === 'lesson'} 
          onClose={() => setModalType(null)} 
          title="Nova Aula"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Título da Aula</label>
              <input 
                type="text" 
                value={modalData.title}
                onChange={e => setModalData({...modalData, title: e.target.value})}
                className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent"
                placeholder="Ex: Aula 01 - Primeiros Passos"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Descrição da Aula</label>
              <textarea 
                value={modalData.description}
                onChange={e => setModalData({...modalData, description: e.target.value})}
                className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent h-24"
                placeholder="Descreva o que será ensinado nesta aula..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">URL do YouTube</label>
              <input 
                type="text" 
                value={modalData.youtube_url}
                onChange={e => setModalData({...modalData, youtube_url: e.target.value})}
                className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Duração (MM:SS)</label>
              <input 
                type="text" 
                value={modalData.duration || ''}
                onChange={e => setModalData({...modalData, duration: e.target.value})}
                className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent"
                placeholder="Ex: 12:45"
              />
            </div>

            {modalData.youtube_url && getYoutubeEmbedUrl(modalData.youtube_url) && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Prévia do Vídeo</label>
                <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
                  <iframe 
                    src={getYoutubeEmbedUrl(modalData.youtube_url)} 
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <button 
              onClick={async () => {
                if (!modalData.title || !modalData.youtube_url) {
                  alert('Título e URL do YouTube são obrigatórios.');
                  return;
                }
                if (!activeModuleId) {
                  alert('Erro: ID do módulo não encontrado.');
                  return;
                }
                try {
                  const res = await fetch('/api/lessons', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      module_id: activeModuleId, 
                      title: modalData.title, 
                      description: modalData.description,
                      youtube_url: modalData.youtube_url, 
                      duration: modalData.duration || '00:00',
                      order_index: 0 
                    })
                  });
                  if (res.ok) {
                    setModalType(null);
                    if (currentUser) fetchCourses(currentUser);
                  } else {
                    const err = await res.json();
                    alert(`Erro ao adicionar aula: ${err.error || 'Erro desconhecido'}`);
                  }
                } catch (err) {
                  alert('Erro de conexão ao adicionar aula.');
                }
              }}
              className="w-full bg-nutror-accent text-black font-bold py-3 rounded-lg hover:brightness-110 transition-all"
            >
              Adicionar Aula
            </button>
          </div>
        </Modal>

        <Modal 
          isOpen={modalType === 'edit-lesson'} 
          onClose={() => setModalType(null)} 
          title="Editar Aula"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Título da Aula</label>
              <input 
                type="text" 
                value={modalData.title}
                onChange={e => setModalData({...modalData, title: e.target.value})}
                className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Descrição da Aula</label>
              <textarea 
                value={modalData.description}
                onChange={e => setModalData({...modalData, description: e.target.value})}
                className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent h-24"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">URL do YouTube</label>
              <input 
                type="text" 
                value={modalData.youtube_url}
                onChange={e => setModalData({...modalData, youtube_url: e.target.value})}
                className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Duração (MM:SS)</label>
              <input 
                type="text" 
                value={modalData.duration || ''}
                onChange={e => setModalData({...modalData, duration: e.target.value})}
                className="w-full bg-nutror-bg border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-nutror-accent"
                placeholder="Ex: 12:45"
              />
            </div>

            {modalData.youtube_url && getYoutubeEmbedUrl(modalData.youtube_url) && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-nutror-muted uppercase mb-1">Prévia do Vídeo</label>
                <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
                  <iframe 
                    src={getYoutubeEmbedUrl(modalData.youtube_url)} 
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <button 
              onClick={async () => {
                if (!modalData.title || !modalData.youtube_url) {
                  alert('Título e URL do YouTube são obrigatórios.');
                  return;
                }
                if (!activeLessonId) {
                  alert('Erro: ID da aula não encontrado.');
                  return;
                }
                try {
                  const res = await fetch(`/api/lessons/${activeLessonId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      title: modalData.title, 
                      description: modalData.description,
                      youtube_url: modalData.youtube_url, 
                      duration: modalData.duration || '00:00',
                      order_index: 0 
                    })
                  });
                  if (res.ok) {
                    setModalType(null);
                    if (currentUser) fetchCourses(currentUser);
                  } else {
                    const err = await res.json();
                    alert(`Erro ao salvar aula: ${err.error || 'Erro desconhecido'}`);
                  }
                } catch (err) {
                  alert('Erro de conexão ao salvar aula.');
                }
              }}
              className="w-full bg-nutror-accent text-black font-bold py-3 rounded-lg hover:brightness-110 transition-all"
            >
              Salvar Alterações
            </button>
          </div>
        </Modal>

        <Modal 
          isOpen={modalType === 'permissions' && !!selectedCourse && !!selectedUser} 
          onClose={() => setModalType(null)} 
          title={`Aulas: ${selectedCourse?.title}`}
        >
          <div className="space-y-6">
            <p className="text-xs text-nutror-muted">Selecione quais aulas o aluno <strong>{selectedUser?.name}</strong> terá acesso.</p>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
              {selectedCourse?.modules?.map(module => (
                <div key={module.id} className="space-y-2">
                  <h4 className="text-sm font-bold text-nutror-accent">{module.title}</h4>
                  <div className="space-y-1">
                    {module.lessons.map(lesson => (
                      <label key={lesson.id} className="flex items-center gap-3 p-2 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={userLessonIds.includes(lesson.id)}
                          onChange={() => toggleLessonPermission(lesson.id)}
                          className="w-4 h-4 accent-nutror-accent"
                        />
                        <span className="text-sm text-nutror-muted">{lesson.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={handleSavePermissions}
              className="w-full bg-nutror-accent text-black font-bold py-3 rounded-lg hover:brightness-110 transition-all"
            >
              Salvar Permissões
            </button>
          </div>
        </Modal>
      </main>

      <footer className="py-8 px-6 border-t border-white/5 text-center text-nutror-muted text-xs">
        <div className="flex items-center justify-center gap-2 mb-4">
          {settings.logo_url ? (
            <img src={settings.logo_url} alt="Logo" className="h-6 w-auto object-contain" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-6 h-6 bg-nutror-accent rounded-full flex items-center justify-center font-bold text-black italic text-[10px]">ITL</div>
          )}
          <span className="text-sm font-bold text-white">{settings.app_name}</span>
          <span className="mx-2">|</span>
          <span>A ÁREA DE MEMBROS DA {settings.app_name.toUpperCase()}</span>
        </div>
        <div className="flex justify-center gap-6">
          <a href="#" className="hover:text-white">Privacidade</a>
          <a href="#" className="hover:text-white">Termos e Condições</a>
          <a href="#" className="hover:text-white">Cookies</a>
          <a href="#" className="hover:text-white">Ajuda</a>
        </div>
      </footer>
    </div>
  );
}
