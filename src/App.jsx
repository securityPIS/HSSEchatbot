import React, { useState, useEffect, useRef } from 'react';
import {
  Send, Menu, X, ChevronLeft, ChevronRight, Bot, User, Paperclip, Camera, Video,
  MessageSquare, Newspaper, FileText, CheckCircle2, Circle, AlertTriangle,
  Info, Plus, LogOut, UploadCloud, Image as ImageIcon, ShieldCheck,
  Sparkles
} from 'lucide-react';

const NEWS_ITEMS = [
  {
    id: 1,
    title: "Pembaruan Standar APD Area Operasional",
    date: "22 Jun 2026",
    category: "Regulasi",
    type: "warning",
    summary: "Kewajiban penggunaan helm keselamatan (Safety Helmet) Kelas E terbaru.",
    content: "Berdasarkan evaluasi keselamatan semester pertama, manajemen menetapkan bahwa mulai 1 Juli 2026, seluruh personel yang memasuki area operasional zona kuning dan merah wajib menggunakan Helm Keselamatan (Safety Helmet) Kelas E dengan pelindung benturan samping.\n\nPedoman lengkap telah diperbarui dalam dokumen Sistem Manajemen HSSE. Harap seluruh pekerja dan kontraktor menyesuaikan dengan standar terbaru ini. Inspeksi akan diperketat mulai bulan depan.",
    image: "https://images.unsplash.com/photo-1541888081-3642eb657736?auto=format&fit=crop&q=80&w=400&h=200",
    carousel: [
      { url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=400&h=300", caption: "Helm standar kelas E" },
      { url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400&h=300", caption: "Inspeksi kepatuhan di lapangan" }
    ]
  },
  {
    id: 2,
    title: "Simulasi Tanggap Darurat Kebakaran",
    date: "20 Jun 2026",
    category: "Info",
    type: "info",
    summary: "Jadwal dan rute evakuasi untuk simulasi hari Jumat.",
    content: "Sebagai bagian dari kesiapsiagaan tanggap darurat, simulasi evakuasi kebakaran (Fire Drill) akan dilaksanakan pada:\n\nHari/Tanggal: Jumat, 26 Juni 2026\nWaktu: 09.00 WIB - Selesai\nLokasi: Seluruh area Gedung Utama dan Fasilitas Produksi A\n\nMohon seluruh personel berpartisipasi aktif dan mengikuti arahan dari Floor Warden di masing-masing lantai.",
    image: "https://images.unsplash.com/photo-1614064506922-442cd26588a5?auto=format&fit=crop&q=80&w=400&h=200",
    carousel: [
      { url: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=400&h=300", caption: "Rute dan titik kumpul evakuasi" }
    ]
  },
  {
    id: 3,
    title: "Zero Accident Award 2026",
    date: "15 Jun 2026",
    category: "Pencapaian",
    type: "success",
    summary: "Fasilitas Produksi B berhasil mencapai 1 juta jam kerja aman.",
    content: "Apresiasi setinggi-tingginya kepada seluruh tim di Fasilitas Produksi B atas pencapaian luar biasa: 1 Juta Jam Kerja Tanpa Kecelakaan Kerja (Zero LTI) yang tercapai pada pertengahan tahun 2026 ini.\n\nPencapaian ini adalah bukti komitmen kita bersama terhadap budaya HSSE 'Safety First'. Mari kita pertahankan dan tingkatkan kinerja keselamatan di seluruh area operasi.",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=400&h=200",
    carousel: [
      { url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=400&h=300", caption: "Penghargaan Tim Produksi B" }
    ]
  }
];

const QUICK_REPLIES = [
  "Apa standar APD area operasional?",
  "Prosedur jika terjadi kebakaran?",
  "Cara melaporkan kondisi tidak aman?"
];

// Badge meta per news type — keeps styling consistent across cards & detail view
const TYPE_BADGE = {
  warning: { cls: 'bg-amber-500', icon: AlertTriangle },
  success: { cls: 'bg-emerald-500', icon: CheckCircle2 },
  info: { cls: 'bg-blue-500', icon: Info }
};

// Image with graceful fallback — shows a branded placeholder if the source
// fails to load (e.g. offline, broken URL) instead of a broken-image glyph.
function NewsImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`${className} bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-100 flex items-center justify-center`}>
        <ImageIcon size={32} className="text-emerald-300" />
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} loading="lazy" />;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'news', 'admin'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('pekerja'); // 'pekerja', 'contributor'
  const [userName, setUserName] = useState('');

  // Admin Knowledge Base State
  const [documents, setDocuments] = useState([
    { id: 1, name: "Pedoman APD Pertamina 2026.pdf", isActive: true },
    { id: 2, name: "Prosedur Evakuasi Kebakaran.pdf", isActive: true },
    { id: 3, name: "Regulasi Bekerja di Ketinggian.pdf", isActive: false },
    { id: 4, name: "Panduan Penanganan Limbah B3.pdf", isActive: true },
    { id: 5, name: "Standar Keamanan Area Confined Space.pdf", isActive: false },
  ]);

  // Chat State
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Halo! Saya Asisten HSSE virtual Anda. Silakan tanyakan hal terkait pedoman K3, prosedur darurat, atau peraturan perusahaan.",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: null
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const [chatHistoryList, setChatHistoryList] = useState([
    { id: 1, title: "Tanya Jawab APD Area Produksi", date: "Hari ini" },
    { id: 2, title: "Prosedur Limbah Cair B3", date: "Kemarin" },
    { id: 3, title: "Jam Kerja Standar HSSE", date: "15 Jun" }
  ]);

  const [newsList, setNewsList] = useState(NEWS_ITEMS);
  const [inputText, setInputText] = useState('');

  // State for News Modal Form and View
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsForm, setNewsForm] = useState({ title: '', summary: '', category: 'Info', headerImage: null, carousel: [] });
  const [selectedNews, setSelectedNews] = useState(null);

  // State for Admin/Contributor Popup
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleLogin = (role) => {
    setUserRole(role);
    setUserName(role === 'contributor' ? 'Tabah Darma' : 'Budi Santoso');
    setIsLoggedIn(true);
    setActiveTab('chat');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsSidebarOpen(false);
    setUserRole('');
    setUserName('');
  };

  const toggleDocument = (id) => {
    setDocuments(documents.map(doc =>
      doc.id === id ? { ...doc, isActive: !doc.isActive } : doc
    ));
  };

  // Sends a user text message and simulates a bot reply with a typing indicator
  const sendUserText = (text) => {
    const clean = text.trim();
    if (!clean) return;

    const newMsg = {
      id: Date.now(),
      text: clean,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: null
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const activeDocs = documents.filter(d => d.isActive).map(d => d.name);
      const botResponse = {
        id: Date.now() + 1,
        text: "Berdasarkan dokumen yang saya pelajari, aturan tersebut telah diatur secara rinci. Pastikan Anda selalu menggunakan APD lengkap sesuai dengan zona kerja masing-masing.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: activeDocs.length > 0 ? activeDocs[0] : "Pengetahuan Umum"
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendUserText(inputText);
  };

  const handleMediaUpload = (type) => {
    setShowAttachmentMenu(false);
    const mediaMsg = {
      id: Date.now(),
      text: type === 'camera' ? "Foto terkirim" : "Video terkirim",
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      media: type
    };
    setMessages(prev => [...prev, mediaMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: `Saya telah menerima ${type === 'camera' ? 'foto' : 'video'} Anda. Dari analisis visual, sepertinya terdapat pelanggaran standar keamanan. Mohon segera laporkan detail lokasi kepada supervisor.`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: "Analisis Visual AI"
      }]);
    }, 2000);
  };

  const handleNewChat = () => {
    const newTitle = "Sesi Tanya Jawab K3 Baru";
    setChatHistoryList([{ id: Date.now(), title: newTitle, date: "Baru Saja" }, ...chatHistoryList]);

    setMessages([{
      id: Date.now(),
      text: "Sesi percakapan baru. Silakan ajukan pertanyaan terkait pedoman HSSE terbaru.",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: null
    }]);
    setIsTyping(false);
    setIsSidebarOpen(false);
  };

  const handleHeaderImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file); // Membuat URL lokal (Blob) dari file upload
      setNewsForm({ ...newsForm, headerImage: imageUrl });
    }
  };

  const handleAddCarouselItem = () => {
    setNewsForm({ ...newsForm, carousel: [...newsForm.carousel, { url: '', caption: '' }] });
  };

  const handleCarouselImageUpload = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      const newCarousel = [...newsForm.carousel];
      newCarousel[index].url = imageUrl;
      setNewsForm({ ...newsForm, carousel: newCarousel });
    }
  };

  const handleCarouselCaptionChange = (index, value) => {
    const newCarousel = [...newsForm.carousel];
    newCarousel[index].caption = value;
    setNewsForm({ ...newsForm, carousel: newCarousel });
  };

  const handleRemoveCarouselItem = (index) => {
    const newCarousel = newsForm.carousel.filter((_, i) => i !== index);
    setNewsForm({ ...newsForm, carousel: newCarousel });
  };

  const handleAddNews = (e) => {
    e.preventDefault();

    let newsType = 'info';
    if (newsForm.category === 'Regulasi' || newsForm.category === 'Peringatan') newsType = 'warning';
    if (newsForm.category === 'Pencapaian') newsType = 'success';

    const newItem = {
      id: Date.now(),
      title: newsForm.title,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      category: newsForm.category,
      type: newsType,
      summary: newsForm.summary,
      content: newsForm.summary,
      image: newsForm.headerImage || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=400&h=200",
      carousel: newsForm.carousel.filter(item => item.url) // Hanya simpan lampiran yang telah diisi foto
    };

    setNewsList([newItem, ...newsList]);
    setShowNewsModal(false);
    setNewsForm({ title: '', summary: '', category: 'Info', headerImage: null, carousel: [] });
    setActiveTab('news');
  };

  // ---- Login ----
  const LoginView = () => (
    <div className="flex flex-col h-full bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 justify-center items-center px-6 relative overflow-hidden">
      {/* Animated ambient blobs */}
      <div className="absolute top-[-12%] left-[-12%] w-72 h-72 bg-emerald-400 rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-blob"></div>
      <div className="absolute top-[25%] right-[-15%] w-80 h-80 bg-teal-400 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-72 h-72 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      {/* Subtle dotted texture */}
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)', backgroundSize: '28px 28px' }}></div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-emerald-950/50 p-8 relative z-10 border border-white/40">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-xl opacity-40"></div>
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-emerald-500/30 relative">
              <Bot size={38} className="text-white" />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
              <ShieldCheck size={16} className="text-emerald-600" />
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 text-center mb-2 tracking-tight">HSSE AI Assistant</h1>
        <p className="text-slate-500 text-sm text-center mb-8 leading-relaxed">Pusat Informasi & Konsultasi<br />Keselamatan Kerja</p>

        <div className="space-y-3.5">
          <button
            onClick={() => handleLogin('pekerja')}
            className="w-full flex items-center justify-center py-3.5 px-4 border-2 border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all font-semibold text-slate-700"
          >
            <User size={18} className="mr-2 text-slate-500" />
            Masuk sebagai Pekerja
          </button>

          <button
            onClick={() => handleLogin('contributor')}
            className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] transition-all font-semibold shadow-lg shadow-emerald-500/30"
          >
            <ShieldCheck size={18} className="mr-2" />
            Masuk sebagai Contributor
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span>Dilindungi Sistem Keamanan Terpadu · Pertamina Patra Niaga</span>
        </div>
      </div>
    </div>
  );

  // ---- Chat ----
  const ChatView = () => (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 flex items-center shadow-lg shadow-emerald-900/10 z-10 shrink-0">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-white/15 rounded-full transition-colors mr-2 active:scale-90">
          <Menu size={20} />
        </button>
        <div className="flex items-center space-x-3 flex-1">
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm ring-1 ring-white/30">
              <Bot size={22} className="text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-emerald-600 rounded-full"></span>
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">Bot K3 Pertamina</h1>
            <p className="text-emerald-100 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
              Online · Selalu aktif
            </p>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <Sparkles size={18} className="text-emerald-100" />
        </div>
      </div>

      {/* Sidebar History Drawer */}
      {isSidebarOpen && (
        <div className="absolute inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="w-4/5 max-w-sm bg-white h-full flex flex-col shadow-2xl relative animate-slide-right">
            <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 flex justify-between items-center shrink-0">
              <h2 className="font-bold text-white flex items-center gap-2"><MessageSquare size={18} /> Riwayat Obrolan</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 text-white/90 hover:bg-white/15 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 shrink-0">
              <button onClick={handleNewChat} className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] transition-all shadow-md shadow-emerald-500/25">
                <Plus size={16} />
                <span>Mulai Chat Baru</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-4 soft-scroll">
              <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Terbaru</p>
              <div className="space-y-1">
                {chatHistoryList.map(chat => (
                  <button key={chat.id} className="w-full text-left px-3 py-3 rounded-xl hover:bg-emerald-50 transition-colors flex items-start space-x-3 group">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center shrink-0 transition-colors">
                      <MessageSquare size={15} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{chat.title}</p>
                      <p className="text-xs text-slate-400">{chat.date}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile & Logout at Bottom of Sidebar */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm">
                  <User size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{userName}</p>
                  <p className="text-xs text-slate-500 capitalize flex items-center gap-1">
                    {userRole === 'contributor' && <ShieldCheck size={12} className="text-emerald-500" />}
                    {userRole}
                  </p>
                </div>
              </div>
              <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 text-red-600 bg-red-50 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-100 active:scale-[0.98] transition-all">
                <LogOut size={16} />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-5 scroll-smooth soft-scroll">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex flex-shrink-0 items-center justify-center mb-1 shadow-md shadow-emerald-500/20">
                <Bot size={16} className="text-white" />
              </div>
            )}

            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.sender === 'user'
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-br-md shadow-md shadow-emerald-600/20'
                : 'bg-white text-slate-700 rounded-bl-md border border-slate-100 shadow-sm'
            }`}>
              {msg.media && (
                <div className="w-full h-32 bg-gradient-to-br from-emerald-700 to-teal-800 rounded-xl mb-2 flex items-center justify-center text-emerald-200">
                  {msg.media === 'camera' ? <Camera size={32} /> : <Video size={32} />}
                </div>
              )}
              <p className="text-[15px] leading-relaxed whitespace-pre-line">{msg.text}</p>

              <div className={`flex items-center mt-2 gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-between'}`}>
                {msg.source && (
                  <div className="flex items-center space-x-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-[10px] font-semibold border border-emerald-100">
                    <FileText size={10} />
                    <span className="truncate max-w-[120px]">{msg.source}</span>
                  </div>
                )}
                <span className={`text-[10px] ${msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start items-end space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex flex-shrink-0 items-center justify-center mb-1 shadow-md shadow-emerald-500/20">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-4 border border-slate-100 shadow-sm flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce-dot" style={{ animationDelay: '0s' }}></span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce-dot" style={{ animationDelay: '0.16s' }}></span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce-dot" style={{ animationDelay: '0.32s' }}></span>
            </div>
          </div>
        )}

        {/* Quick reply suggestions (only on a fresh conversation) */}
        {messages.length === 1 && !isTyping && (
          <div className="flex flex-col items-start gap-2 pl-10 pt-1">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Pertanyaan populer</p>
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                onClick={() => sendUserText(q)}
                className="text-left text-sm font-medium text-emerald-700 bg-white border border-emerald-200 px-3.5 py-2 rounded-2xl rounded-bl-md hover:bg-emerald-50 hover:border-emerald-300 active:scale-95 transition-all shadow-sm"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="relative bg-white border-t border-slate-200 p-3 z-10 shrink-0">
        {showAttachmentMenu && (
          <div className="absolute bottom-full left-3 mb-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 flex space-x-1 animate-fade-in">
            <button onClick={() => handleMediaUpload('camera')} className="flex flex-col items-center p-3 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors">
              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-1">
                <Camera size={20} />
              </div>
              <span className="text-xs font-medium">Kamera</span>
            </button>
            <button onClick={() => handleMediaUpload('video')} className="flex flex-col items-center p-3 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors">
              <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-1">
                <Video size={20} />
              </div>
              <span className="text-xs font-medium">Video</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center space-x-2 max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            className={`p-3 rounded-full transition-colors flex-shrink-0 ${showAttachmentMenu ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
          >
            <Paperclip size={20} />
          </button>
          <div className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 flex items-center border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tanya seputar aturan K3..."
              className="w-full bg-transparent focus:outline-none text-slate-700 placeholder-slate-400 text-[15px]"
            />
          </div>
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full hover:from-emerald-600 hover:to-teal-700 disabled:opacity-40 disabled:saturate-50 active:scale-90 transition-all flex-shrink-0 shadow-lg shadow-emerald-600/30"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );

  // ---- News ----
  const NewsView = () => (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-4 flex items-center justify-between shadow-lg shadow-emerald-900/10 shrink-0 z-10">
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2"><Newspaper size={20} /> Berita & Pengumuman</h1>
          <p className="text-emerald-100 text-xs mt-0.5">Informasi HSSE Terkini</p>
        </div>
        {userRole === 'contributor' && (
          <button
            onClick={() => setShowNewsModal(true)}
            className="flex items-center space-x-1.5 bg-white/20 hover:bg-white/30 active:scale-95 px-3 py-2 rounded-xl text-sm font-semibold transition-all backdrop-blur-sm ring-1 ring-white/20"
          >
            <Plus size={16} />
            <span>Buat Berita</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth soft-scroll">
        {newsList.map((news) => {
          const badge = TYPE_BADGE[news.type] || TYPE_BADGE.info;
          const BadgeIcon = badge.icon;
          return (
            <div key={news.id} onClick={() => setSelectedNews(news)} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden relative group">
              {/* Image Header for News Item */}
              <div className="w-full h-40 bg-slate-200 relative overflow-hidden">
                <NewsImage src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                {/* Category Badge on Top of Image */}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold text-white backdrop-blur-sm shadow-sm ${badge.cls}/90`}>
                    <BadgeIcon size={10} className="mr-1" /> {news.category}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-slate-800 text-base leading-snug mb-1.5">{news.title}</h3>
                <p className="text-slate-400 text-xs mb-2.5 font-medium">{news.date}</p>
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">{news.summary}</p>
                <div className="flex items-center text-emerald-600 text-xs font-bold">
                  Baca selengkapnya
                  <ChevronRight size={14} className="ml-0.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Screen News Detail Modal */}
      {selectedNews && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col animate-slide-up overflow-hidden">
          {/* Header Action */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/60 to-transparent">
             <button onClick={() => setSelectedNews(null)} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 active:scale-90 transition-all">
                <ChevronLeft size={24} />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto pb-8 soft-scroll">
            {/* Header Image */}
            <div className="w-full h-64 md:h-80 relative">
              <NewsImage src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

              {/* Title positioned over image bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase ${(TYPE_BADGE[selectedNews.type] || TYPE_BADGE.info).cls}`}>{selectedNews.category}</span>
                  <span className="text-white/80 text-xs font-medium">{selectedNews.date}</span>
                </div>
                <h1 className="text-2xl font-bold text-white leading-tight">{selectedNews.title}</h1>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 bg-white -mt-4 rounded-t-3xl relative z-10">
              <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line leading-relaxed">
                {selectedNews.content}
              </div>

              {/* Carousel / Galeri Lampiran */}
              {selectedNews.carousel && selectedNews.carousel.length > 0 && (
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
                    <ImageIcon size={16} className="mr-2 text-emerald-600" />
                    Galeri Lampiran
                  </h3>
                  <div className="flex overflow-x-auto space-x-4 pb-4 snap-x hide-scrollbar">
                    {selectedNews.carousel.map((item, idx) => (
                      <div key={idx} className="snap-center flex-shrink-0 flex flex-col w-48">
                        <NewsImage
                          src={item.url}
                          alt={`Carousel ${idx}`}
                          className="w-48 h-32 object-cover rounded-xl shadow-sm border border-slate-200"
                        />
                        {item.caption && (
                          <p className="text-xs text-slate-500 mt-2 text-center italic px-1 line-clamp-2">
                            {item.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ---- Admin / Knowledge Base ----
  const AdminView = () => (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-5 py-4 flex items-center justify-between shadow-lg shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center ring-1 ring-white/15">
            <ShieldCheck size={20} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">Tabah Darma · Security</h1>
            <p className="text-slate-300 text-[11px] font-medium tracking-wide">Contributor Panel • HSSE Shipping & Marine</p>
          </div>
        </div>
        <button
          onClick={() => setShowInfoPopup(true)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <Info size={20} className="text-slate-300" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth soft-scroll">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} className="text-amber-600" />
          </div>
          <div>
            <h3 className="text-amber-800 font-bold text-sm mb-1">Status Knowledge Base</h3>
            <p className="text-amber-700 text-xs leading-relaxed">
              Pilih dokumen yang ingin diaktifkan. Chatbot akan menjadikan dokumen yang tercentang sebagai sumber rujukan utama untuk menjawab pertanyaan pekerja.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Daftar Pedoman Tersedia</h2>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {documents.filter(d => d.isActive).length}/{documents.length} aktif
            </span>
          </div>
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => toggleDocument(doc.id)}
              className={`rounded-2xl p-4 border-2 transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99] ${
                doc.isActive
                  ? 'border-emerald-400 bg-gradient-to-r from-emerald-50 to-white shadow-sm shadow-emerald-100'
                  : 'border-slate-100 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-4 overflow-hidden">
                <div className={`p-2.5 rounded-xl flex-shrink-0 transition-colors ${doc.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                  <FileText size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`font-semibold text-sm truncate ${doc.isActive ? 'text-slate-800' : 'text-slate-600'}`}>
                    {doc.name}
                  </p>
                  <p className={`text-[11px] font-medium mt-0.5 flex items-center gap-1 ${doc.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {doc.isActive ? <><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Sedang Dipakai AI</> : 'Nonaktif'}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 ml-3">
                {doc.isActive ? (
                  <CheckCircle2 size={24} className="text-emerald-500" />
                ) : (
                  <Circle size={24} className="text-slate-300 group-hover:text-slate-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Popup Modal */}
      {showInfoPopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowInfoPopup(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-center">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-2 ring-1 ring-white/15">
                <Info size={26} className="text-blue-400" />
              </div>
              <h3 className="text-white font-bold text-lg">Informasi Akses Divisi</h3>
            </div>
            <div className="p-6 text-center">
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Anda merupakan divisi <strong className="text-slate-800">HSSE - Security Pertamina Patra Niaga</strong>. Dokumen yang bisa Anda pilih hanyalah yang terkait dengan divisi Anda.
              </p>
              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                Apabila ada perubahan divisi harap hubungi admin pusat di:<br/>
                <a href="mailto:admin@pertamina.com" className="text-blue-600 font-semibold mt-1 inline-block">admin@pertamina.com</a>
              </p>
              <button
                onClick={() => setShowInfoPopup(false)}
                className="mt-6 w-full py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl font-semibold text-sm hover:from-slate-900 hover:to-black active:scale-[0.98] transition-all"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-300 via-slate-200 to-slate-300 sm:p-4">
        <div className="w-full sm:w-[400px] h-full sm:h-[820px] overflow-hidden flex flex-col relative sm:rounded-[2.8rem] bg-slate-900 sm:border-[10px] border-slate-900 sm:shadow-[0_30px_70px_-15px_rgba(15,23,42,0.5)] sm:ring-1 sm:ring-slate-300">
          {LoginView()}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-300 via-slate-200 to-slate-300 sm:p-4">
      <div className="w-full sm:w-[400px] h-full sm:h-[820px] bg-white overflow-hidden flex flex-col relative sm:rounded-[2.8rem] border-slate-900 sm:border-[10px] sm:shadow-[0_30px_70px_-15px_rgba(15,23,42,0.5)] sm:ring-1 sm:ring-slate-300">
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'chat' && ChatView()}
          {activeTab === 'news' && NewsView()}
          {activeTab === 'admin' && userRole === 'contributor' && AdminView()}
        </div>

        {/* Global News Create Modal */}
        {showNewsModal && (
          <div className="absolute inset-0 z-[60] bg-white flex flex-col animate-slide-up">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 flex items-center justify-between text-white shrink-0 shadow-md relative z-10">
              <div className="flex items-center space-x-2">
                <button onClick={() => setShowNewsModal(false)} className="p-1 hover:bg-white/15 rounded-lg transition-colors"><X size={20} /></button>
                <h2 className="font-bold text-sm">Buat Berita Baru</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 pb-24 bg-slate-50 soft-scroll">
              <form id="addNewsForm" onSubmit={handleAddNews} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Judul Berita</label>
                  <input required type="text" value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none bg-white" placeholder="Masukkan judul..." />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kategori Label</label>
                  <select value={newsForm.category} onChange={e => setNewsForm({...newsForm, category: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none bg-white">
                    <option value="Info">Informasi Umum</option>
                    <option value="Regulasi">Regulasi & Aturan</option>
                    <option value="Pencapaian">Pencapaian</option>
                    <option value="Peringatan">Peringatan / Bahaya</option>
                  </select>
                </div>

                {/* Input Upload Gambar Header */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Gambar Header (Upload)</label>
                  <div className="flex items-center space-x-3">
                    {newsForm.headerImage && (
                      <img src={newsForm.headerImage} alt="Header Preview" className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
                    )}
                    <div className="relative flex-1">
                      <UploadCloud size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeaderImageUpload}
                        className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Input Galeri Foto Dinamis */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Galeri Lampiran & Keterangan</label>
                    <button type="button" onClick={handleAddCarouselItem} className="text-xs text-emerald-600 font-bold flex items-center hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg transition-colors">
                      <Plus size={14} className="mr-0.5"/> Tambah Foto
                    </button>
                  </div>
                  <div className="space-y-3">
                    {newsForm.carousel.map((item, index) => (
                      <div key={index} className="p-3 border border-slate-100 bg-white shadow-sm rounded-xl flex items-start space-x-3 relative">
                        <button type="button" onClick={() => handleRemoveCarouselItem(index)} className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors z-10">
                          <X size={14} />
                        </button>

                        {/* Kotak Upload Gambar (Klik pada kotak) */}
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden group">
                          {item.url ? (
                            <>
                              <img src={item.url} alt="Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <UploadCloud size={16} className="text-white mb-0.5" />
                                <span className="text-[8px] text-white font-medium">Ganti</span>
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                              <Plus size={18} className="mb-1" />
                              <ImageIcon size={16} />
                            </div>
                          )}

                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleCarouselImageUpload(index, e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
                            title="Klik untuk memilih atau mengganti gambar"
                          />
                        </div>

                        {/* Field Keterangan di Samping Kanan */}
                        <div className="flex-1 pr-6 h-20">
                          <textarea
                            value={item.caption}
                            onChange={(e) => handleCarouselCaptionChange(index, e.target.value)}
                            placeholder="Tulis keterangan foto di sini..."
                            className="w-full h-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none bg-slate-50"
                          />
                        </div>
                      </div>
                    ))}
                    {newsForm.carousel.length === 0 && (
                      <div className="text-xs text-slate-400 italic text-center py-3 bg-white border border-dashed border-slate-300 rounded-xl">Belum ada foto galeri. Klik tambah foto.</div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Isi / Ringkasan Info</label>
                  <textarea required rows="4" value={newsForm.summary} onChange={e => setNewsForm({...newsForm, summary: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none resize-none bg-white" placeholder="Ketik isi berita..."></textarea>
                </div>
              </form>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-10">
              <button type="submit" form="addNewsForm" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-500/25 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] transition-all flex items-center justify-center space-x-2">
                <CheckCircle2 size={18} />
                <span>Publish Info</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="bg-white/95 backdrop-blur border-t border-slate-200 flex justify-around items-center px-2 py-1.5 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-40 shrink-0">
          {[
            { key: 'chat', label: 'Tanya AI', Icon: MessageSquare },
            { key: 'news', label: 'Berita', Icon: Newspaper },
            ...(userRole === 'contributor' ? [{ key: 'admin', label: 'Kelola', Icon: FileText }] : [])
          ].map(({ key, label, Icon }) => {
            const active = activeTab === key;
            return (
              <button key={key} onClick={() => setActiveTab(key)} className="flex flex-col items-center w-full py-1 group">
                <div className={`flex items-center justify-center w-14 h-8 rounded-2xl transition-all duration-200 ${active ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-50'}`}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] mt-0.5 transition-colors ${active ? 'font-bold text-emerald-700' : 'font-semibold text-slate-400'}`}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
