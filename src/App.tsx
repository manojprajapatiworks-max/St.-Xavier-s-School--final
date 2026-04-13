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
  Building2
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
  teacherService
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
  Facility
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

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'portal', label: 'Parents Portal', icon: Users },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'documents', label: 'Documents', icon: Download },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', icon: ShieldCheck });
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-blue-600 p-2 rounded-xl">
              <School className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">St. Xavier's</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                  activeTab === item.id ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                {user.photoURL ? (
                  <img src={user.photoURL} className="w-8 h-8 rounded-full border border-gray-200" alt="profile" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                    {user.displayName?.[0] || user.email?.[0] || 'U'}
                  </div>
                )}
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={onLogin} className="bg-blue-600 hover:bg-blue-700">
                <LogIn className="w-4 h-4 mr-2" />
                Admin Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
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
  const images = info?.heroImages?.length ? info.heroImages : [
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=2000"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative h-[700px] overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImage}
          src={images[currentImage]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 w-full h-full object-cover"
          alt="School Hero"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/40 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <Badge className="mb-6 bg-blue-600 text-white border-none px-4 py-1 text-sm font-semibold tracking-wide uppercase">
            Excellence in Education
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] uppercase">
            {info?.heroTitle || "Empowering Minds, Shaping Futures"}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed font-medium max-w-xl">
            {info?.heroSubtitle || "Join St. Xavier's School, where we nurture creativity, character, and academic excellence in every student."}
          </p>
          <div className="flex flex-wrap gap-6">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-10 h-14 text-lg font-bold shadow-2xl shadow-blue-600/20 transition-all hover:scale-105">
              Apply Now
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white/40 hover:bg-white/10 rounded-full px-10 h-14 text-lg font-bold backdrop-blur-sm transition-all hover:scale-105">
              Virtual Tour
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImage(idx)}
            className={`h-1.5 transition-all rounded-full ${
              currentImage === idx ? 'w-12 bg-blue-600' : 'w-3 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const AnnouncementsSection = ({ announcements }: { announcements: Announcement[] }) => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Announcements</h2>
            <p className="text-gray-600">Stay updated with the latest news and events from our school.</p>
          </div>
          <Button variant="ghost" className="text-blue-600">View All <ChevronRight className="w-4 h-4 ml-1" /></Button>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {announcements.slice(0, 3).map((ann, idx) => (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow border-gray-100 overflow-hidden group">
                <div className={`h-1.5 w-full ${
                  ann.priority === 'high' ? 'bg-red-500' : 
                  ann.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                }`} />
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {new Date(ann.date).toLocaleDateString()}
                    </span>
                    <Badge variant="secondary" className="capitalize">{ann.priority}</Badge>
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">{ann.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3">{ann.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {announcements.length === 0 && (
            <div className="col-span-3 py-12 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
              No recent announcements.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const FacultySection = ({ faculty }: { faculty: SchoolInfo['faculty'] }) => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Distinguished Faculty</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Meet the dedicated educators who inspire and guide our students every day.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {faculty?.map((member, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="text-center"
            >
              <div className="relative mb-4 inline-block">
                <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-6 -z-10 opacity-10 group-hover:rotate-12 transition-transform" />
                <img
                  src={member.imageUrl || `https://picsum.photos/seed/${member.name}/400/400`}
                  className="w-40 h-40 md:w-48 md:h-48 rounded-2xl object-cover shadow-lg border-4 border-white"
                  alt={member.name}
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
              <p className="text-sm text-blue-600 font-medium">{member.role}</p>
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
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="p-8 shadow-2xl border-none rounded-3xl">
            <div className="text-center mb-8">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-blue-600 w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Parent Portal</h2>
              <p className="text-gray-600 mt-2">Enter your unique student code to access the portal.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Student Portal Code</label>
                <Input
                  placeholder="e.g. STX-2024-001"
                  value={portalCode}
                  onChange={(e) => setPortalCode(e.target.value)}
                  className="h-12 rounded-xl"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? "Accessing..." : "Unlock Portal"}
              </Button>
            </form>
            <p className="text-center text-xs text-gray-400 mt-6">
              Contact school administration if you don't have a code.
            </p>
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600">Viewing data for <span className="font-semibold text-blue-600">{student.name}</span></p>
          </div>
          <Button variant="outline" onClick={() => setStudent(null)} className="rounded-xl">
            <LogOut className="w-4 h-4 mr-2" /> Exit Portal
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Attendance */}
          <div className="space-y-8">
            <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
              <div className="bg-blue-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                    {student.name[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{student.name}</h3>
                    <p className="text-blue-100 text-sm">Class: {student.class}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Roll Number</span>
                  <span className="font-medium">{student.rollNumber}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Parent Name</span>
                  <span className="font-medium">{student.parentName}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Portal Code</span>
                  <Badge variant="secondary">{student.portalCode}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" /> Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-5xl font-bold text-blue-600 mb-2">{student.attendance}%</div>
                  <p className="text-gray-500 text-sm">Overall Attendance this Term</p>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{ width: `${student.attendance}%` }} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column: Performance & Results */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="bg-white p-1 rounded-2xl shadow-sm mb-6">
                <TabsTrigger value="results" className="rounded-xl px-8">Exam Results</TabsTrigger>
                <TabsTrigger value="classwork" className="rounded-xl px-8">Class Work</TabsTrigger>
                <TabsTrigger value="performance" className="rounded-xl px-8">Performance Chart</TabsTrigger>
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
  currentUser
}: { 
  info: SchoolInfo | null;
  announcements: Announcement[];
  documents: SchoolDocument[];
  students: Student[];
  classWork: ClassWork[];
  teachers: Teacher[];
  currentUser: { name: string; role: string; privileges?: Teacher['privileges'] };
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
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string; title: string } | null>(null);

  const canManageInfo = currentUser.role === 'admin';
  const canManageAnnouncements = currentUser.role === 'admin';
  const canManageTeachers = currentUser.role === 'admin';
  const canManageStudents = currentUser.role === 'admin' || currentUser.privileges?.students;
  const canManageResults = currentUser.role === 'admin' || currentUser.privileges?.results;
  const canManageClassWork = currentUser.role === 'admin' || currentUser.privileges?.classwork;
  const canManageDocuments = currentUser.role === 'admin';

  useEffect(() => {
    if (info) setEditingInfo(info);
  }, [info]);

  const handleUpdateInfo = async () => {
    if (editingInfo) {
      await schoolService.updateInfo(editingInfo);
      toast.success("School info updated successfully!");
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { type, id } = confirmDelete;
    try {
      if (type === 'announcement') await announcementService.delete(id);
      if (type === 'document') await documentService.delete(id);
      if (type === 'student') await studentService.delete(id);
      if (type === 'classwork') await classWorkService.delete(id);
      if (type === 'teacher') await teacherService.delete(id);
      toast.success("Deleted successfully!");
    } catch (err) {
      toast.error("Error deleting item.");
    }
  };

  const handleAddAnnouncement = async () => {
    await announcementService.add({ ...newAnn, date: new Date().toISOString() });
    setNewAnn({ title: '', content: '', priority: 'medium' });
    toast.success("Announcement added!");
  };

  const handleAddDocument = async () => {
    await documentService.add({ ...newDoc, uploadedAt: new Date().toISOString() });
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
      } as Student, currentUser.name);
      setNewStudent({ name: '', portalCode: '', class: '', results: [] });
      setSelectedStudent(null);
      toast.success("Student updated!");
    }
  };

  const handleAddClassWork = async () => {
    await classWorkService.add({ ...newWork, date: new Date().toISOString() }, currentUser.name);
    setNewWork({ className: '', subject: '', topic: '', description: '' });
    toast.success("Class work added!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {currentUser.role === 'admin' ? 'Admin Control Panel' : 'Teacher Dashboard'}
          </h1>
          <p className="text-gray-600">Welcome back, {currentUser.name}. Manage school data and portal content.</p>
        </div>

        <Tabs defaultValue={canManageInfo ? "info" : canManageTeachers ? "teachers" : "students"} className="space-y-8">
          <TabsList className="bg-white p-1 rounded-2xl shadow-sm overflow-x-auto flex-nowrap">
            {canManageInfo && <TabsTrigger value="info" className="rounded-xl px-6">School Info</TabsTrigger>}
            {canManageAnnouncements && <TabsTrigger value="announcements" className="rounded-xl px-6">Announcements</TabsTrigger>}
            {canManageTeachers && <TabsTrigger value="teachers" className="rounded-xl px-6">Teachers</TabsTrigger>}
            {canManageStudents && <TabsTrigger value="students" className="rounded-xl px-6">Students</TabsTrigger>}
            {canManageClassWork && <TabsTrigger value="classwork" className="rounded-xl px-6">Class Work</TabsTrigger>}
            {canManageDocuments && <TabsTrigger value="documents" className="rounded-xl px-6">Documents</TabsTrigger>}
          </TabsList>

          {/* School Info Tab */}
          {canManageInfo && (
            <TabsContent value="info">
              {/* ... existing info content ... */}
            <div className="space-y-8">
              <Card className="rounded-3xl border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> General Settings</CardTitle>
                  <CardDescription>Update the school's public profile and hero section.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">School Name</label>
                      <Input 
                        value={editingInfo?.name || ''} 
                        onChange={e => setEditingInfo(prev => prev ? {...prev, name: e.target.value} : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Logo URL</label>
                      <Input 
                        value={editingInfo?.logoUrl || ''} 
                        onChange={e => setEditingInfo(prev => prev ? {...prev, logoUrl: e.target.value} : null)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Hero Title</label>
                      <Input 
                        value={editingInfo?.heroTitle || ''} 
                        onChange={e => setEditingInfo(prev => prev ? {...prev, heroTitle: e.target.value} : null)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Hero Subtitle</label>
                      <Input 
                        value={editingInfo?.heroSubtitle || ''} 
                        onChange={e => setEditingInfo(prev => prev ? {...prev, heroSubtitle: e.target.value} : null)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Hero Images (One per line)</label>
                      <textarea 
                        className="w-full min-h-[100px] p-3 rounded-xl border border-gray-200 text-sm"
                        value={editingInfo?.heroImages?.join('\n') || ''}
                        onChange={e => setEditingInfo(prev => prev ? {...prev, heroImages: e.target.value.split('\n').filter(s => s.trim())} : null)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Faculty Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {editingInfo?.faculty?.map((f, idx) => (
                      <div key={f.id} className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl relative group">
                        <Input placeholder="Name" value={f.name} onChange={e => {
                          const faculty = [...(editingInfo.faculty || [])];
                          faculty[idx].name = e.target.value;
                          setEditingInfo({...editingInfo, faculty});
                        }} />
                        <Input placeholder="Role" value={f.role} onChange={e => {
                          const faculty = [...(editingInfo.faculty || [])];
                          faculty[idx].role = e.target.value;
                          setEditingInfo({...editingInfo, faculty});
                        }} />
                        <Input placeholder="Image URL" value={f.imageUrl} onChange={e => {
                          const faculty = [...(editingInfo.faculty || [])];
                          faculty[idx].imageUrl = e.target.value;
                          setEditingInfo({...editingInfo, faculty});
                        }} />
                        <button 
                          onClick={() => {
                            const faculty = editingInfo.faculty?.filter((_, i) => i !== idx);
                            setEditingInfo({...editingInfo, faculty});
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" onClick={() => {
                      setEditingInfo(prev => prev ? {
                        ...prev, 
                        faculty: [...(prev.faculty || []), { id: Math.random().toString(36).substr(2, 9), name: '', role: '', imageUrl: '' }]
                      } : null);
                    }}>
                      <Plus className="w-4 h-4 mr-2" /> Add Faculty Member
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" /> Facilities Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {editingInfo?.facilities?.map((f, idx) => (
                      <div key={f.id} className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl relative group">
                        <Input placeholder="Title" value={f.title} onChange={e => {
                          const facilities = [...(editingInfo.facilities || [])];
                          facilities[idx].title = e.target.value;
                          setEditingInfo({...editingInfo, facilities});
                        }} />
                        <Input placeholder="Image URL" value={f.imageUrl} onChange={e => {
                          const facilities = [...(editingInfo.facilities || [])];
                          facilities[idx].imageUrl = e.target.value;
                          setEditingInfo({...editingInfo, facilities});
                        }} />
                        <textarea 
                          className="w-full md:col-span-2 p-3 rounded-xl border border-gray-200 text-sm"
                          placeholder="Description"
                          value={f.description}
                          onChange={e => {
                            const facilities = [...(editingInfo.facilities || [])];
                            facilities[idx].description = e.target.value;
                            setEditingInfo({...editingInfo, facilities});
                          }}
                        />
                        <button 
                          onClick={() => {
                            const facilities = editingInfo.facilities?.filter((_, i) => i !== idx);
                            setEditingInfo({...editingInfo, facilities});
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" onClick={() => {
                      setEditingInfo(prev => prev ? {
                        ...prev, 
                        facilities: [...(prev.facilities || []), { id: Math.random().toString(36).substr(2, 9), title: '', description: '', imageUrl: '' }]
                      } : null);
                    }}>
                      <Plus className="w-4 h-4 mr-2" /> Add Facility
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Footer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Address</label>
                      <Input 
                        value={editingInfo?.footer?.address || ''} 
                        onChange={e => setEditingInfo(prev => prev ? {...prev, footer: {...prev.footer, address: e.target.value}} : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input 
                        value={editingInfo?.footer?.email || ''} 
                        onChange={e => setEditingInfo(prev => prev ? {...prev, footer: {...prev.footer, email: e.target.value}} : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input 
                        value={editingInfo?.footer?.phone || ''} 
                        onChange={e => setEditingInfo(prev => prev ? {...prev, footer: {...prev.footer, phone: e.target.value}} : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">About Text</label>
                      <Input 
                        value={editingInfo?.footer?.about || ''} 
                        onChange={e => setEditingInfo(prev => prev ? {...prev, footer: {...prev.footer, about: e.target.value}} : null)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleUpdateInfo} className="bg-blue-600 rounded-full px-8 h-12 shadow-lg shadow-blue-600/20">
                  <Save className="w-4 h-4 mr-2" /> Save All Settings
                </Button>
              </div>
            </div>
          </TabsContent>
          )}

          {/* Announcements Tab */}
          {canManageAnnouncements && (
            <TabsContent value="announcements">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="rounded-3xl border-none shadow-sm h-fit">
                <CardHeader><CardTitle>Add Announcement</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Input 
                    placeholder="Title" 
                    value={newAnn.title} 
                    onChange={e => setNewAnn({...newAnn, title: e.target.value})}
                  />
                  <textarea 
                    className="w-full min-h-[100px] p-3 rounded-xl border border-gray-200 text-sm" 
                    placeholder="Content"
                    value={newAnn.content}
                    onChange={e => setNewAnn({...newAnn, content: e.target.value})}
                  />
                  <select 
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm"
                    value={newAnn.priority}
                    onChange={e => setNewAnn({...newAnn, priority: e.target.value as any})}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <Button onClick={handleAddAnnouncement} className="w-full bg-blue-600">
                    <Plus className="w-4 h-4 mr-2" /> Post Announcement
                  </Button>
                </CardContent>
              </Card>
              <div className="lg:col-span-2 space-y-4">
                {announcements.map(ann => (
                  <Card key={ann.id} className="rounded-2xl border-none shadow-sm">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold">{ann.title}</h4>
                        <p className="text-xs text-gray-400">{new Date(ann.date).toLocaleDateString()}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setConfirmDelete({ type: 'announcement', id: ann.id, title: ann.title })} className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          )}

          {/* Students Tab */}
          {canManageStudents && (
            <TabsContent value="students">
              <div className="grid lg:grid-cols-3 gap-8">
                <Card className="rounded-3xl border-none shadow-sm h-fit">
                  <CardHeader><CardTitle>{selectedStudent ? 'Edit Student' : 'Add Student'}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <Input 
                      placeholder="Student Name" 
                      value={newStudent.name || ''} 
                      onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                    />
                    <Input 
                      placeholder="Portal Code (Unique)" 
                      value={newStudent.portalCode || ''} 
                      onChange={e => setNewStudent({...newStudent, portalCode: e.target.value})}
                      disabled={!!selectedStudent}
                    />
                    <Input 
                      placeholder="Class" 
                      value={newStudent.class || ''} 
                      onChange={e => setNewStudent({...newStudent, class: e.target.value})}
                    />
                    <Input 
                      placeholder="Roll Number" 
                      value={newStudent.rollNumber || ''} 
                      onChange={e => setNewStudent({...newStudent, rollNumber: e.target.value})}
                    />
                    <Input 
                      placeholder="Parent Name" 
                      value={newStudent.parentName || ''} 
                      onChange={e => setNewStudent({...newStudent, parentName: e.target.value})}
                    />
                    <Input 
                      placeholder="Student Image URL" 
                      value={newStudent.imageUrl || ''} 
                      onChange={e => setNewStudent({...newStudent, imageUrl: e.target.value})}
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Attendance %</label>
                      <Input 
                        type="number"
                        value={isNaN(newStudent.attendance as number) ? 0 : newStudent.attendance} 
                        onChange={e => {
                          const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                          setNewStudent({...newStudent, attendance: isNaN(val) ? 0 : val});
                        }}
                      />
                    </div>
                    
                    {canManageResults && (
                      <div className="pt-4 border-t space-y-4">
                        <h4 className="text-sm font-bold">Exam Results</h4>
                        {newStudent.results?.map((res, idx) => (
                          <div key={idx} className="grid grid-cols-2 gap-2 p-2 bg-gray-50 rounded-lg relative group">
                            <Input placeholder="Subject" value={res.subject} onChange={e => {
                              const results = [...(newStudent.results || [])];
                              results[idx].subject = e.target.value;
                              setNewStudent({...newStudent, results});
                            }} />
                            <Input type="number" placeholder="Score" value={res.score} onChange={e => {
                              const results = [...(newStudent.results || [])];
                              results[idx].score = parseInt(e.target.value);
                              setNewStudent({...newStudent, results});
                            }} />
                            <Input placeholder="Term" value={res.term} onChange={e => {
                              const results = [...(newStudent.results || [])];
                              results[idx].term = e.target.value;
                              setNewStudent({...newStudent, results});
                            }} />
                            <Input type="number" placeholder="Total" value={res.total} onChange={e => {
                              const results = [...(newStudent.results || [])];
                              results[idx].total = parseInt(e.target.value);
                              setNewStudent({...newStudent, results});
                            }} />
                            <button 
                              onClick={() => {
                                const results = newStudent.results?.filter((_, i) => i !== idx);
                                setNewStudent({...newStudent, results});
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full" onClick={() => {
                          setNewStudent({...newStudent, results: [...(newStudent.results || []), { subject: '', score: 0, total: 100, term: 'Final' }]});
                        }}>
                          <Plus className="w-4 h-4 mr-2" /> Add Result
                        </Button>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {selectedStudent && (
                        <Button variant="outline" className="flex-1" onClick={() => {
                          setSelectedStudent(null);
                          setNewStudent({ name: '', portalCode: '', class: '', results: [] });
                        }}>Cancel</Button>
                      )}
                      <Button onClick={handleAddStudent} className="flex-1 bg-blue-600">
                        {selectedStudent ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                        {selectedStudent ? 'Update' : 'Add'} Student
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="lg:col-span-2">
                  <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Last Edited By</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map(s => (
                          <TableRow key={s.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                                  {s.imageUrl ? <img src={s.imageUrl} className="w-full h-full rounded-full object-cover" /> : s.name[0]}
                                </div>
                                <div>
                                  <div className="font-medium">{s.name}</div>
                                  <div className="text-xs text-gray-400">Roll: {s.rollNumber}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{s.class}</TableCell>
                            <TableCell><Badge variant="outline">{s.portalCode}</Badge></TableCell>
                            <TableCell>
                              <div className="text-xs text-gray-500">
                                {s.lastEditedBy || 'System'}
                                {s.lastEditedAt && <div className="text-[10px] opacity-60">{new Date(s.lastEditedAt).toLocaleDateString()}</div>}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => {
                                  setSelectedStudent(s);
                                  setNewStudent(s);
                                }}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setConfirmDelete({ type: 'student', id: s.portalCode, title: s.name })} className="text-red-500">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              </div>
            </TabsContent>
          )}

          {/* Teachers Tab */}
          {canManageTeachers && (
            <TabsContent value="teachers">
              <div className="grid lg:grid-cols-3 gap-8">
                <Card className="rounded-3xl border-none shadow-sm h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5" /> Add Teacher</CardTitle>
                    <CardDescription>Teachers can manage student results and class work.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input 
                      placeholder="Teacher Name" 
                      value={newTeacher.name} 
                      onChange={e => setNewTeacher({...newTeacher, name: e.target.value})}
                    />
                    <Input 
                      placeholder="Email Address" 
                      value={newTeacher.email} 
                      onChange={e => setNewTeacher({...newTeacher, email: e.target.value})}
                    />
                    <Input 
                      placeholder="Password" 
                      type="password"
                      value={newTeacher.password} 
                      onChange={e => setNewTeacher({...newTeacher, password: e.target.value})}
                    />
                    <Input 
                      placeholder="Subject" 
                      value={newTeacher.subject} 
                      onChange={e => setNewTeacher({...newTeacher, subject: e.target.value})}
                    />
                    
                    <div className="space-y-3 pt-4 border-t">
                      <h4 className="text-sm font-bold">Privileges</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={newTeacher.privileges?.results} 
                            onChange={e => setNewTeacher({
                              ...newTeacher, 
                              privileges: { ...newTeacher.privileges!, results: e.target.checked }
                            })}
                          />
                          Manage Exam Results
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={newTeacher.privileges?.classwork} 
                            onChange={e => setNewTeacher({
                              ...newTeacher, 
                              privileges: { ...newTeacher.privileges!, classwork: e.target.checked }
                            })}
                          />
                          Manage Class Work
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={newTeacher.privileges?.students} 
                            onChange={e => setNewTeacher({
                              ...newTeacher, 
                              privileges: { ...newTeacher.privileges!, students: e.target.checked }
                            })}
                          />
                          Manage Student Profiles
                        </label>
                      </div>
                    </div>

                    <Button onClick={async () => {
                      if (!newTeacher.name || !newTeacher.email || !newTeacher.password) {
                        toast.error("Please fill all fields");
                        return;
                      }
                      try {
                        await teacherService.add(newTeacher as Teacher);
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
                    }} className="w-full bg-blue-600">
                      <Plus className="w-4 h-4 mr-2" /> Add Teacher
                    </Button>
                  </CardContent>
                </Card>
                <div className="lg:col-span-2 space-y-4">
                  {teachers.map(t => (
                    <Card key={t.id} className="rounded-2xl border-none shadow-sm">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <User className="text-blue-600 w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold">{t.name}</h4>
                            <p className="text-xs text-gray-500">{t.email} • {t.subject}</p>
                            <p className="text-[10px] text-blue-600 font-mono mt-1 bg-blue-50 px-2 py-0.5 rounded w-fit">Pass: {t.password}</p>
                            <div className="flex gap-2 mt-1">
                              {t.privileges?.results && <Badge variant="secondary" className="text-[10px]">Results</Badge>}
                              {t.privileges?.classwork && <Badge variant="secondary" className="text-[10px]">Classwork</Badge>}
                              {t.privileges?.students && <Badge variant="secondary" className="text-[10px]">Students</Badge>}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setConfirmDelete({ type: 'teacher', id: t.id, title: t.name })} className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}

          {/* Class Work Tab */}
          {canManageClassWork && (
            <TabsContent value="classwork">
              <div className="grid lg:grid-cols-3 gap-8">
                <Card className="rounded-3xl border-none shadow-sm h-fit">
                  <CardHeader><CardTitle>Post Class Work</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <Input 
                      placeholder="Class (e.g. 10-A)" 
                      value={newWork.className} 
                      onChange={e => setNewWork({...newWork, className: e.target.value})}
                    />
                    <Input 
                      placeholder="Subject" 
                      value={newWork.subject} 
                      onChange={e => setNewWork({...newWork, subject: e.target.value})}
                    />
                    <Input 
                      placeholder="Topic" 
                      value={newWork.topic} 
                      onChange={e => setNewWork({...newWork, topic: e.target.value})}
                    />
                    <textarea 
                      className="w-full min-h-[100px] p-3 rounded-xl border border-gray-200 text-sm" 
                      placeholder="Description"
                      value={newWork.description}
                      onChange={e => setNewWork({...newWork, description: e.target.value})}
                    />
                    <Button onClick={handleAddClassWork} className="w-full bg-blue-600">
                      <Plus className="w-4 h-4 mr-2" /> Post Work
                    </Button>
                  </CardContent>
                </Card>
                <div className="lg:col-span-2 space-y-4">
                  {classWork.map(cw => (
                    <Card key={cw.id} className="rounded-2xl border-none shadow-sm">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold">{cw.subject} - {cw.className}</h4>
                          <p className="text-sm text-gray-500">{cw.topic}</p>
                          <div className="text-[10px] text-gray-400 mt-1">
                            Added by: {cw.lastEditedBy || 'System'}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setConfirmDelete({ type: 'classwork', id: cw.id, title: cw.subject })} className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}

          {/* Documents Tab */}
          {canManageDocuments && (
            <TabsContent value="documents">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="rounded-3xl border-none shadow-sm h-fit">
                <CardHeader><CardTitle>Upload Document</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Input 
                    placeholder="Document Title" 
                    value={newDoc.title} 
                    onChange={e => setNewDoc({...newDoc, title: e.target.value})}
                  />
                  <Input 
                    placeholder="File URL" 
                    value={newDoc.url} 
                    onChange={e => setNewDoc({...newDoc, url: e.target.value})}
                  />
                  <select 
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm"
                    value={newDoc.type}
                    onChange={e => setNewDoc({...newDoc, type: e.target.value as any})}
                  >
                    <option value="profarma">Profarma</option>
                    <option value="form">Form</option>
                    <option value="result">Result</option>
                    <option value="report">Report</option>
                  </select>
                  <Button onClick={handleAddDocument} className="w-full bg-blue-600">
                    <Plus className="w-4 h-4 mr-2" /> Add Document
                  </Button>
                </CardContent>
              </Card>
              <div className="lg:col-span-2 space-y-4">
                {documents.map(doc => (
                  <Card key={doc.id} className="rounded-2xl border-none shadow-sm">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold">{doc.title}</h4>
                        <Badge variant="secondary">{doc.type}</Badge>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setConfirmDelete({ type: 'document', id: doc.id, title: doc.title })} className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
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
    <footer className="bg-gray-900 text-white py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-600 p-3 rounded-2xl">
                <School className="text-white w-8 h-8" />
              </div>
              <span className="text-3xl font-black tracking-tighter uppercase">{info?.name || "St. Xavier's School"}</span>
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed text-lg">
              {footer?.about || "Dedicated to providing a holistic education that empowers students to become lifelong learners and responsible global citizens."}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-xl mb-8 flex items-center gap-2"><Info className="w-5 h-5 text-blue-500" /> Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Admissions</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Academic Calendar</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xl mb-8 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-500" /> Contact</h4>
            <ul className="space-y-6 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                <span>{footer?.address || "123 Education Lane, Knowledge City"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <span>{footer?.email || "info@stxaviers.edu"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <span>{footer?.phone || "+1 (555) 123-4567"}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} {info?.name || "St. Xavier's School"}. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
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
    const teacher = await teacherService.login(email, password);
    setLoading(false);
    if (teacher) {
      onTeacherLogin(teacher);
    } else {
      toast.error("Invalid teacher credentials.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md rounded-3xl border-none shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-white text-center">
          <School className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">School Portal Login</h2>
          <p className="text-blue-100 mt-2">Access your dashboard</p>
        </div>
        <CardContent className="p-8">
          <Tabs defaultValue="teacher" className="space-y-6">
            <TabsList className="grid grid-cols-2 bg-gray-100 p-1 rounded-2xl">
              <TabsTrigger value="teacher" className="rounded-xl">Teacher</TabsTrigger>
              <TabsTrigger value="admin" className="rounded-xl">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="teacher">
              <form onSubmit={handleTeacherSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <Input 
                    type="email" 
                    placeholder="teacher@stxaviers.edu" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 rounded-xl h-12 font-bold" disabled={loading}>
                  {loading ? "Logging in..." : "Login as Teacher"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <div className="text-center space-y-6 py-4">
                <p className="text-gray-600">Admin access is restricted to authorized Google accounts.</p>
                <Button onClick={onAdminLogin} className="w-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 rounded-xl h-12 font-bold flex items-center justify-center gap-2">
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                  Login with Google
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
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
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u?.email === "manojprajapatiworks@gmail.com") {
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
        });
      }
    });

    const unsubAnn = announcementService.subscribe(setAnnouncements);
    const unsubDocs = documentService.subscribe(setDocuments);
    const unsubWork = classWorkService.subscribe(setClassWork);
    
    let unsubTeachers: (() => void) | undefined;
    if (isAdmin) {
      unsubTeachers = teacherService.subscribe(setTeachers);
    }

    return () => {
      unsubAuth();
      unsubInfo();
      unsubAnn();
      unsubDocs();
      unsubWork();
      if (unsubTeachers) unsubTeachers();
    };
  }, [isAdmin, user]);

  useEffect(() => {
    if (isAdmin || isTeacher) {
      const unsub = studentService.subscribeAll(setStudents);
      return unsub;
    }
  }, [isAdmin, isTeacher]);

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
                currentUser={isAdmin ? { name: 'Admin', role: 'admin' } : { name: teacherUser?.name || 'Teacher', role: 'teacher', privileges: teacherUser?.privileges }}
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

        </AnimatePresence>
      </main>

      <Footer info={schoolInfo} />
      <Toaster position="top-center" />
    </div>
  );
}
