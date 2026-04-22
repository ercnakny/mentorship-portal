import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, Play, Plus, Video, Trash2, ExternalLink, FileText, Upload, X, Link2, Loader2, Save, Check } from 'lucide-react';
import { saveUserProgress } from '../firebase/client';

const StepPage = ({ section, step, user, onNavigate, onUserUpdate }) => {
  const [isCompleted, setIsCompleted] = useState(
    user.completedSteps?.[section.id]?.includes(step.id) || false
  );
  const [videos, setVideos] = useState([{ id: 1, url: '', title: '' }]);
  const [links, setLinks] = useState([{ id: 1, url: '', title: '' }]);
  const [pdfs, setPdfs] = useState([{ id: 1, name: '', file: null }]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const currentIndex = section.steps.findIndex(s => s.id === step.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < section.steps.length - 1;
  const prevStep = hasPrev ? section.steps[currentIndex - 1] : null;
  const nextStep = hasNext ? section.steps[currentIndex + 1] : null;

  const isAdmin = user.role === 'admin';

  const handleComplete = async () => {
    setSaving(true);
    
    try {
      // Firestore'a kaydet
      const updatedCompletedSteps = {
        ...user.completedSteps,
        [section.id]: [...(user.completedSteps?.[section.id] || []), step.id]
      };
      
      await saveUserProgress(user.uid, {
        completedSteps: updatedCompletedSteps
      });
      
      // Yerel state güncelle
      setIsCompleted(true);
      setSaveSuccess(true);
      
      // Parent'a bildir
      if (onUserUpdate) {
        onUserUpdate({
          ...user,
          completedSteps: updatedCompletedSteps
        });
      }
      
      // Animasyon 2 saniye sonra bitsin
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Progress save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (nextStep) {
      onNavigate('step', section, nextStep);
    } else {
      onNavigate('section', section);
    }
  };

  const handlePrev = () => {
    if (prevStep) {
      onNavigate('step', section, prevStep);
    } else {
      onNavigate('section', section);
    }
  };

  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const getLoomId = (url) => {
    const match = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const getEmbedType = (url) => {
    if (getYouTubeId(url)) return 'youtube';
    if (getLoomId(url)) return 'loom';
    return null;
  };

  const getVideoTitle = (url) => {
    if (getYouTubeId(url)) return 'YouTube Video';
    if (getLoomId(url)) return 'Loom Video';
    return 'Video';
  };

  // Video functions
  const addVideo = () => {
    setVideos([...videos, { id: Date.now(), url: '', title: '' }]);
  };

  const updateVideo = (id, field, value) => {
    setVideos(videos.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const deleteVideo = (id) => {
    if (videos.length > 1) {
      setVideos(videos.filter(v => v.id !== id));
    }
  };

  // Link functions
  const addLink = () => {
    setLinks([...links, { id: Date.now(), url: '', title: '' }]);
  };

  const updateLink = (id, field, value) => {
    setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const deleteLink = (id) => {
    if (links.length > 1) {
      setLinks(links.filter(l => l.id !== id));
    }
  };

  // PDF functions
  const handlePdfUpload = (id, file) => {
    setPdfs(pdfs.map(p => p.id === id ? { ...p, name: file.name, file: URL.createObjectURL(file) } : p));
  };

  const addPdf = () => {
    setPdfs([...pdfs, { id: Date.now(), name: '', file: null }]);
  };

  const deletePdf = (id) => {
    if (pdfs.length > 1) {
      setPdfs(pdfs.filter(p => p.id !== id));
    }
  };

  // Parse content to make links clickable
  const renderContent = (content) => {
    if (!content) return null;
    const urlRegex = /(https?:\/\/[^\s<]+)/g;
    return content.split(urlRegex).map((part, i) => {
      if (i % 2 === 1) {
        return `<a href="${part}" target="_blank" rel="noopener noreferrer" class="text-primary-400 hover:text-primary-300 underline decoration-primary-400/50 hover:decoration-primary-300 transition-colors">${part}</a>`;
      }
      return part;
    }).join('');
  };

  // Get display title for a link
  const getLinkDisplayTitle = (link) => {
    if (link.title) return link.title;
    if (link.url) {
      try {
        const url = new URL(link.url);
        return url.hostname + url.pathname.substring(0, 30);
      } catch {
        return link.url.substring(0, 40);
      }
    }
    return 'Link';
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div className="mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <button 
            onClick={() => onNavigate('section', section)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{section.title}</span>
          </button>
          
          <div className="flex items-center gap-4">
            <motion.div 
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${isCompleted ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-primary-500/20 text-primary-400'}`}
              animate={saveSuccess ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {saveSuccess || isCompleted ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <Check className="w-6 h-6" />
                </motion.div>
              ) : (
                currentIndex + 1
              )}
            </motion.div>
            <div>
              <p className="text-gray-400 text-sm">{section.title} • Adım {currentIndex + 1}/{section.steps.length}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{step.title}</h1>
            </div>
          </div>
        </motion.div>

        {/* Content Card */}
        <motion.div className="bg-dark-200 rounded-2xl p-6 md:p-8 border border-dark-100 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          
          {/* Videos Section */}
          {videos.some(v => v.url || isAdmin) && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Video className="w-5 h-5 text-primary-400" />
                Videolar
              </h3>
              
              {/* Video List - Client View */}
              <div className="space-y-3">
                {videos.filter(v => v.url && getEmbedType(v.url)).map((video, idx) => (
                  <div key={video.id} className="bg-dark-100 rounded-xl overflow-hidden">
                    <div className="aspect-video">
                      {getYouTubeId(video.url) && (
                        <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${getYouTubeId(video.url)}`} frameBorder="0" allowFullScreen />
                      )}
                      {getLoomId(video.url) && (
                        <iframe className="w-full h-full" src={`https://www.loom.com/embed/${getLoomId(video.url)}`} frameBorder="0" allowFullScreen />
                      )}
                    </div>
                    {video.title && (
                      <div className="p-3 bg-dark-100 border-t border-dark-200">
                        <p className="text-white text-sm font-medium">{video.title}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Admin: Add Video */}
              {isAdmin && (
                <div className="mt-4 space-y-3">
                  {videos.map((video, idx) => (
                    <div key={video.id} className="bg-dark-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm font-medium">Video {idx + 1}</span>
                        {videos.length > 1 && (
                          <button onClick={() => deleteVideo(video.id)} className="text-red-400 hover:text-red-300">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <input 
                        type="text"
                        value={video.title}
                        onChange={(e) => updateVideo(video.id, 'title', e.target.value)}
                        placeholder="Video başlığı (opsiyonel)"
                        className="w-full bg-dark-200 border border-dark-200 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm mb-2"
                      />
                      <input 
                        type="url"
                        value={video.url}
                        onChange={(e) => updateVideo(video.id, 'url', e.target.value)}
                        placeholder="YouTube veya Loom linki..."
                        className="w-full bg-dark-200 border border-dark-200 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
                      />
                    </div>
                  ))}
                  <button onClick={addVideo} className="w-full py-2 border-2 border-dashed border-dark-100 rounded-xl text-gray-400 hover:text-white hover:border-primary-500/50 flex items-center justify-center gap-2 text-sm transition-colors">
                    <Plus className="w-4 h-4" />
                    Video Ekle
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Links Section - Client View */}
          {links.some(l => l.url) && (
            <div className="mb-6 pt-6 border-t border-dark-100">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-primary-400" />
                Linkler
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {links.filter(l => l.url).map((link) => (
                  <a 
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-dark-100 rounded-xl hover:bg-dark-100/80 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                      <ExternalLink className="w-5 h-5 text-primary-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium truncate group-hover:text-primary-400 transition-colors">
                        {getLinkDisplayTitle(link)}
                      </p>
                      {link.title && (
                        <p className="text-gray-500 text-xs truncate">{link.url}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* PDFs Section - Client View */}
          {pdfs.some(p => p.file) && (
            <div className="mb-6 pt-6 border-t border-dark-100">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-400" />
                PDF Dosyaları
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pdfs.filter(p => p.file).map((pdf) => (
                  <a 
                    key={pdf.id}
                    href={pdf.file}
                    download={pdf.name}
                    className="flex items-center gap-3 p-4 bg-dark-100 rounded-xl hover:bg-dark-100/80 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium truncate group-hover:text-primary-400 transition-colors">
                        {pdf.name.replace('.pdf', '')}
                      </p>
                      <p className="text-gray-500 text-xs">PDF • İndirmek için tıkla</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Admin: Links & PDFs Input Section */}
          {isAdmin && (
            <>
              {/* Admin Links Input */}
              <div className="mb-6 pt-6 border-t border-dark-100">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-primary-400" />
                  Link Ekle (Admin)
                </h3>

                <div className="space-y-3">
                  {links.map((link, idx) => (
                    <div key={link.id} className="bg-dark-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm">Link {idx + 1}</span>
                        {links.length > 1 && (
                          <button onClick={() => deleteLink(link.id)} className="text-red-400 hover:text-red-300">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <input 
                        type="text"
                        value={link.title}
                        onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                        placeholder="Link başlığı (müşteri burayı görecek)"
                        className="w-full bg-dark-200 border border-dark-200 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm mb-2"
                      />
                      <input 
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-dark-200 border border-dark-200 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
                      />
                    </div>
                  ))}
                  <button onClick={addLink} className="w-full py-2 border-2 border-dashed border-dark-100 rounded-xl text-gray-400 hover:text-white hover:border-primary-500/50 flex items-center justify-center gap-2 text-sm transition-colors">
                    <Plus className="w-4 h-4" />
                    Link Ekle
                  </button>
                </div>
              </div>

              {/* Admin PDFs Input */}
              <div className="mb-6 pt-6 border-t border-dark-100">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-400" />
                  PDF Ekle (Admin)
                </h3>
                <div className="space-y-3">
                  {pdfs.map((pdf, idx) => (
                    <div key={pdf.id} className="bg-dark-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm">PDF {idx + 1}</span>
                        {pdfs.length > 1 && (
                          <button onClick={() => deletePdf(pdf.id)} className="text-red-400 hover:text-red-300">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {pdf.file ? (
                        <div className="flex items-center justify-between bg-dark-200 rounded-lg p-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <FileText className="w-5 h-5 text-primary-400 flex-shrink-0" />
                            <span className="text-white text-sm truncate">{pdf.name}</span>
                          </div>
                          <a href={pdf.file} download={pdf.name} className="text-primary-400 hover:text-primary-300 flex-shrink-0">
                            <Upload className="w-4 h-4" />
                          </a>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 py-4 border-2 border-dashed border-dark-200 rounded-lg cursor-pointer hover:border-primary-500/50 transition-colors">
                          <Upload className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-500 text-sm">PDF seç</span>
                          <input type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files[0] && handlePdfUpload(pdf.id, e.target.files[0])} />
                        </label>
                      )}
                    </div>
                  ))}
                  <button onClick={addPdf} className="w-full py-2 border-2 border-dashed border-dark-100 rounded-xl text-gray-400 hover:text-white hover:border-primary-500/50 flex items-center justify-center gap-2 text-sm transition-colors">
                    <Plus className="w-4 h-4" />
                    PDF Ekle
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Yapilacaklar Section */}
          <div className="pt-6 border-t border-dark-100">
            <h3 className="text-white font-semibold mb-4">Yapılacaklar</h3>
            <p className="text-gray-400 mb-4">{step.description}</p>
            <div 
              className="prose prose-invert prose-sm max-w-none text-gray-300"
              dangerouslySetInnerHTML={{ __html: renderContent(step.content) || '<p class="text-gray-500">Bu adım için içerik yakında eklenecek.</p>' }}
            />
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-1">
            {section.steps.map((s, i) => (
              <div 
                key={s.id}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i <= currentIndex 
                    ? s.id === step.id && isCompleted
                      ? 'bg-emerald-500'
                      : s.id === step.id
                        ? 'bg-primary-500'
                        : user.completedSteps?.[section.id]?.includes(s.id)
                          ? 'bg-emerald-500'
                          : 'bg-primary-500/50'
                    : 'bg-dark-300'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div className="flex items-center justify-between gap-4 pb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <button 
            onClick={handlePrev}
            disabled={!hasPrev && currentIndex === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 text-sm ${
              hasPrev || currentIndex > 0
                ? 'bg-dark-200 hover:bg-dark-100 text-white border border-dark-100'
                : 'bg-dark-300 text-gray-500 cursor-not-allowed border border-dark-300'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Önceki
          </button>

          <div className="flex items-center gap-3">
            {!isCompleted && (
              <motion.button 
                onClick={handleComplete} 
                disabled={saving}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 text-sm ${
                  saving 
                    ? 'bg-dark-300 text-gray-500 cursor-not-allowed' 
                    : 'btn-primary'
                }`}
                whileHover={saving ? {} : { scale: 1.02 }}
                whileTap={saving ? {} : { scale: 0.98 }}
              >
                {saving ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Kaydediliyor...
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    Kaydedildi
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Tamamla
                  </>
                )}
              </motion.button>
            )}
            
            <button onClick={handleNext} className="btn-primary text-sm py-3">
              {isCompleted ? (hasNext ? 'Sonraki' : 'Bitir') : 'Geç'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StepPage;
