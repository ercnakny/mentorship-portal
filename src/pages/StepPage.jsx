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
      const updatedCompletedSteps = {
        ...user.completedSteps,
        [section.id]: [...(user.completedSteps?.[section.id] || []), step.id]
      };
      
      await saveUserProgress(user.uid, {
        completedSteps: updatedCompletedSteps
      });
      
      setIsCompleted(true);
      setSaveSuccess(true);
      
      if (onUserUpdate) {
        onUserUpdate({
          ...user,
          completedSteps: updatedCompletedSteps
        });
      }
      
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
    // First, strip any existing HTML tags that are raw text
    let cleanContent = content
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');
    
    const urlRegex = /(https?:\/\/[^\s<]+)/g;
    return cleanContent.split(urlRegex).map((part, i) => {
      if (i % 2 === 1) {
        return `<a href="${part}" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: underline; text-decoration-color: rgba(56, 189, 248, 0.5);">${part}</a>`;
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

  // Styles
  const pageStyle = { minHeight: '100vh', padding: '32px', maxWidth: '1200px', margin: '0 auto' };
  const contentStyle = { maxWidth: '100%' };
  const cardStyle = { backgroundColor: '#1a2234', borderRadius: '16px', border: '1px solid #2d3a4f', padding: '24px' };
  const sectionTitleStyle = { fontSize: '16px', fontWeight: 600, color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' };
  const labelStyle = { fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '8px', display: 'block' };
  const inputStyle = {
    width: '100%',
    height: '44px',
    backgroundColor: '#151c2c',
    border: '2px solid #2d3a4f',
    borderRadius: '12px',
    padding: '0 12px',
    fontSize: '14px',
    color: 'white',
    outline: 'none',
    transition: 'all 0.2s'
  };
  const inputMultilineStyle = {
    ...inputStyle,
    height: 'auto',
    minHeight: '80px',
    padding: '12px',
    resize: 'vertical'
  };

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        {/* Header */}
        <motion.div style={{ marginBottom: '24px' }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <button 
            onClick={() => onNavigate('section', section)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#9ca3af',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '16px',
              padding: 0,
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            <span>{section.title}</span>
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.div 
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                backdropFilter: 'blur(8px)',
                border: '1px solid'
              }}
              animate={saveSuccess ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.3 }}
              className={isCompleted ? 'completed' : 'active'}
            >
              {saveSuccess || isCompleted ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <Check style={{ width: '28px', height: '28px', color: '#34d399' }} />
                </motion.div>
              ) : (
                <span style={{ color: '#38bdf8' }}>{currentIndex + 1}</span>
              )}
            </motion.div>
            <div>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>{section.title} • Adım {currentIndex + 1}/{section.steps.length}</p>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{step.title}</h1>
            </div>
          </div>
        </motion.div>

        {/* Content Card */}
        <motion.div style={cardStyle} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          
          {/* Videos Section */}
          {videos.some(v => v.url || isAdmin) && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={sectionTitleStyle}>
                <Video style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
                Videolar
              </h3>
              
              {/* Video List - Client View */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {videos.filter(v => v.url && getEmbedType(v.url)).map((video) => (
                  <div key={video.id} style={{ backgroundColor: '#151c2c', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ aspectRatio: '16/9' }}>
                      {getYouTubeId(video.url) && (
                        <iframe 
                          style={{ width: '100%', height: '100%', border: 'none' }}
                          src={`https://www.youtube.com/embed/${getYouTubeId(video.url)}`}
                          allowFullScreen
                        />
                      )}
                      {getLoomId(video.url) && (
                        <iframe 
                          style={{ width: '100%', height: '100%', border: 'none' }}
                          src={`https://www.loom.com/embed/${getLoomId(video.url)}`}
                          allowFullScreen
                        />
                      )}
                    </div>
                    {video.title && (
                      <div style={{ padding: '12px', backgroundColor: '#151c2c', borderTop: '1px solid #2d3a4f' }}>
                        <p style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{video.title}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Admin: Add Video */}
              {isAdmin && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {videos.map((video, idx) => (
                    <div key={video.id} style={{ backgroundColor: '#151c2c', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: 500 }}>Video {idx + 1}</span>
                        {videos.length > 1 && (
                          <button 
                            onClick={() => deleteVideo(video.id)} 
                            style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            <X style={{ width: '16px', height: '16px' }} />
                          </button>
                        )}
                      </div>
                      <input 
                        type="text"
                        value={video.title}
                        onChange={(e) => updateVideo(video.id, 'title', e.target.value)}
                        placeholder="Video başlığı (opsiyonel)"
                        style={{ ...inputStyle, marginBottom: '8px' }}
                      />
                      <input 
                        type="url"
                        value={video.url}
                        onChange={(e) => updateVideo(video.id, 'url', e.target.value)}
                        placeholder="YouTube veya Loom linki..."
                        style={inputStyle}
                      />
                    </div>
                  ))}
                  <button 
                    onClick={addVideo} 
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px dashed #2d3a4f',
                      borderRadius: '12px',
                      backgroundColor: 'transparent',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#9ca3af';
                      e.currentTarget.style.borderColor = '#2d3a4f';
                    }}
                  >
                    <Plus style={{ width: '16px', height: '16px' }} />
                    Video Ekle
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Links Section */}
          {links.some(l => l.url) && (
            <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid #2d3a4f' }}>
              <h3 style={sectionTitleStyle}>
                <Link2 style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
                Linkler
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                {links.filter(l => l.url).map((link) => (
                  <a 
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      backgroundColor: '#151c2c',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(21, 28, 44, 0.8)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#151c2c'}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(14, 165, 233, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <ExternalLink style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ color: 'white', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {getLinkDisplayTitle(link)}
                      </p>
                      {link.title && (
                        <p style={{ color: '#6b7280', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.url}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* PDFs Section */}
          {pdfs.some(p => p.file) && (
            <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid #2d3a4f' }}>
              <h3 style={sectionTitleStyle}>
                <FileText style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
                PDF Dosyaları
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                {pdfs.filter(p => p.file).map((pdf) => (
                  <a 
                    key={pdf.id}
                    href={pdf.file}
                    download={pdf.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      backgroundColor: '#151c2c',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(21, 28, 44, 0.8)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#151c2c'}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <FileText style={{ width: '20px', height: '20px', color: '#34d399' }} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ color: 'white', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {pdf.name.replace('.pdf', '')}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '12px' }}>PDF • İndirmek için tıkla</p>
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
              <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid #2d3a4f' }}>
                <h3 style={sectionTitleStyle}>
                  <Link2 style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
                  Link Ekle (Admin)
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {links.map((link, idx) => (
                    <div key={link.id} style={{ backgroundColor: '#151c2c', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ color: '#9ca3af', fontSize: '14px' }}>Link {idx + 1}</span>
                        {links.length > 1 && (
                          <button onClick={() => deleteLink(link.id)} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            <X style={{ width: '16px', height: '16px' }} />
                          </button>
                        )}
                      </div>
                      <input 
                        type="text"
                        value={link.title}
                        onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                        placeholder="Link başlığı (müşteri burayı görecek)"
                        style={{ ...inputStyle, marginBottom: '8px' }}
                      />
                      <input 
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        placeholder="https://..."
                        style={inputStyle}
                      />
                    </div>
                  ))}
                  <button 
                    onClick={addLink} 
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px dashed #2d3a4f',
                      borderRadius: '12px',
                      backgroundColor: 'transparent',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#9ca3af';
                      e.currentTarget.style.borderColor = '#2d3a4f';
                    }}
                  >
                    <Plus style={{ width: '16px', height: '16px' }} />
                    Link Ekle
                  </button>
                </div>
              </div>

              {/* Admin PDFs Input */}
              <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid #2d3a4f' }}>
                <h3 style={sectionTitleStyle}>
                  <FileText style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
                  PDF Ekle (Admin)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pdfs.map((pdf, idx) => (
                    <div key={pdf.id} style={{ backgroundColor: '#151c2c', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ color: '#9ca3af', fontSize: '14px' }}>PDF {idx + 1}</span>
                        {pdfs.length > 1 && (
                          <button onClick={() => deletePdf(pdf.id)} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            <X style={{ width: '16px', height: '16px' }} />
                          </button>
                        )}
                      </div>
                      {pdf.file ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1a2234', borderRadius: '12px', padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                            <FileText style={{ width: '20px', height: '20px', color: '#38bdf8', flexShrink: 0 }} />
                            <span style={{ color: 'white', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pdf.name}</span>
                          </div>
                          <a href={pdf.file} download={pdf.name} style={{ color: '#38bdf8', flexShrink: 0 }}>
                            <Upload style={{ width: '16px', height: '16px' }} />
                          </a>
                        </div>
                      ) : (
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '16px',
                          border: '2px dashed #2d3a4f',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}>
                          <Upload style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                          <span style={{ color: '#6b7280', fontSize: '14px' }}>PDF seç</span>
                          <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => e.target.files[0] && handlePdfUpload(pdf.id, e.target.files[0])} />
                        </label>
                      )}
                    </div>
                  ))}
                  <button 
                    onClick={addPdf} 
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px dashed #2d3a4f',
                      borderRadius: '12px',
                      backgroundColor: 'transparent',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#9ca3af';
                      e.currentTarget.style.borderColor = '#2d3a4f';
                    }}
                  >
                    <Plus style={{ width: '16px', height: '16px' }} />
                    PDF Ekle
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Yapilacaklar Section */}
          <div style={{ paddingTop: '24px', borderTop: '1px solid #2d3a4f' }}>
            <h3 style={{ ...sectionTitleStyle, marginBottom: '16px' }}>Yapılacaklar</h3>
            <p style={{ color: '#9ca3af', marginBottom: '16px' }}>{step.description}</p>
            <div 
              style={{ color: '#d1d5db', fontSize: '14px', lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{ __html: renderContent(step.content) || '<p style="color: #6b7280">Bu adım için içerik yakında eklenecek.</p>' }}
            />
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div style={{ marginBottom: '24px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {section.steps.map((s, i) => {
              const isDone = i < currentIndex || (i === currentIndex && isCompleted);
              const isCurrent = i === currentIndex;
              const isPending = i > currentIndex;
              
              return (
                <div 
                  key={s.id}
                  style={{
                    height: '8px',
                    flex: 1,
                    borderRadius: '9999px',
                    transition: 'all 0.5s',
                    backgroundColor: isDone ? (isCurrent && isCompleted ? '#059669' : isCurrent ? '#0ea5e9' : 'rgba(16, 185, 129, 0.7)') : 
                               isCurrent ? '#0ea5e9' : '#151c2c'
                  }}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            gap: '16px', 
            paddingBottom: '32px' 
          }} 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
        >
          <button 
            onClick={handlePrev}
            disabled={!hasPrev && currentIndex === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.3s',
              ...((hasPrev || currentIndex > 0) 
                ? { backgroundColor: '#1a2234', color: 'white', border: '1px solid #2d3a4f', cursor: 'pointer' }
                : { backgroundColor: '#151c2c', color: '#6b7280', border: '1px solid #2d3a4f', cursor: 'not-allowed' })
            }}
          >
            <ChevronLeft style={{ width: '20px', height: '20px' }} />
            Önceki
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isCompleted && (
              <motion.button 
                onClick={handleComplete} 
                disabled={saving}
                whileHover={saving ? {} : { scale: 1.02 }}
                whileTap={saving ? {} : { scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  backgroundColor: saving ? '#151c2c' : '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.5 : 1,
                  transition: 'all 0.3s'
                }}
              >
                {saving ? (
                  <>
                    <motion.div
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: 'white',
                        borderRadius: '50%'
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Kaydediliyor...
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check style={{ width: '16px', height: '16px' }} />
                    Kaydedildi
                  </>
                ) : (
                  <>
                    <Save style={{ width: '16px', height: '16px' }} />
                    Tamamla
                  </>
                )}
              </motion.button>
            )}
            
            <button 
              onClick={handleNext} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 500,
                backgroundColor: '#0ea5e9',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0ea5e9'}
            >
              {isCompleted ? (hasNext ? 'Sonraki' : 'Bitir') : 'Geç'}
              <ChevronRight style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StepPage;
