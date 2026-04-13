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
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  schoolService, 
  announcementService, 
  studentService, 
  classWorkService, 
  documentService 
} from './lib/services';
import { 
  SchoolInfo, 
  Announcement, 
  Student, 
  ClassWork, 
  SchoolDocument,
  TestResult
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
                <img src={user.photoURL || ''} className="w-8 h-8 rounded-full border border-gray-200" alt="profile" />
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
  return (
    <div className="relative h-[600px] overflow-hidden bg-gray-900">
      <img
        src={info?.heroImageUrl || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2000"}
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        alt="School Hero"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <Badge className="mb-4 bg-blue-600/20 text-blue-400 border-blue-600/30 backdrop-blur-sm">
            Welcome to Excellence
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            {info?.heroTitle || "Empowering Minds, Shaping Futures"}
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            {info?.heroSubtitle || "Join St. Xavier's School, where we nurture creativity, character, and academic excellence in every student."}
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
              Apply Now
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 text-lg px-8">
              Virtual Tour
            </Button>
          </div>
        </motion.div>
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

const AdminDashboard = ({ 
  info, 
  announcements, 
  documents, 
  students,
  classWork
}: { 
  info: SchoolInfo | null;
  announcements: Announcement[];
  documents: SchoolDocument[];
  students: Student[];
  classWork: ClassWork[];
}) => {
  const [editingInfo, setEditingInfo] = useState<SchoolInfo | null>(info);
  const [newAnn, setNewAnn] = useState({ title: '', content: '', priority: 'medium' as const });
  const [newDoc, setNewDoc] = useState({ title: '', url: '', type: 'profarma' as const });
  const [newStudent, setNewStudent] = useState<Partial<Student>>({ name: '', portalCode: '', class: '', results: [] });
  const [newWork, setNewWork] = useState({ className: '', subject: '', topic: '', description: '' });

  const handleUpdateInfo = async () => {
    if (editingInfo) {
      await schoolService.updateInfo(editingInfo);
      toast.success("School info updated successfully!");
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
        attendance: 100,
        rollNumber: '0',
        parentName: '',
      } as Student);
      setNewStudent({ name: '', portalCode: '', class: '', results: [] });
      toast.success("Student added!");
    }
  };

  const handleAddClassWork = async () => {
    await classWorkService.add({ ...newWork, date: new Date().toISOString() });
    setNewWork({ className: '', subject: '', topic: '', description: '' });
    toast.success("Class work added!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Control Panel</h1>
          <p className="text-gray-600">Manage school content, students, and portal data.</p>
        </div>

        <Tabs defaultValue="info" className="space-y-8">
          <TabsList className="bg-white p-1 rounded-2xl shadow-sm overflow-x-auto flex-nowrap">
            <TabsTrigger value="info" className="rounded-xl px-6">School Info</TabsTrigger>
            <TabsTrigger value="announcements" className="rounded-xl px-6">Announcements</TabsTrigger>
            <TabsTrigger value="students" className="rounded-xl px-6">Students</TabsTrigger>
            <TabsTrigger value="classwork" className="rounded-xl px-6">Class Work</TabsTrigger>
            <TabsTrigger value="documents" className="rounded-xl px-6">Documents</TabsTrigger>
          </TabsList>

          {/* School Info Tab */}
          <TabsContent value="info">
            <Card className="rounded-3xl border-none shadow-sm">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
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
                    <label className="text-sm font-medium">Hero Image URL</label>
                    <Input 
                      value={editingInfo?.heroImageUrl || ''} 
                      onChange={e => setEditingInfo(prev => prev ? {...prev, heroImageUrl: e.target.value} : null)}
                    />
                  </div>
                </div>
                <Button onClick={handleUpdateInfo} className="bg-blue-600">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
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
                      <Button variant="ghost" size="sm" onClick={() => announcementService.delete(ann.id)} className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="rounded-3xl border-none shadow-sm h-fit">
                <CardHeader><CardTitle>Add Student</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Input 
                    placeholder="Student Name" 
                    value={newStudent.name} 
                    onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                  />
                  <Input 
                    placeholder="Portal Code (Unique)" 
                    value={newStudent.portalCode} 
                    onChange={e => setNewStudent({...newStudent, portalCode: e.target.value})}
                  />
                  <Input 
                    placeholder="Class" 
                    value={newStudent.class} 
                    onChange={e => setNewStudent({...newStudent, class: e.target.value})}
                  />
                  <Button onClick={handleAddStudent} className="w-full bg-blue-600">
                    <Plus className="w-4 h-4 mr-2" /> Add Student
                  </Button>
                </CardContent>
              </Card>
              <div className="lg:col-span-2">
                <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map(s => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.name}</TableCell>
                          <TableCell>{s.class}</TableCell>
                          <TableCell><Badge variant="outline">{s.portalCode}</Badge></TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => studentService.delete(s.portalCode)} className="text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Class Work Tab */}
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
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => classWorkService.delete(cw.id)} className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
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
                      <Button variant="ghost" size="sm" onClick={() => documentService.delete(doc.id)} className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 p-2 rounded-xl">
                <School className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight">St. Xavier's School</span>
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Dedicated to providing a holistic education that empowers students to become lifelong learners and responsible global citizens.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Admissions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Academic Calendar</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>123 Education Lane, Knowledge City</li>
              <li>info@stxaviers.edu</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} St. Xavier's School. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [documents, setDocuments] = useState<SchoolDocument[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classWork, setClassWork] = useState<ClassWork[]>([]);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAdmin(u?.email === "manojprajapatiworks@gmail.com");
    });

    const unsubInfo = schoolService.subscribeToInfo((info) => {
      setSchoolInfo(info);
      // Initialize with defaults if empty
      if (!info && isAdmin) {
        schoolService.updateInfo({
          name: "St. Xavier's School",
          logoUrl: "https://cdn-icons-png.flaticon.com/512/2940/2940651.png",
          heroTitle: "Empowering Minds, Shaping Futures",
          heroSubtitle: "Join St. Xavier's School, where we nurture creativity, character, and academic excellence in every student.",
          heroImageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2000",
          faculty: [
            { name: "Dr. Robert Wilson", role: "Principal", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
            { name: "Sarah Jenkins", role: "Head of Science", imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" },
            { name: "Michael Chen", role: "Math Coordinator", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
            { name: "Emily Davis", role: "Arts Director", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" }
          ],
          facilities: [
            { title: "Modern Labs", description: "State-of-the-art science and computer laboratories.", imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800" },
            { title: "Sports Complex", description: "Olympic-sized swimming pool and multi-purpose courts.", imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800" },
            { title: "Digital Library", description: "Access to thousands of e-books and research journals.", imageUrl: "https://images.unsplash.com/photo-1507733108721-c010ef58710b?auto=format&fit=crop&q=80&w=800" }
          ]
        });
      }
    });
    const unsubAnn = announcementService.subscribe(setAnnouncements);
    const unsubDocs = documentService.subscribe(setDocuments);
    const unsubWork = classWorkService.subscribe(setClassWork);

    return () => {
      unsubAuth();
      unsubInfo();
      unsubAnn();
      unsubDocs();
      unsubWork();
    };
  }, []);

  useEffect(() => {
    if (isAdmin) {
      studentService.getAll().then(setStudents);
    }
  }, [isAdmin]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Logged in successfully!");
    } catch (err) {
      toast.error("Login failed.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAdmin(false);
    setActiveTab('home');
    toast.success("Logged out.");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdmin={isAdmin} 
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero info={schoolInfo} />
              <AnnouncementsSection announcements={announcements} />
              <FacultySection faculty={schoolInfo?.faculty || []} />
              <FacilitiesSection facilities={schoolInfo?.facilities || []} />
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

          {activeTab === 'admin' && isAdmin && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminDashboard 
                info={schoolInfo} 
                announcements={announcements} 
                documents={documents} 
                students={students}
                classWork={classWork}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}
