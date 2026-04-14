import React, { useState, useEffect } from 'react';
import { 
  School, 
  Home, 
  Users, 
  Bell, 
  Menu, 
  X, 
  LogIn, 
  ShieldCheck, 
  Download,
  BookOpen,
  Calendar,
  Award,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Save,
  LogOut,
  FileText,
  TrendingUp,
  User,
  Image as ImageIcon,
  Settings,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  MapPin,
  Mail,
  Phone,
  Info,
  Building2,
  ArrowRight,
  Linkedin,
  Megaphone,
  Lock,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  schoolService, 
  announcementService, 
  studentService, 
  classWorkService, 
  documentService,
  teacherService,
  logService,
  jobService
} from './lib/services';
import { 
  SchoolInfo, 
  Announcement, 
  Student, 
  ClassWork, 
  SchoolDocument,
  TestResult,
  Teacher,
  FacultyMember,
  Facility,
  JobPosting,
  ActionLog
} from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// --- Components ---

const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  isAdmin, 
  user, 
  onLogin, 
  onLogout 
}: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void; 
  isAdmin: boolean;
  user: FirebaseUser | null;
  onLogin: () => void;
  onLogout: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'portal', label: 'Parents Portal', icon: Users },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'documents', label: 'Documents', icon: Download },
    { id: 'careers', label: 'Careers', icon: UserPlus },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', icon: ShieldCheck });
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
            <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <School className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-extrabold tracking-tight leading-none transition-colors duration-300 ${scrolled ? 'text-slate-900' : 'text-white'}`}>St. Xavier's</span>
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${scrolled ? 'text-primary' : 'text-blue-200'}`}>Academy of Excellence</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === item.id 
                    ? scrolled ? 'bg-primary/10 text-primary' : 'bg-white/20 text-white'
                    : scrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            
            <div className={`h-6 w-px mx-4 ${scrolled ? 'bg-slate-200' : 'bg-white/20'}`} />

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-slate-100/50 p-1 pr-4 rounded-full border border-white/20">
                  {user.photoURL ? (
                    <img src={user.photoURL} className="w-8 h-8 rounded-full shadow-sm" alt="profile" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {user.displayName?.[0] || user.email?.[0] || 'U'}
                    </div>
                  )}
                  <span className={`text-sm font-bold transition-colors duration-300 ${scrolled ? 'text-slate-700' : 'text-white'}`}>
                    {user.displayName?.split(' ')[0] || 'User'}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onLogout}
                  className={`rounded-xl font-bold transition-colors duration-300 ${scrolled ? 'text-red-500 hover:bg-red-50' : 'text-white hover:bg-white/10'}`}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                size="lg" 
                onClick={onLogin} 
                className="bg-primary hover:bg-blue-800 text-white rounded-2xl px-8 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Portal Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className={`md:hidden p-2 rounded-xl transition-colors duration-300 ${scrolled ? 'bg-slate-100 text-slate-900' : 'bg-white/10 text-white'}`} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-bottom border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
              {!user && (
                <Button variant="outline" className="w-full mt-4" onClick={onLogin}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Admin Login
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ info }: { info: SchoolInfo | null }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = info?.heroImages?.filter(img => img.trim() !== '').length 
    ? info.heroImages.filter(img => img.trim() !== '') 
    : [
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=2000"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [images.length]);

  const isVideo = (url: string) => {
    return url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm') || url.toLowerCase().endsWith('.ogg');
  };

  return (
    <div className="relative h-[100vh] w-full overflow-hidden">
      {/* Media Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/40 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-blue-950/20 z-10" />
      
      {/* Background Media */}
      {images.map((media, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: currentImage === idx ? 1 : 0,
            scale: currentImage === idx ? 1 : 1.1
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {isVideo(media) ? (
            <video
              src={media}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={media}
              alt={`School ${idx + 1}`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-3xl"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8"
          >
            <Badge className="bg-accent text-white border-none px-3 py-1">New Session 2026-27</Badge>
            <span className="text-white/90 text-sm font-bold tracking-wide">Admissions are now open!</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-8 leading-[0.9] tracking-tighter text-balance">
            {info?.heroTitle || "Empowering Minds, Shaping Futures"}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100/90 mb-12 leading-relaxed font-medium max-w-xl text-balance">
            {info?.heroSubtitle || "Join St. Xavier's School, where we nurture creativity, character, and academic excellence in every student."}
          </p>
          <div className="flex flex-wrap gap-6">
            <Button size="lg" className="bg-accent hover:bg-orange-600 text-white rounded-2xl px-12 h-16 text-lg font-extrabold shadow-2xl shadow-accent/20 transition-all hover:scale-105 active:scale-95">
              Apply Now <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 rounded-2xl px-12 h-16 text-lg font-extrabold backdrop-blur-md transition-all hover:scale-105 active:scale-95">
              Virtual Tour
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-20 max-w-[90vw] overflow-x-auto no-scrollbar px-4">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImage(idx)}
            className="group py-4 px-2"
          >
            <div className={`h-1.5 transition-all duration-500 rounded-full ${
              currentImage === idx ? 'w-16 bg-accent' : 'w-4 bg-white/30 group-hover:bg-white/50'
            }`} />
          </button>
        ))}
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 right-12 z-20 hidden md:flex flex-col items-center gap-4"
      >
        <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold [writing-mode:vertical-lr]">Scroll to explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </div>
  );
};

const CareersSection = ({ jobs }: { jobs: JobPosting[] }) => {
  return (
    <div className="py-32 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-20">
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 rounded-full mb-6 font-bold uppercase tracking-widest text-[10px]">Join Our Team</Badge>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">Career Opportunities</h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
            Become a part of our mission to empower minds and shape futures. We are always looking for passionate educators and staff members.
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center shadow-xl shadow-blue-900/5">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserPlus className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Openings Right Now</h3>
            <p className="text-slate-500">Check back later or follow us on social media for updates.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {jobs.filter(j => j.status === 'open').map(job => (
              <Card key={job.id} className="rounded-[2.5rem] border-none shadow-xl shadow-blue-900/5 bg-white overflow-hidden group hover:shadow-2xl transition-all">
                <CardContent className="p-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none px-3 py-1 font-bold">{job.department}</Badge>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" />
                          Posted on {new Date(job.postedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors">{job.title}</h3>
                      <p className="text-slate-600 font-medium leading-relaxed mb-6">{job.description}</p>
                      
                      <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Requirements</h4>
                        <ul className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                          {job.requirements.split('\n').filter(r => r.trim()).map((req, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Button size="lg" className="bg-primary hover:bg-blue-800 text-white rounded-2xl px-10 h-16 font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105 shrink-0">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
const AnnouncementsSection = ({ announcements }: { announcements: Announcement[] }) => {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4">
              <div className="w-8 h-px bg-primary" />
              Stay Informed
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Latest Announcements</h2>
            <p className="text-slate-600 text-lg">Keep up with the vibrant life at St. Xavier's. From academic milestones to cultural celebrations.</p>
          </div>
          <Button variant="outline" className="rounded-2xl border-slate-200 hover:bg-slate-50 px-8 h-12 font-bold group">
            View All News <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {announcements.slice(0, 3).map((ann, idx) => (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full group hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 border-slate-100 rounded-[2rem] overflow-hidden flex flex-col">
                <div className={`h-2 w-full ${
                  ann.priority === 'high' ? 'bg-red-500' : 
                  ann.priority === 'medium' ? 'bg-accent' : 'bg-primary'
                }`} />
                <CardHeader className="p-8 pb-4">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <Badge variant="secondary" className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      ann.priority === 'high' ? 'bg-red-50 text-red-600' : 
                      ann.priority === 'medium' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {ann.priority}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">
                    {ann.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-grow">
                  <p className="text-slate-600 leading-relaxed line-clamp-4">{ann.content}</p>
                </CardContent>
                <div className="p-8 pt-0 mt-auto">
                  <div className="h-px w-full bg-slate-100 mb-6" />
                  <button className="text-primary font-bold text-sm flex items-center gap-2 group/btn">
                    Read Full Story <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
          {announcements.length === 0 && (
            <div className="col-span-3 py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No recent announcements to display.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const FacultySection = ({ faculty }: { faculty: SchoolInfo['faculty'] }) => {
  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-100/50 rounded-full blur-3xl -ml-20 -mb-20 opacity-30" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4 justify-center">
            <div className="w-8 h-px bg-primary" />
            Our Mentors
            <div className="w-8 h-px bg-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Distinguished Faculty</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">Meet the visionary educators and subject experts who are dedicated to nurturing the next generation of leaders.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {faculty?.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -12 }}
              className="group"
            >
              <div className="relative mb-6 aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10">
                <img
                  src={member.imageUrl || `https://picsum.photos/seed/${member.name}/600/800`}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <div className="flex gap-3 justify-center">
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all">
                      <Linkedin className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{member.name}</h4>
                <p className="text-primary font-bold text-xs uppercase tracking-widest mb-2">{member.role}</p>
                <div className="inline-block px-3 py-1 bg-white rounded-full text-[10px] font-bold text-slate-400 border border-slate-100 shadow-sm">
                  {member.qualification}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FacilitiesSection = ({ facilities }: { facilities: SchoolInfo['facilities'] }) => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">World-Class Facilities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We provide a modern learning environment equipped with state-of-the-art infrastructure.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {facilities?.map((facility, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl"
            >
              <img
                src={facility.imageUrl || `https://picsum.photos/seed/${facility.title}/800/600`}
                className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
                alt={facility.title}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{facility.title}</h3>
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {facility.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ParentPortal = () => {
  const [portalCode, setPortalCode] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [classWork, setClassWork] = useState<ClassWork[]>([]);

  useEffect(() => {
    const unsub = classWorkService.subscribe(setClassWork);
    return unsub;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await studentService.getByCode(portalCode);
      if (data) {
        setStudent(data);
        toast.success(`Welcome, Parent of ${data.name}`);
      } else {
        toast.error("Invalid Portal Code. Please check and try again.");
      }
    } catch (err) {
      toast.error("Error accessing portal.");
    } finally {
      setLoading(false);
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full relative z-10"
        >
          <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-blue-900/10 overflow-hidden bg-white/80 backdrop-blur-xl">
            <div className="bg-primary p-12 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="bg-white/20 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">Parent Portal</h2>
              <p className="text-blue-100/80 mt-2 font-medium">Access your child's academic progress</p>
            </div>
            
            <div className="p-10">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Student Portal Code</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="e.g. STX-2024-001"
                      value={portalCode}
                      onChange={(e) => setPortalCode(e.target.value)}
                      className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-blue-800 text-white font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-95"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Unlocking...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Unlock Portal <ChevronRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </form>
              <p className="text-center text-xs text-slate-400 mt-8 font-medium">
                Please contact the school office if you haven't received your child's portal code.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const chartData = student.results.map(r => ({
    subject: r.subject,
    score: r.score,
    total: r.total,
    percentage: (r.score / r.total) * 100
  }));

  return (
    <div className="min-h-screen bg-slate-50 py-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-xs mb-3">
              <div className="w-8 h-px bg-primary" />
              Parent Dashboard
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Academic Overview</h1>
            <p className="text-slate-500 mt-1 font-medium">Viewing records for <span className="text-primary font-bold">{student.name}</span></p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setStudent(null)} 
            className="rounded-2xl border-slate-200 hover:bg-white hover:text-red-500 hover:border-red-100 transition-all h-12 px-6 font-bold shadow-sm"
          >
            <LogOut className="w-4 h-4 mr-2" /> Exit Portal
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left Column: Details & Attendance */}
          <div className="space-y-10">
            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-blue-900/5 overflow-hidden bg-white">
              <div className="bg-primary p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-xl" />
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-black shadow-inner">
                    {student.name[0]}
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold tracking-tight leading-tight">{student.name}</h3>
                    <p className="text-blue-100/80 font-bold text-xs uppercase tracking-widest mt-1">Class {student.class}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Roll Number</span>
                  <span className="font-bold text-slate-900">{student.rollNumber}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Parent Name</span>
                  <span className="font-bold text-slate-900">{student.parentName}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Portal Code</span>
                  <Badge className="bg-slate-100 text-slate-600 border-none font-bold rounded-lg px-3 py-1">{student.portalCode}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-blue-900/5 bg-white p-8">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-xl font-extrabold flex items-center gap-3 text-slate-900">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  Attendance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-center mb-8">
                  <div className="text-6xl font-black text-primary mb-2 tracking-tighter">{student.attendance}%</div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Term Attendance</p>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${student.attendance}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-primary h-full rounded-full shadow-lg shadow-primary/20" 
                  />
                </div>
                <p className="text-center mt-6 text-slate-500 text-sm font-medium">
                  {student.attendance >= 75 ? "Excellent attendance record!" : "Attendance needs improvement."}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column: Performance & Results */}
          <div className="lg:col-span-2 space-y-10">
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="bg-white p-2 rounded-[1.5rem] shadow-2xl shadow-blue-900/5 mb-10 h-16 inline-flex border border-slate-100">
                <TabsTrigger value="results" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Exam Results</TabsTrigger>
                <TabsTrigger value="classwork" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Class Work</TabsTrigger>
                <TabsTrigger value="performance" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Performance Chart</TabsTrigger>
              </TabsList>

              <TabsContent value="results">
                <Card className="rounded-3xl border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Academic Performance</CardTitle>
                    <CardDescription>Latest test and exam results for this session.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead>Term</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {student.results.map((res, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{res.subject}</TableCell>
                            <TableCell>{res.term}</TableCell>
                            <TableCell>{res.score} / {res.total}</TableCell>
                            <TableCell>
                              <Badge className={res.score / res.total >= 0.4 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                {res.score / res.total >= 0.4 ? 'Pass' : 'Fail'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="classwork">
                <div className="space-y-4">
                  {classWork.filter(cw => cw.className === student.class).map((work) => (
                    <Card key={work.id} className="rounded-2xl border-none shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg text-blue-600">{work.subject}</CardTitle>
                          <span className="text-xs text-gray-400">{new Date(work.date).toLocaleDateString()}</span>
                        </div>
                        <CardDescription className="font-semibold text-gray-900">{work.topic}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{work.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                  {classWork.filter(cw => cw.className === student.class).length === 0 && (
                    <div className="text-center py-12 text-gray-400 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                      No class work entries for this class yet.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="performance">
                <Card className="rounded-3xl border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Progressive Report</CardTitle>
                    <CardDescription>Visual representation of student performance across subjects.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="subject" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="percentage" fill="#2563eb" radius={[8, 8, 0, 0]} name="Score %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentsSection = ({ documents }: { documents: SchoolDocument[] }) => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Downloadable Resources</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Access important school documents, forms, and reports.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id} className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="text-blue-600 w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{doc.title}</h3>
                <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider">{doc.type}</p>
                <Button variant="outline" className="w-full rounded-xl">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full">
                    <Download className="w-4 h-4 mr-2" /> Download
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
          {documents.length === 0 && (
            <div className="col-span-4 py-12 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
              No documents available for download.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title: string; 
  message: string; 
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-6 text-red-600">
          <AlertCircle className="w-8 h-8" />
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl h-12">Cancel</Button>
          <Button variant="destructive" onClick={() => { onConfirm(); onClose(); }} className="flex-1 rounded-xl h-12">Delete</Button>
        </div>
      </motion.div>
    </div>
  );
};

const AdminDashboard = ({ 
  info, 
  announcements, 
  documents, 
  students,
  classWork,
  teachers,
  jobs,
  logs,
  currentUser
}: { 
  info: SchoolInfo | null;
  announcements: Announcement[];
  documents: SchoolDocument[];
  students: Student[];
  classWork: ClassWork[];
  teachers: Teacher[];
  jobs: JobPosting[];
  logs: ActionLog[];
  currentUser: { name: string; role: 'admin' | 'teacher'; id: string; privileges?: Teacher['privileges'] };
}) => {
  const [editingInfo, setEditingInfo] = useState<SchoolInfo | null>(info);
  const [newAnn, setNewAnn] = useState({ title: '', content: '', priority: 'medium' as const });
  const [newDoc, setNewDoc] = useState({ title: '', url: '', type: 'profarma' as const });
  const [newStudent, setNewStudent] = useState<Partial<Student>>({ name: '', portalCode: '', class: '', results: [] });
  const [newWork, setNewWork] = useState({ className: '', subject: '', topic: '', description: '' });
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({ 
    name: '', 
    email: '', 
    subject: '', 
    password: '',
    privileges: { results: true, classwork: true, students: false }
  });
  const [newJob, setNewJob] = useState<Partial<JobPosting>>({ title: '', department: '', description: '', requirements: '', status: 'open' });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string; title: string } | null>(null);

  const isAdminRole = currentUser.role === 'admin';
  const canManageInfo = isAdminRole;
  const canManageAnnouncements = isAdminRole;
  const canManageTeachers = isAdminRole;
  const canManageStudentsFull = isAdminRole || currentUser.privileges?.students;
  const canManageResults = isAdminRole || currentUser.privileges?.results;
  const canManageClassWork = isAdminRole || currentUser.privileges?.classwork;
  const canManageDocuments = isAdminRole;
  const canManageCareers = isAdminRole;
  const canSeeLogbook = true; // Both admin and teacher can see their own logs (filtered in App.tsx)
  const canSeeStudentsTab = canManageStudentsFull || canManageResults;

  useEffect(() => {
    if (info) setEditingInfo(info);
  }, [info]);

  const handleUpdateInfo = async () => {
    if (editingInfo) {
      await schoolService.updateInfo(editingInfo, currentUser);
      toast.success("School info updated successfully!");
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { type, id, title } = confirmDelete;
    try {
      if (type === 'announcement') await announcementService.delete(id, title, currentUser);
      if (type === 'document') await documentService.delete(id, title, currentUser);
      if (type === 'student') await studentService.delete(id, title, currentUser);
      if (type === 'classwork') await classWorkService.delete(id, title, currentUser);
      if (type === 'teacher') await teacherService.delete(id, title, currentUser);
      if (type === 'job') await jobService.delete(id, title, currentUser);
      toast.success("Deleted successfully!");
    } catch (err) {
      toast.error("Error deleting item.");
    }
  };

  const handleAddAnnouncement = async () => {
    await announcementService.add({ ...newAnn, date: new Date().toISOString() }, currentUser);
    setNewAnn({ title: '', content: '', priority: 'medium' });
    toast.success("Announcement added!");
  };

  const handleAddDocument = async () => {
    await documentService.add({ ...newDoc, uploadedAt: new Date().toISOString() }, currentUser);
    setNewDoc({ title: '', url: '', type: 'profarma' });
    toast.success("Document added!");
  };

  const handleAddStudent = async () => {
    if (newStudent.name && newStudent.portalCode) {
      await studentService.upsert({
        ...newStudent,
        results: newStudent.results || [],
        attendance: newStudent.attendance || 100,
        rollNumber: newStudent.rollNumber || '0',
        parentName: newStudent.parentName || '',
      } as Student, currentUser);
      setNewStudent({ name: '', portalCode: '', class: '', results: [] });
      setSelectedStudent(null);
      toast.success("Student updated!");
    }
  };

  const handleAddClassWork = async () => {
    await classWorkService.add({ ...newWork, date: new Date().toISOString() }, currentUser);
    setNewWork({ className: '', subject: '', topic: '', description: '' });
    toast.success("Class work added!");
  };

  const handleAddJob = async () => {
    if (newJob.title && newJob.department) {
      await jobService.add(newJob as Omit<JobPosting, 'id' | 'postedAt'>, currentUser);
      setNewJob({ title: '', department: '', description: '', requirements: '', status: 'open' });
      toast.success("Job posting added!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4">
            <div className="w-8 h-px bg-primary" />
            {currentUser.role === 'admin' ? 'Administrative Control' : 'Faculty Access'}
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
            Management Portal
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl">
            Welcome back, <span className="text-primary font-bold">{currentUser.name}</span>. You have access to manage school operations and student records.
          </p>
        </div>

        <Tabs defaultValue={canManageInfo ? "info" : canManageTeachers ? "teachers" : "students"} className="space-y-12">
          <TabsList className="bg-white p-2 rounded-[2rem] shadow-2xl shadow-blue-900/5 h-20 inline-flex border border-slate-100 overflow-x-auto max-w-full no-scrollbar">
            {canManageInfo && <TabsTrigger value="info" className="rounded-2xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">School Profile</TabsTrigger>}
            {canManageAnnouncements && <TabsTrigger value="announcements" className="rounded-2xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Announcements</TabsTrigger>}
            {canManageTeachers && <TabsTrigger value="teachers" className="rounded-2xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Faculty</TabsTrigger>}
            {canSeeStudentsTab && <TabsTrigger value="students" className="rounded-2xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Students</TabsTrigger>}
            {canManageClassWork && <TabsTrigger value="classwork" className="rounded-2xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Classwork</TabsTrigger>}
            {canManageDocuments && <TabsTrigger value="documents" className="rounded-2xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Documents</TabsTrigger>}
            {canManageCareers && <TabsTrigger value="careers" className="rounded-2xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Careers</TabsTrigger>}
            {canSeeLogbook && <TabsTrigger value="logbook" className="rounded-2xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Logbook</TabsTrigger>}
          </TabsList>

          {/* School Info Tab */}
          {canManageInfo && (
            <TabsContent value="info">
              <div className="space-y-10">
                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-blue-900/5 bg-white overflow-hidden">
                  <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl font-extrabold flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                          <Settings className="w-5 h-5 text-white" />
                        </div>
                        General Settings
                      </CardTitle>
                      <CardDescription className="text-slate-400 font-medium mt-1">Update the school's public profile and hero section.</CardDescription>
                    </div>
                    <Button onClick={handleUpdateInfo} className="rounded-xl bg-primary hover:bg-blue-800 font-bold px-8 h-12">
                      Save Changes
                    </Button>
                  </div>
                  <CardContent className="p-10 space-y-10">
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">School Name</label>
                        <Input 
                          value={editingInfo?.name || ''} 
                          onChange={e => setEditingInfo(prev => prev ? {...prev, name: e.target.value} : null)}
                          className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Logo URL</label>
                        <Input 
                          value={editingInfo?.logoUrl || ''} 
                          onChange={e => setEditingInfo(prev => prev ? {...prev, logoUrl: e.target.value} : null)}
                          className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Hero Title</label>
                        <Input 
                          value={editingInfo?.heroTitle || ''} 
                          onChange={e => setEditingInfo(prev => prev ? {...prev, heroTitle: e.target.value} : null)}
                          className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Hero Subtitle</label>
                        <Input 
                          value={editingInfo?.heroSubtitle || ''} 
                          onChange={e => setEditingInfo(prev => prev ? {...prev, heroSubtitle: e.target.value} : null)}
                          className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Hero Images/Videos (One URL per line, up to 20)</label>
                        <textarea 
                          className="w-full min-h-[150px] p-5 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium text-sm leading-relaxed"
                          value={editingInfo?.heroImages?.join('\n') || ''}
                          onChange={e => setEditingInfo(prev => prev ? {...prev, heroImages: e.target.value.split('\n').filter(s => s.trim())} : null)}
                          placeholder="https://example.com/image.jpg&#10;https://example.com/video.mp4"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-blue-900/5 bg-white overflow-hidden">
                  <div className="bg-slate-900 p-8 text-white">
                    <CardTitle className="text-2xl font-extrabold flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      Faculty Management
                    </CardTitle>
                    <CardDescription className="text-slate-400 font-medium mt-1">Manage the school's teaching staff and their public profiles.</CardDescription>
                  </div>
                  <CardContent className="p-10 space-y-8">
                    <div className="space-y-6">
                      {editingInfo?.faculty?.map((f, idx) => (
                        <div key={f.id} className="grid md:grid-cols-3 gap-6 p-8 bg-slate-50 rounded-[2rem] relative group border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-900/5">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                            <Input placeholder="Name" value={f.name} onChange={e => {
                              const faculty = [...(editingInfo.faculty || [])];
                              faculty[idx].name = e.target.value;
                              setEditingInfo({...editingInfo, faculty});
                            }} className="h-12 rounded-xl border-slate-200 bg-white" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Role / Position</label>
                            <Input placeholder="Role" value={f.role} onChange={e => {
                              const faculty = [...(editingInfo.faculty || [])];
                              faculty[idx].role = e.target.value;
                              setEditingInfo({...editingInfo, faculty});
                            }} className="h-12 rounded-xl border-slate-200 bg-white" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Qualification</label>
                            <Input placeholder="e.g. M.A., B.Ed." value={f.qualification || ''} onChange={e => {
                              const faculty = [...(editingInfo.faculty || [])];
                              faculty[idx].qualification = e.target.value;
                              setEditingInfo({...editingInfo, faculty});
                            }} className="h-12 rounded-xl border-slate-200 bg-white" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Profile Image URL</label>
                            <Input placeholder="Image URL" value={f.imageUrl} onChange={e => {
                              const faculty = [...(editingInfo.faculty || [])];
                              faculty[idx].imageUrl = e.target.value;
                              setEditingInfo({...editingInfo, faculty});
                            }} className="h-12 rounded-xl border-slate-200 bg-white" />
                          </div>
                          <button 
                            onClick={() => {
                              const faculty = editingInfo.faculty?.filter((_, i) => i !== idx);
                              setEditingInfo({...editingInfo, faculty});
                            }}
                            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full h-14 rounded-2xl border-dashed border-2 border-slate-200 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all font-bold text-slate-500"
                      onClick={() => {
                        setEditingInfo(prev => prev ? {
                          ...prev, 
                          faculty: [...(prev.faculty || []), { id: Math.random().toString(36).substr(2, 9), name: '', role: '', imageUrl: '', qualification: '' }]
                        } : null);
                      }}
                    >
                      <Plus className="w-5 h-5 mr-2" /> Add Faculty Member
                    </Button>
                  </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-blue-900/5 bg-white overflow-hidden">
                  <div className="bg-slate-900 p-8 text-white">
                    <CardTitle className="text-2xl font-extrabold flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      Facilities Management
                    </CardTitle>
                    <CardDescription className="text-slate-400 font-medium mt-1">Showcase the school's infrastructure and amenities.</CardDescription>
                  </div>
                  <CardContent className="p-10 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      {editingInfo?.facilities?.map((f, idx) => (
                        <div key={f.id} className="p-8 bg-slate-50 rounded-[2rem] relative group border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-900/5">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Facility Title</label>
                              <Input placeholder="Title" value={f.title} onChange={e => {
                                const facilities = [...(editingInfo.facilities || [])];
                                facilities[idx].title = e.target.value;
                                setEditingInfo({...editingInfo, facilities});
                              }} className="h-12 rounded-xl border-slate-200 bg-white font-bold" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Image URL</label>
                              <Input placeholder="Image URL" value={f.imageUrl} onChange={e => {
                                const facilities = [...(editingInfo.facilities || [])];
                                facilities[idx].imageUrl = e.target.value;
                                setEditingInfo({...editingInfo, facilities});
                              }} className="h-12 rounded-xl border-slate-200 bg-white" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Description</label>
                              <textarea 
                                className="w-full min-h-[100px] p-4 rounded-xl border border-slate-200 bg-white text-sm font-medium"
                                placeholder="Description"
                                value={f.description}
                                onChange={e => {
                                  const facilities = [...(editingInfo.facilities || [])];
                                  facilities[idx].description = e.target.value;
                                  setEditingInfo({...editingInfo, facilities});
                                }}
                              />
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              const facilities = editingInfo.facilities?.filter((_, i) => i !== idx);
                              setEditingInfo({...editingInfo, facilities});
                            }}
                            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full h-14 rounded-2xl border-dashed border-2 border-slate-200 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all font-bold text-slate-500"
                      onClick={() => {
                        setEditingInfo(prev => prev ? {
                          ...prev, 
                          facilities: [...(prev.facilities || []), { id: Math.random().toString(36).substr(2, 9), title: '', description: '', imageUrl: '' }]
                        } : null);
                      }}
                    >
                      <Plus className="w-5 h-5 mr-2" /> Add Facility
                    </Button>
                  </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-blue-900/5 bg-white overflow-hidden">
                  <div className="bg-slate-900 p-8 text-white">
                    <CardTitle className="text-2xl font-extrabold flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      Footer Information
                    </CardTitle>
                    <CardDescription className="text-slate-400 font-medium mt-1">Update contact details and footer content.</CardDescription>
                  </div>
                  <CardContent className="p-10 space-y-8">
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Address</label>
                        <Input 
                          value={editingInfo?.footer?.address || ''} 
                          onChange={e => setEditingInfo(prev => prev ? {...prev, footer: {...prev.footer, address: e.target.value}} : null)}
                          className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email</label>
                        <Input 
                          value={editingInfo?.footer?.email || ''} 
                          onChange={e => setEditingInfo(prev => prev ? {...prev, footer: {...prev.footer, email: e.target.value}} : null)}
                          className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Phone</label>
                        <Input 
                          value={editingInfo?.footer?.phone || ''} 
                          onChange={e => setEditingInfo(prev => prev ? {...prev, footer: {...prev.footer, phone: e.target.value}} : null)}
                          className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">About Text</label>
                        <Input 
                          value={editingInfo?.footer?.about || ''} 
                          onChange={e => setEditingInfo(prev => prev ? {...prev, footer: {...prev.footer, about: e.target.value}} : null)}
                          className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center pt-8">
                  <Button onClick={handleUpdateInfo} className="bg-primary hover:bg-blue-800 text-white rounded-[2rem] px-12 h-20 shadow-2xl shadow-primary/20 font-black text-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4">
                    <Save className="w-6 h-6" /> Save All Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
          )}

          {/* Careers Tab */}
          {canManageCareers && (
            <TabsContent value="careers">
              <div className="grid lg:grid-cols-3 gap-10">
                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-blue-900/5 bg-white overflow-hidden h-fit sticky top-32">
                  <div className="bg-slate-900 p-8 text-white">
                    <CardTitle className="text-2xl font-extrabold flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-white" />
                      </div>
                      Post Job
                    </CardTitle>
                    <CardDescription className="text-slate-400 font-medium mt-1">Add new career opportunities.</CardDescription>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Job Title</label>
                      <Input 
                        placeholder="e.g. Senior Math Teacher" 
                        value={newJob.title} 
                        onChange={e => setNewJob({...newJob, title: e.target.value})}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Department</label>
                      <Input 
                        placeholder="e.g. Science Department" 
                        value={newJob.department} 
                        onChange={e => setNewJob({...newJob, department: e.target.value})}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Description</label>
                      <textarea 
                        className="w-full min-h-[100px] p-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white transition-all text-sm font-medium" 
                        placeholder="Job description..."
                        value={newJob.description}
                        onChange={e => setNewJob({...newJob, description: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Requirements</label>
                      <textarea 
                        className="w-full min-h-[100px] p-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white transition-all text-sm font-medium" 
                        placeholder="Requirements (one per line)..."
                        value={newJob.requirements}
                        onChange={e => setNewJob({...newJob, requirements: e.target.value})}
                      />
                    </div>
                    <Button onClick={handleAddJob} className="w-full h-14 bg-primary hover:bg-blue-800 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all">
                      Post Job
                    </Button>
                  </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight px-2">Active Job Postings</h3>
                  {jobs.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-100">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">No job postings</h4>
                      <p className="text-slate-500">Post a job to start receiving applications.</p>
                    </div>
                  ) : (
                    jobs.map(job => (
                      <Card key={job.id} className="rounded-[2rem] border-none shadow-xl shadow-blue-900/5 bg-white overflow-hidden group">
                        <CardContent className="p-8 flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none">{job.department}</Badge>
                              <span className="text-xs font-bold text-slate-400">{new Date(job.postedAt).toLocaleDateString()}</span>
                            </div>
                            <h4 className="text-xl font-black text-slate-900 mb-2">{job.title}</h4>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{job.description}</p>
                            <div className="flex gap-2">
                              <Badge className={job.status === 'open' ? 'bg-emerald-500' : 'bg-slate-400'}>{job.status}</Badge>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setConfirmDelete({ type: 'job', id: job.id, title: job.title })} 
                            className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          )}

          {/* Logbook Tab */}
          {canSeeLogbook && (
            <TabsContent value="logbook">
              <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-blue-900/5 bg-white overflow-hidden">
                <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-extrabold flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      System Logbook
                    </CardTitle>
                    <CardDescription className="text-slate-400 font-medium mt-1">
                      {isAdminRole ? 'Complete audit trail of all administrative and faculty actions.' : 'Your personal activity log.'}
                    </CardDescription>
                  </div>
                  {isAdminRole && (
                    <Button 
                      onClick={() => {
                        const headers = ['Timestamp', 'User', 'Role', 'Action', 'Target', 'Details'];
                        const csvContent = [
                          headers.join(','),
                          ...logs.map(log => [
                            log.timestamp,
                            `"${log.userName}"`,
                            log.userRole,
                            log.action,
                            `"${log.target}"`,
                            `"${log.details?.replace(/"/g, '""') || ''}"`
                          ].join(','))
                        ].join('\n');
                        
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const link = document.createElement('a');
                        const url = URL.createObjectURL(blob);
                        link.setAttribute('href', url);
                        link.setAttribute('download', `school_logs_${new Date().toISOString().split('T')[0]}.csv`);
                        link.style.visibility = 'hidden';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold px-6 h-12 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Export CSV
                    </Button>
                  )}
                </div>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50/50 border-none">
                          <TableHead className="font-bold text-slate-900 py-6 pl-8">Timestamp</TableHead>
                          <TableHead className="font-bold text-slate-900">User</TableHead>
                          <TableHead className="font-bold text-slate-900">Action</TableHead>
                          <TableHead className="font-bold text-slate-900">Target</TableHead>
                          <TableHead className="font-bold text-slate-900 pr-8">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {logs.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-20 text-slate-400 font-medium">No activity logs found.</TableCell>
                          </TableRow>
                        ) : (
                          logs.map(log => (
                            <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                              <TableCell className="py-4 pl-8">
                                <div className="text-sm font-bold text-slate-900">{new Date(log.timestamp).toLocaleDateString()}</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase">{new Date(log.timestamp).toLocaleTimeString()}</div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
                                    log.userRole === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                  }`}>
                                    {log.userName[0]}
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-slate-900">{log.userName}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{log.userRole}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={`rounded-lg font-black text-[10px] uppercase tracking-widest border-none ${
                                  log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-600' :
                                  log.action === 'UPDATE' ? 'bg-blue-100 text-blue-600' :
                                  log.action === 'DELETE' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {log.action}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm font-bold text-slate-700">{log.target}</TableCell>
                              <TableCell className="text-xs text-slate-500 font-medium pr-8 max-w-xs truncate">{log.details}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
          {canManageAnnouncements && (
            <TabsContent value="announcements">
              <div className="grid lg:grid-cols-3 gap-10">
                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-blue-900/5 bg-white overflow-hidden h-fit sticky top-32">
                  <div className="bg-slate-900 p-8 text-white">
                    <CardTitle className="text-2xl font-extrabold flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <Plus className="w-5 h-5 text-white" />
                      </div>
                      New Post
                    </CardTitle>
                    <CardDescription className="text-slate-400 font-medium mt-1">Broadcast news to the entire school portal.</CardDescription>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Title</label>
                      <Input 
                        placeholder="Announcement Title" 
                        value={newAnn.title} 
                        onChange={e => setNewAnn({...newAnn, title: e.target.value})}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Content</label>
                      <textarea 
                        className="w-full min-h-[150px] p-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white transition-all text-sm font-medium leading-relaxed" 
                        placeholder="Write your announcement here..."
                        value={newAnn.content}
                        onChange={e => setNewAnn({...newAnn, content: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Priority Level</label>
                      <select 
                        className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white transition-all text-sm font-bold appearance-none cursor-pointer"
                        value={newAnn.priority}
                        onChange={e => setNewAnn({...newAnn, priority: e.target.value as any})}
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                    <Button onClick={handleAddAnnouncement} className="w-full h-14 bg-primary hover:bg-blue-800 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                      Post Announcement
                    </Button>
                  </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Announcements</h3>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{announcements.length} Posts</div>
                  </div>
                  {announcements.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-100">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Megaphone className="w-10 h-10 text-slate-300" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">No announcements yet</h4>
                      <p className="text-slate-500">Create your first post to keep everyone informed.</p>
                    </div>
                  ) : (
                    announcements.map(ann => (
                      <Card key={ann.id} className="rounded-[2rem] border-none shadow-xl shadow-blue-900/5 bg-white overflow-hidden group hover:shadow-2xl transition-all border border-slate-50">
                        <CardContent className="p-8 flex justify-between items-start gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                ann.priority === 'high' ? 'bg-red-100 text-red-600' : 
                                ann.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 
                                'bg-emerald-100 text-emerald-600'
                              }`}>
                                {ann.priority} Priority
                              </div>
                              <span className="text-xs font-bold text-slate-400">
                                {new Date(ann.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <h4 className="text-xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors">{ann.title}</h4>
                            <p className="text-slate-500 font-medium leading-relaxed line-clamp-3">{ann.content}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setConfirmDelete({ type: 'announcement', id: ann.id, title: ann.title })} 
                            className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          )}

          {/* Students Tab */}
          {canSeeStudentsTab && (
            <TabsContent value="students">
              <div className="grid lg:grid-cols-3 gap-10">
                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-blue-900/5 bg-white overflow-hidden h-fit sticky top-32">
                  <div className="bg-slate-900 p-8 text-white">
                    <CardTitle className="text-2xl font-extrabold flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        {selectedStudent ? <Edit className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
                      </div>
                      {selectedStudent ? 'Edit Student' : 'Add Student'}
                    </CardTitle>
                    <CardDescription className="text-slate-400 font-medium mt-1">
                      {selectedStudent ? 'Modify existing student record.' : 'Register a new student to the portal.'}
                    </CardDescription>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Student Name</label>
                      <Input 
                        placeholder="Full Name" 
                        value={newStudent.name || ''} 
                        onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                        disabled={!!selectedStudent && !canManageStudentsFull}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Portal Code (Unique)</label>
                      <Input 
                        placeholder="Unique Code" 
                        value={newStudent.portalCode || ''} 
                        onChange={e => setNewStudent({...newStudent, portalCode: e.target.value})}
                        disabled={!!selectedStudent}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Class</label>
                        <Input 
                          placeholder="e.g. 10-A" 
                          value={newStudent.class || ''} 
                          onChange={e => setNewStudent({...newStudent, class: e.target.value})}
                          disabled={!!selectedStudent && !canManageStudentsFull}
                          className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Roll No.</label>
                        <Input 
                          placeholder="Roll No." 
                          value={newStudent.rollNumber || ''} 
                          onChange={e => setNewStudent({...newStudent, rollNumber: e.target.value})}
                          disabled={!!selectedStudent && !canManageStudentsFull}
                          className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Parent Name</label>
                      <Input 
                        placeholder="Parent/Guardian Name" 
                        value={newStudent.parentName || ''} 
                        onChange={e => setNewStudent({...newStudent, parentName: e.target.value})}
                        disabled={!!selectedStudent && !canManageStudentsFull}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Image URL</label>
                      <Input 
                        placeholder="Profile Photo URL" 
                        value={newStudent.imageUrl || ''} 
                        onChange={e => setNewStudent({...newStudent, imageUrl: e.target.value})}
                        disabled={!!selectedStudent && !canManageStudentsFull}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Attendance %</label>
                      <Input 
                        type="number"
                        value={isNaN(newStudent.attendance as number) ? 0 : newStudent.attendance} 
                        onChange={e => {
                          const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                          setNewStudent({...newStudent, attendance: isNaN(val) ? 0 : val});
                        }}
                        disabled={!!selectedStudent && !canManageStudentsFull}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                      />
                    </div>
                    
                    {canManageResults && (
                      <div className="pt-6 border-t border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Exam Results</h4>
                          <Badge variant="outline" className="text-[10px] font-bold">{newStudent.results?.length || 0} Records</Badge>
                        </div>
                        <div className="space-y-3">
                          {newStudent.results?.map((res, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-2xl relative group border border-slate-100">
                              <div className="grid grid-cols-2 gap-3">
                                <Input placeholder="Subject" value={res.subject} onChange={e => {
                                  const results = [...(newStudent.results || [])];
                                  results[idx].subject = e.target.value;
                                  setNewStudent({...newStudent, results});
                                }} className="h-10 rounded-lg border-slate-200 bg-white text-xs font-bold" />
                                <Input placeholder="Term" value={res.term} onChange={e => {
                                  const results = [...(newStudent.results || [])];
                                  results[idx].term = e.target.value;
                                  setNewStudent({...newStudent, results});
                                }} className="h-10 rounded-lg border-slate-200 bg-white text-xs font-bold" />
                                <div className="flex items-center gap-2">
                                  <Input type="number" placeholder="Score" value={isNaN(res.score) ? '' : res.score} onChange={e => {
                                    const results = [...(newStudent.results || [])];
                                    const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                                    results[idx].score = isNaN(val) ? 0 : val;
                                    setNewStudent({...newStudent, results});
                                  }} className="h-10 rounded-lg border-slate-200 bg-white text-xs font-bold" />
                                  <span className="text-slate-300 font-bold">/</span>
                                  <Input type="number" placeholder="Total" value={isNaN(res.total) ? '' : res.total} onChange={e => {
                                    const results = [...(newStudent.results || [])];
                                    const val = e.target.value === '' ? 100 : parseInt(e.target.value);
                                    results[idx].total = isNaN(val) ? 100 : val;
                                    setNewStudent({...newStudent, results});
                                  }} className="h-10 rounded-lg border-slate-200 bg-white text-xs font-bold" />
                                </div>
                              </div>
                              <button 
                                onClick={() => {
                                  const results = newStudent.results?.filter((_, i) => i !== idx);
                                  setNewStudent({...newStudent, results});
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="w-full h-10 rounded-xl border-dashed border-2 border-slate-200 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all font-bold text-slate-500" onClick={() => {
                          setNewStudent({...newStudent, results: [...(newStudent.results || []), { subject: '', score: 0, total: 100, term: 'Final' }]});
                        }}>
                          <Plus className="w-4 h-4 mr-2" /> Add Result
                        </Button>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      {selectedStudent && (
                        <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-slate-200" onClick={() => {
                          setSelectedStudent(null);
                          setNewStudent({ name: '', portalCode: '', class: '', results: [] });
                        }}>Cancel</Button>
                      )}
                      <Button onClick={handleAddStudent} className="flex-1 h-12 bg-primary hover:bg-blue-800 rounded-xl font-black shadow-lg shadow-primary/20 transition-all">
                        {selectedStudent ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                        {selectedStudent ? 'Update' : 'Register'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                  <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-blue-900/5 bg-white overflow-hidden border border-slate-50">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Student Directory</h3>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{students.length} Students Enrolled</div>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-slate-50">
                            <TableHead className="px-8 py-6 font-black text-slate-400 uppercase tracking-widest text-[10px]">Student Details</TableHead>
                            <TableHead className="py-6 font-black text-slate-400 uppercase tracking-widest text-[10px]">Class</TableHead>
                            <TableHead className="py-6 font-black text-slate-400 uppercase tracking-widest text-[10px]">Portal Access</TableHead>
                            <TableHead className="py-6 font-black text-slate-400 uppercase tracking-widest text-[10px]">Last Update</TableHead>
                            <TableHead className="px-8 py-6 text-right font-black text-slate-400 uppercase tracking-widest text-[10px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map(s => (
                            <TableRow key={s.id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                              <TableCell className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary overflow-hidden border-2 border-white shadow-sm">
                                    {s.imageUrl ? <img src={s.imageUrl} className="w-full h-full object-cover" /> : s.name[0]}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900">{s.name}</div>
                                    <div className="text-xs font-bold text-slate-400">Roll No: {s.rollNumber}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-6">
                                <div className="inline-flex px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-wider">
                                  {s.class}
                                </div>
                              </TableCell>
                              <TableCell className="py-6">
                                <Badge variant="outline" className="rounded-lg border-slate-200 font-mono font-bold text-primary bg-white shadow-sm">
                                  {s.portalCode}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-6">
                                <div className="space-y-1">
                                  <div className="text-xs font-bold text-slate-600">{s.lastEditedBy || 'System'}</div>
                                  {s.lastEditedAt && <div className="text-[10px] font-bold text-slate-400">{new Date(s.lastEditedAt).toLocaleDateString()}</div>}
                                </div>
                              </TableCell>
                              <TableCell className="px-8 py-6 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                  <Button variant="ghost" size="icon" onClick={() => {
                                    setSelectedStudent(s);
                                    setNewStudent(s);
                                  }} className="w-9 h-9 rounded-xl text-slate-400 hover:text-primary hover:bg-blue-50">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => setConfirmDelete({ type: 'student', id: s.portalCode, title: s.name })} className="w-9 h-9 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          )}

          {/* Teachers Tab */}
          {canManageTeachers && (
            <TabsContent value="teachers">
              <div className="grid lg:grid-cols-3 gap-10">
                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-blue-900/5 bg-white overflow-hidden h-fit sticky top-32">
                  <div className="bg-slate-900 p-8 text-white">
                    <CardTitle className="text-2xl font-extrabold flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-white" />
                      </div>
                      Add Teacher
                    </CardTitle>
                    <CardDescription className="text-slate-400 font-medium mt-1">Register a new faculty member with specific access privileges.</CardDescription>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                      <Input 
                        placeholder="Teacher Name" 
                        value={newTeacher.name} 
                        onChange={e => setNewTeacher({...newTeacher, name: e.target.value})}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                      <Input 
                        placeholder="Email Address" 
                        value={newTeacher.email} 
                        onChange={e => setNewTeacher({...newTeacher, email: e.target.value})}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Portal Password</label>
                      <Input 
                        placeholder="Password" 
                        type="password"
                        value={newTeacher.password} 
                        onChange={e => setNewTeacher({...newTeacher, password: e.target.value})}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Subject Expertise</label>
                      <Input 
                        placeholder="Subject" 
                        value={newTeacher.subject} 
                        onChange={e => setNewTeacher({...newTeacher, subject: e.target.value})}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                      />
                    </div>
                    
                    <div className="space-y-4 pt-6 border-t border-slate-100">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Access Privileges</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white hover:border-primary transition-all group">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded-lg border-slate-300 text-primary focus:ring-primary"
                            checked={newTeacher.privileges?.results} 
                            onChange={e => setNewTeacher({
                              ...newTeacher, 
                              privileges: { ...newTeacher.privileges!, results: e.target.checked }
                            })}
                          />
                          <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Manage Exam Results</span>
                        </label>
                        <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white hover:border-primary transition-all group">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded-lg border-slate-300 text-primary focus:ring-primary"
                            checked={newTeacher.privileges?.classwork} 
                            onChange={e => setNewTeacher({
                              ...newTeacher, 
                              privileges: { ...newTeacher.privileges!, classwork: e.target.checked }
                            })}
                          />
                          <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Manage Class Work</span>
                        </label>
                        <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white hover:border-primary transition-all group">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded-lg border-slate-300 text-primary focus:ring-primary"
                            checked={newTeacher.privileges?.students} 
                            onChange={e => setNewTeacher({
                              ...newTeacher, 
                              privileges: { ...newTeacher.privileges!, students: e.target.checked }
                            })}
                          />
                          <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Manage Student Profiles</span>
                        </label>
                      </div>
                    </div>

                    <Button onClick={async () => {
                      if (!newTeacher.name || !newTeacher.email || !newTeacher.password) {
                        toast.error("Please fill all fields");
                        return;
                      }
                      try {
                        await teacherService.add(newTeacher as Teacher, currentUser);
                        setNewTeacher({ 
                          name: '', 
                          email: '', 
                          subject: '', 
                          password: '',
                          privileges: { results: true, classwork: true, students: false }
                        });
                        toast.success("Teacher added successfully!");
                      } catch (err) {
                        toast.error("Failed to add teacher. Please check your connection.");
                        console.error(err);
                      }
                    }} className="w-full h-14 bg-primary hover:bg-blue-800 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                      <Plus className="w-5 h-5 mr-2" /> Add Teacher
                    </Button>
                  </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Faculty Directory</h3>
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 rounded-xl text-xs font-bold border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all"
                        onClick={async () => {
                          const loadingToast = toast.loading("Syncing all faculty accounts...");
                          let successCount = 0;
                          let failCount = 0;
                          for (const t of teachers) {
                            try {
                              await teacherService.syncAuth(t.email, t.password);
                              successCount++;
                            } catch (err) {
                              failCount++;
                            }
                          }
                          toast.dismiss(loadingToast);
                          toast.success(`Sync complete: ${successCount} accounts ready. ${failCount} already synced or failed.`);
                        }}
                      >
                        <RefreshCw className="w-3 h-3 mr-2" /> Sync All Accounts
                      </Button>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{teachers.length} Accounts</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {teachers.map(t => (
                      <Card key={t.id} className="rounded-[2.5rem] border-none shadow-xl shadow-blue-900/5 bg-white overflow-hidden group hover:shadow-2xl transition-all border border-slate-50">
                        <CardContent className="p-8">
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border-2 border-white shadow-sm">
                                <User className="w-7 h-7" />
                              </div>
                              <div>
                                <h4 className="text-xl font-black text-slate-900 tracking-tight">{t.name}</h4>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.subject} Specialist</p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setConfirmDelete({ type: 'teacher', id: t.id, title: t.name })} 
                              className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <div className="flex justify-between items-center mb-1">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact & Access</div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2 text-[10px] font-black text-primary hover:bg-primary/10 rounded-lg"
                                  onClick={async () => {
                                    try {
                                      const res = await teacherService.syncAuth(t.email, t.password);
                                      toast.success(res.message);
                                    } catch (err: any) {
                                      toast.error("Sync failed: " + err.message);
                                    }
                                  }}
                                >
                                  <RefreshCw className="w-3 h-3 mr-1" /> Sync Auth
                                </Button>
                              </div>
                              <div className="text-sm font-bold text-slate-700 mb-1">{t.email}</div>
                              <div className="inline-flex px-2 py-0.5 rounded bg-blue-100 text-primary font-mono text-[10px] font-black">PASS: {t.password}</div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              {t.privileges?.results && <Badge className="rounded-lg bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[10px] uppercase tracking-wider">Results</Badge>}
                              {t.privileges?.classwork && <Badge className="rounded-lg bg-blue-50 text-primary border-blue-100 font-black text-[10px] uppercase tracking-wider">Classwork</Badge>}
                              {t.privileges?.students && <Badge className="rounded-lg bg-purple-50 text-purple-600 border-purple-100 font-black text-[10px] uppercase tracking-wider">Students</Badge>}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          )}

          {/* Class Work Tab */}
          {canManageClassWork && (
            <TabsContent value="classwork">
              <div className="grid lg:grid-cols-3 gap-10">
                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-blue-900/5 bg-white overflow-hidden h-fit sticky top-32">
                  <div className="bg-slate-900 p-8 text-white">
                    <CardTitle className="text-2xl font-extrabold flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      Post Work
                    </CardTitle>
                    <CardDescription className="text-slate-400 font-medium mt-1">Assign new tasks or study materials to specific classes.</CardDescription>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Class</label>
                        <Input 
                          placeholder="e.g. 10-A" 
                          value={newWork.className} 
                          onChange={e => setNewWork({...newWork, className: e.target.value})}
                          className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                        <Input 
                          placeholder="Subject" 
                          value={newWork.subject} 
                          onChange={e => setNewWork({...newWork, subject: e.target.value})}
                          className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Topic / Title</label>
                      <Input 
                        placeholder="What are they learning?" 
                        value={newWork.topic} 
                        onChange={e => setNewWork({...newWork, topic: e.target.value})}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Instructions</label>
                      <textarea 
                        className="w-full min-h-[150px] p-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white transition-all text-sm font-medium leading-relaxed" 
                        placeholder="Detailed instructions for the students..."
                        value={newWork.description}
                        onChange={e => setNewWork({...newWork, description: e.target.value})}
                      />
                    </div>
                    <Button onClick={handleAddClassWork} className="w-full h-14 bg-primary hover:bg-blue-800 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                      <Plus className="w-5 h-5 mr-2" /> Post Work
                    </Button>
                  </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Assigned Work</h3>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{classWork.length} Assignments</div>
                  </div>
                  {classWork.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-100">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-10 h-10 text-slate-300" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">No work assigned</h4>
                      <p className="text-slate-500">Start by posting the first assignment for your students.</p>
                    </div>
                  ) : (
                    classWork.map(cw => (
                      <Card key={cw.id} className="rounded-[2rem] border-none shadow-xl shadow-blue-900/5 bg-white overflow-hidden group hover:shadow-2xl transition-all border border-slate-50">
                        <CardContent className="p-8 flex justify-between items-start gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="px-3 py-1 rounded-full bg-blue-50 text-primary text-[10px] font-black uppercase tracking-widest">
                                {cw.className}
                              </div>
                              <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                                {cw.subject}
                              </div>
                            </div>
                            <h4 className="text-xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors">{cw.topic}</h4>
                            <p className="text-slate-500 font-medium leading-relaxed line-clamp-2 mb-4">{cw.description}</p>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <User className="w-3 h-3" />
                              Posted by {cw.lastEditedBy || 'System'}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setConfirmDelete({ type: 'classwork', id: cw.id, title: cw.subject })} 
                            className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          )}

          {/* Documents Tab */}
          {canManageDocuments && (
            <TabsContent value="documents">
              <div className="grid lg:grid-cols-3 gap-10">
                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-blue-900/5 bg-white overflow-hidden h-fit sticky top-32">
                  <div className="bg-slate-900 p-8 text-white">
                    <CardTitle className="text-2xl font-extrabold flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      Upload
                    </CardTitle>
                    <CardDescription className="text-slate-400 font-medium mt-1">Add downloadable forms, reports, or certificates.</CardDescription>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Document Title</label>
                      <Input 
                        placeholder="e.g. Annual Report 2024" 
                        value={newDoc.title} 
                        onChange={e => setNewDoc({...newDoc, title: e.target.value})}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">File URL</label>
                      <Input 
                        placeholder="https://..." 
                        value={newDoc.url} 
                        onChange={e => setNewDoc({...newDoc, url: e.target.value})}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Category</label>
                      <select 
                        className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white transition-all text-sm font-bold appearance-none cursor-pointer"
                        value={newDoc.type}
                        onChange={e => setNewDoc({...newDoc, type: e.target.value as any})}
                      >
                        <option value="profarma">Profarma</option>
                        <option value="form">Form</option>
                        <option value="result">Result</option>
                        <option value="report">Report</option>
                      </select>
                    </div>
                    <Button onClick={handleAddDocument} className="w-full h-14 bg-primary hover:bg-blue-800 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                      <Plus className="w-5 h-5 mr-2" /> Add Document
                    </Button>
                  </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Document Library</h3>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{documents.length} Files</div>
                  </div>
                  {documents.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-100">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-slate-300" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">No documents uploaded</h4>
                      <p className="text-slate-500">Upload your first document to make it available for download.</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {documents.map(doc => (
                        <Card key={doc.id} className="rounded-[2rem] border-none shadow-xl shadow-blue-900/5 bg-white overflow-hidden group hover:shadow-2xl transition-all border border-slate-50">
                          <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary border border-blue-100 group-hover:bg-primary group-hover:text-white transition-all">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-black text-slate-900 truncate group-hover:text-primary transition-colors">{doc.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="rounded-md bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-wider border-none">
                                  {doc.type}
                                </Badge>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setConfirmDelete({ type: 'document', id: doc.id, title: doc.title })} 
                              className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
        <ConfirmDialog 
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
          title="Confirm Deletion"
          message={`Are you sure you want to delete "${confirmDelete?.title}"? This action cannot be undone.`}
        />
      </div>
    </div>
  );
};

const Footer = ({ info }: { info: SchoolInfo | null }) => {
  const footer = info?.footer;
  return (
    <footer className="bg-slate-950 text-white py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-4 mb-10 group cursor-pointer">
              <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <School className="text-white w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter uppercase leading-none">{info?.name || "St. Xavier's"}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-1">Academy of Excellence</span>
              </div>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed text-lg mb-10">
              {footer?.about || "Dedicated to providing a holistic education that empowers students to become lifelong learners and responsible global citizens."}
            </p>
            <div className="flex gap-4">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <button key={social} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
                  <div className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-xl mb-10 text-white">Quick Links</h4>
            <ul className="space-y-5 text-slate-400">
              {['About Us', 'Admissions', 'Academic Calendar', 'Contact Us', 'Careers'].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-primary transition-all flex items-center gap-3 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xl mb-10 text-white">Contact Info</h4>
            <ul className="space-y-8 text-slate-400">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm leading-relaxed">{footer?.address || "123 Education Lane, Knowledge City"}</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm">{footer?.email || "info@stxaviers.edu"}</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm">{footer?.phone || "+1 (555) 123-4567"}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} {info?.name || "St. Xavier's School"}. All rights reserved.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const LoginView = ({ onTeacherLogin, onAdminLogin }: { onTeacherLogin: (t: Teacher) => void, onAdminLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const teacher = await teacherService.login(email, password);
      if (teacher) {
        onTeacherLogin(teacher);
        toast.success("Welcome back, " + teacher.name);
      } else {
        toast.error("Teacher profile found but login failed. Please contact admin.");
      }
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        toast.error("Invalid email or password. Please check your credentials.");
      } else if (error.code === 'auth/user-disabled') {
        toast.error("This account has been disabled.");
      } else {
        toast.error("Login failed. " + (error.message || "Please check your connection."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-blue-900/10 overflow-hidden bg-white/80 backdrop-blur-xl">
          <div className="bg-primary p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="bg-white/20 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
              <School className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">School Portal</h2>
            <p className="text-blue-100/80 mt-2 font-medium">Secure access for faculty and staff</p>
          </div>
          
          <CardContent className="p-10">
            <Tabs defaultValue="teacher" className="space-y-8">
              <TabsList className="grid grid-cols-2 bg-slate-100 p-1.5 rounded-2xl h-14">
                <TabsTrigger value="teacher" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">Teacher</TabsTrigger>
                <TabsTrigger value="admin" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">Admin</TabsTrigger>
              </TabsList>

              <TabsContent value="teacher">
                <form onSubmit={handleTeacherSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        type="email" 
                        placeholder="name@school.edu" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Password</label>
                      <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 rounded-2xl bg-primary hover:bg-blue-800 text-white font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-95"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Authenticating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Sign In to Portal <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <div className="text-center space-y-6">
                  <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                    <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
                    <p className="text-slate-600 font-medium leading-relaxed">
                      Administrative access is restricted to authorized personnel. Please use the Google Admin Console to sign in.
                    </p>
                  </div>
                  <Button 
                    onClick={onAdminLogin}
                    className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-lg shadow-xl shadow-slate-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                    Continue with Google Admin
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <p className="text-center mt-8 text-slate-400 text-sm font-medium">
          Need help? Contact the <a href="#" className="text-primary hover:underline">IT Support Desk</a>
        </p>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [teacherUser, setTeacherUser] = useState<Teacher | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [documents, setDocuments] = useState<SchoolDocument[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classWork, setClassWork] = useState<ClassWork[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u?.email?.toLowerCase() === "manojprajapatiworks@gmail.com") {
        setIsAdmin(true);
        setIsTeacher(false);
      } else {
        setIsAdmin(false);
        if (u?.email) {
          const teacher = await teacherService.checkIsTeacher(u.email);
          if (teacher) {
            setIsTeacher(true);
            setTeacherUser(teacher);
          } else {
            setIsTeacher(false);
            setTeacherUser(null);
          }
        } else {
          setIsTeacher(false);
          setTeacherUser(null);
        }
      }
    });

    const unsubInfo = schoolService.subscribeToInfo((info) => {
      setSchoolInfo(info);
      if (!info && isAdmin) {
        schoolService.updateInfo({
          name: "St. Xavier's School",
          logoUrl: "https://cdn-icons-png.flaticon.com/512/2940/2940651.png",
          heroTitle: "Empowering Minds, Shaping Futures",
          heroSubtitle: "Join St. Xavier's School, where we nurture creativity, character, and academic excellence in every student.",
          heroImages: [
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2000",
            "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000"
          ],
          faculty: [
            { id: '1', name: "Dr. Robert Wilson", role: "Principal", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
            { id: '2', name: "Sarah Jenkins", role: "Head of Science", imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" }
          ],
          facilities: [
            { id: '1', title: "Modern Labs", description: "State-of-the-art science and computer laboratories.", imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800" }
          ],
          footer: {
            address: "123 Education Lane, Knowledge City",
            email: "info@stxaviers.edu",
            phone: "+1 (555) 123-4567",
            about: "Dedicated to providing a holistic education that empowers students to become lifelong learners and responsible global citizens."
          }
        }, { name: 'System', role: 'admin', id: 'system' });
      }
    });

    const unsubAnn = announcementService.subscribe(setAnnouncements);
    const unsubDocs = documentService.subscribe(setDocuments);
    const unsubWork = classWorkService.subscribe(setClassWork);
    const unsubJobs = jobService.subscribe(setJobs);
    
    let unsubTeachers: (() => void) | undefined;
    let unsubLogs: (() => void) | undefined;

    if (user) {
      if (isAdmin) {
        unsubTeachers = teacherService.subscribe(setTeachers);
        unsubLogs = logService.subscribe(setLogs);
      } else if (isTeacher && teacherUser) {
        unsubLogs = logService.subscribe(setLogs, { userId: teacherUser.id });
      }
    }

    return () => {
      unsubAuth();
      unsubInfo();
      unsubAnn();
      unsubDocs();
      unsubWork();
      unsubJobs();
      if (unsubTeachers) unsubTeachers();
      if (unsubLogs) unsubLogs();
    };
  }, [isAdmin, isTeacher, user, teacherUser]);

  useEffect(() => {
    if ((isAdmin || isTeacher) && user) {
      const unsub = studentService.subscribeAll(setStudents);
      return unsub;
    }
  }, [isAdmin, isTeacher, user]);

  const handleLogin = async () => {
    setActiveTab('login');
  };

  const handleTeacherLogin = (teacher: Teacher) => {
    setTeacherUser(teacher);
    setIsTeacher(true);
    setActiveTab('admin');
    toast.success(`Welcome, ${teacher.name}!`);
  };

  const handleLogout = async () => {
    if (user) await signOut(auth);
    setTeacherUser(null);
    setIsAdmin(false);
    setIsTeacher(false);
    setActiveTab('home');
    toast.success("Logged out.");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdmin={isAdmin || isTeacher} 
        user={user || (teacherUser ? ({ displayName: teacherUser.name, email: teacherUser.email } as any) : null)}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Hero info={schoolInfo} />
              <AnnouncementsSection announcements={announcements} />
              <FacultySection faculty={schoolInfo?.faculty || []} />
              <FacilitiesSection facilities={schoolInfo?.facilities || []} />
            </motion.div>
          )}

          {activeTab === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <LoginView 
                onTeacherLogin={handleTeacherLogin} 
                onAdminLogin={async () => {
                  const provider = new GoogleAuthProvider();
                  await signInWithPopup(auth, provider);
                  setActiveTab('admin');
                }} 
              />
            </motion.div>
          )}

          {activeTab === 'admin' && (isAdmin || isTeacher) && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminDashboard 
                info={schoolInfo}
                announcements={announcements}
                documents={documents}
                students={students}
                classWork={classWork}
                teachers={teachers}
                jobs={jobs}
                logs={logs}
                currentUser={isAdmin ? { name: 'Admin', role: 'admin', id: user?.uid || 'admin' } : { name: teacherUser?.name || 'Teacher', role: 'teacher', id: teacherUser?.id || 'teacher', privileges: teacherUser?.privileges }}
              />
            </motion.div>
          )}

          {activeTab === 'portal' && (
            <motion.div
              key="portal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ParentPortal />
            </motion.div>
          )}

          {activeTab === 'announcements' && (
            <motion.div
              key="announcements"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="py-24 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4">
                  <h1 className="text-4xl font-bold mb-12 text-center">All Announcements</h1>
                  <div className="space-y-6">
                    {announcements.map(ann => (
                      <Card key={ann.id} className="rounded-3xl border-none shadow-sm overflow-hidden">
                        <div className={`h-1.5 w-full ${
                          ann.priority === 'high' ? 'bg-red-500' : 
                          ann.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                        }`} />
                        <CardHeader>
                          <div className="flex justify-between items-center mb-2">
                            <Badge variant="secondary">{ann.priority}</Badge>
                            <span className="text-sm text-gray-400">{new Date(ann.date).toLocaleDateString()}</span>
                          </div>
                          <CardTitle>{ann.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 whitespace-pre-wrap">{ann.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DocumentsSection documents={documents} />
            </motion.div>
          )}

          {activeTab === 'careers' && (
            <motion.div
              key="careers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CareersSection jobs={jobs} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <Footer info={schoolInfo} />
      <Toaster position="bottom-right" />
    </div>
  );
}
