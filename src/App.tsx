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

const Header = ({ onAdminClick, user, onLogout }: { onAdminClick: () => void, user: User | null, onLogout: () => void }) => (
  <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-3 flex items-center justify-between">
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-nutror-accent rounded-full flex items-center justify-center font-bold text-black italic">ITL</div>
        <span className="text-xl font-bold tracking-tight">ITL Cursos</span>
      </div>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-nutror-muted">
        <a href="#" className="text-white border-b-2 border-nutror-accent pb-1">Meus Cursos</a>
        <a href="#" className="hover:text-white transition-colors">Portais</a>
        <a href="#" className="hover:text-white transition-colors">Certificados</a>
        <a href="#" className="hover:text-white transition-colors">Aulas Salvas</a>
        <a href="#" className="hover:text-white transition-colors">Minhas Anotações</a>
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
      <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-nutror-muted hover:text-white">
        <Bell className="w-5 h-5" />
      </button>
      <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-nutror-muted hover:text-white">
        <HelpCircle className="w-5 h-5" />
      </button>
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

const CourseCard = ({ course, onClick }: { course: Course, onClick: (c: Course) => void | Promise<void>, key?: React.Key }) => (
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
    </div>
    <div className="p-4">
      <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-nutror-accent transition-colors">{course.title}</h3>
      <div className="flex items-center gap-2 text-xs text-nutror-muted">
        <span className="flex items-center gap-1"><LayoutGrid className="w-3 h-3" /> {course.module_count || 0} Módulos</span>
        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.lesson_count || 0} Aulas</span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-nutror-accent/20 flex items-center justify-center">
          <div className="w-3 h-3 bg-nutror-accent rounded-full" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-nutror-muted">EAD ITL</span>
      </div>
    </div>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'login' | 'home' | 'course' | 'lesson' | 'admin'>('login');
  const [adminTab, setAdminTab] = useState<'courses' | 'members'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

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
    const savedUser = localStorage.getItem('itl_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setView('home');
      fetchData(user);
    }
  }, []);

  const fetchData = (user: User) => {
    fetchCourses(user);
    if (user.role === 'admin') {
      fetchUsers();
    }
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

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setView('lesson');
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

  const getYoutubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {view !== 'login' && <Header onAdminClick={() => setView('admin')} user={currentUser} onLogout={handleLogout} />}

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
                  <div className="w-16 h-16 bg-nutror-accent rounded-full flex items-center justify-center font-bold text-black italic text-2xl mx-auto mb-4">ITL</div>
                  <h1 className="text-2xl font-bold">ITL Cursos</h1>
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
                              <div className="flex items-center gap-3">
                                <Play className="w-4 h-4 text-nutror-muted group-hover:text-nutror-accent" />
                                <span className="text-sm text-nutror-muted group-hover:text-white">{lesson.title}</span>
                              </div>
                              <span className="text-xs text-nutror-muted">10:00</span>
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
              className="flex h-[calc(100vh-64px)] overflow-hidden"
            >
              {/* Main Content */}
              <div className="flex-1 flex flex-col bg-black">
                <div className="p-4 flex items-center justify-between bg-nutror-bg/50 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setView('course')} className="p-2 hover:bg-white/5 rounded-full">
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div>
                      <p className="text-xs text-nutror-muted uppercase tracking-widest font-bold">{selectedCourse.title}</p>
                      <h2 className="text-lg font-bold">{selectedLesson.title}</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-full text-nutror-muted"><Bookmark className="w-5 h-5" /></button>
                    <button className="p-2 hover:bg-white/5 rounded-full text-nutror-muted"><FileText className="w-5 h-5" /></button>
                  </div>
                </div>

                <div className="flex-1 relative bg-black flex items-center justify-center">
                  <iframe 
                    src={getYoutubeEmbedUrl(selectedLesson.youtube_url)}
                    className="w-full h-full max-h-[80vh] aspect-video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {selectedLesson.description && (
                  <div className="p-6 bg-nutror-bg/30 border-t border-white/5 overflow-y-auto max-h-[200px]">
                    <h3 className="text-sm font-bold text-nutror-accent uppercase tracking-wider mb-2">Sobre esta aula</h3>
                    <p className="text-sm text-nutror-muted leading-relaxed whitespace-pre-wrap">
                      {selectedLesson.description}
                    </p>
                  </div>
                )}

                <div className="p-6 bg-nutror-bg border-t border-white/5 flex items-center justify-between">
                  <button className="flex items-center gap-2 text-sm text-nutror-muted hover:text-white">
                    <ChevronRight className="w-4 h-4 rotate-180" /> AULA ANTERIOR
                  </button>
                  <button className="bg-white text-black px-6 py-2 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-colors">
                    Marcar como Concluída
                  </button>
                  <button className="flex items-center gap-2 text-sm text-nutror-muted hover:text-white">
                    PRÓXIMA AULA <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-96 glass border-l border-white/5 flex flex-col">
                <div className="p-6 border-b border-white/5">
                  <h3 className="font-bold mb-2">{selectedCourse.title}</h3>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-nutror-accent h-full w-2/3" />
                  </div>
                  <p className="text-[10px] text-nutror-muted mt-2 font-bold uppercase">65% CONCLUÍDO: 17 DE 26 AULAS</p>
                </div>
                
                <div className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nutror-muted" />
                    <input 
                      type="text" 
                      placeholder="Procurar Aula" 
                      className="w-full bg-nutror-bg border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {selectedCourse.modules?.map((module, mIdx) => (
                    <div key={module.id}>
                      <div className="p-4 bg-white/5 flex items-center justify-between cursor-pointer border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border-2 border-nutror-accent flex items-center justify-center">
                            <div className="w-2 h-2 bg-nutror-accent rounded-full" />
                          </div>
                          <span className="text-sm font-bold">{module.title}</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-nutror-muted" />
                      </div>
                      <div>
                        {module.lessons.map((lesson) => (
                          <div 
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`p-4 pl-12 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors ${selectedLesson.id === lesson.id ? 'bg-nutror-accent/10 border-l-2 border-nutror-accent' : ''}`}
                          >
                            <div className={`w-4 h-4 rounded-full border ${selectedLesson.id === lesson.id ? 'border-nutror-accent bg-nutror-accent' : 'border-white/20'}`} />
                            <span className={`text-sm ${selectedLesson.id === lesson.id ? 'text-white font-medium' : 'text-nutror-muted'}`}>{lesson.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
              </div>

              {adminTab === 'courses' ? (
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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                if (!modalData.title || !activeCourseId) return;
                await fetch(`/api/courses/${activeCourseId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(modalData)
                });
                setModalType(null);
                if (currentUser) fetchCourses(currentUser);
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
                if (!modalData.title || !activeCourseId) return;
                await fetch('/api/modules', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ course_id: activeCourseId, title: modalData.title, order_index: 0 })
                });
                setModalType(null);
                if (currentUser) fetchCourses(currentUser);
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
                if (!modalData.title || !activeModuleId) return;
                await fetch(`/api/modules/${activeModuleId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ title: modalData.title, order_index: 0 })
                });
                setModalType(null);
                if (currentUser) fetchCourses(currentUser);
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
                if (!modalData.title || !modalData.youtube_url || !activeModuleId) return;
                await fetch('/api/lessons', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    module_id: activeModuleId, 
                    title: modalData.title, 
                    description: modalData.description,
                    youtube_url: modalData.youtube_url, 
                    order_index: 0 
                  })
                });
                setModalType(null);
                if (currentUser) fetchCourses(currentUser);
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
                if (!modalData.title || !modalData.youtube_url || !activeLessonId) return;
                await fetch(`/api/lessons/${activeLessonId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    title: modalData.title, 
                    description: modalData.description,
                    youtube_url: modalData.youtube_url, 
                    order_index: 0 
                  })
                });
                setModalType(null);
                if (currentUser) fetchCourses(currentUser);
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
          <div className="w-6 h-6 bg-nutror-accent rounded-full flex items-center justify-center font-bold text-black italic text-[10px]">ITL</div>
          <span className="text-sm font-bold text-white">ITL Cursos</span>
          <span className="mx-2">|</span>
          <span>A ÁREA DE MEMBROS DA ITL</span>
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
