import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, Play, Plus, Edit2, Video, Trash2 } from 'lucide-react';

const StepPage = ({ section, step, user, onNavigate }) => {
  const [isCompleted, setIsCompleted] = useState(
    user.completedSteps?.[section.id]?.includes(step.id) || false
  );
  const [videos, setVideos] = useState([{ id: 1, url: '' }]);
  
  const currentIndex = section.steps.findIndex(s => s.id === step.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < section.steps.length - 1;
  const prevStep = hasPrev ? section.steps[currentIndex - 1] : null;
  const nextStep = hasNext ? section.steps[currentIndex + 1] : null;

  const isAdmin = user.role === 'admin';

  const handleComplete = () => {
    setIsCompleted(true);
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

  const addVideo = () => {
    setVideos([...videos, { id: Date.now(), url: '' }]);
  };

  const updateVideo = (id, url) => {
    setVideos(videos.map(v => v.id === id ? { ...v, url } : v));
  };

  const deleteVideo = (id) => {
    if (videos.length > 1) {
      setVideos(videos.filter(v => v.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="w-full max-w-4xl mx-auto px-6 pt-6">
        <motion.div className="mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <button 
            onClick={() => onNavigate('section', section)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{section.title}</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-primary-500/20 text-primary-400'}`}>
              {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : currentIndex + 1}
            </div>
            <div>
              <p className="text-gray-400 text-sm">{section.title} • Adım {currentIndex + 1}/{section.steps.length}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{step.title}</h1>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-6">
        <motion.div className="bg-dark-200 rounded-2xl p-6 md:p-8 border border-dark-100 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          
          {/* Videos */}
          <div className="space-y-4 mb-6">
            {videos.map((video, idx) => (
              <div key={video.id}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Video className="w-5 h-5 text-primary-400" />
                    Video {idx + 1}
                  </h3>
                  {isAdmin && videos.length > 1 && (
                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Videoyu Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {/* Video URL Input */}
                <input 
                  type="text"
                  value={video.url}
                  onChange={(e) => updateVideo(video.id, e.target.value)}
                  placeholder="YouTube veya Loom linki..."
                  className="w-full bg-dark-100 border border-dark-100 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
                
                {/* Video Display */}
                {getEmbedType(video.url) ? (
                  <div className="aspect-video bg-dark-100 rounded-xl overflow-hidden mt-3">
                    {getYouTubeId(video.url) && (
                      <iframe 
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${getYouTubeId(video.url)}`}
                        title="YouTube video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                    {getLoomId(video.url) && (
                      <iframe 
                        className="w-full h-full"
                        src={`https://www.loom.com/embed/${getLoomId(video.url)}`}
                        title="Loom video"
                        frameBorder="0"
                        allowFullScreen
                      />
                    )}
                  </div>
                ) : video.url === '' && idx === 0 ? (
                  /* Placeholder for first video */
                  <div className="aspect-video bg-dark-100 rounded-xl flex items-center justify-center mt-3">
                    <div className="text-center">
                      <Play className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Video linki eklendiğinde görünecek</p>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {/* Add Video Button - Only for Admin */}
          {isAdmin && (
            <button
              onClick={addVideo}
              className="w-full py-3 border-2 border-dashed border-dark-100 rounded-xl text-gray-400 hover:text-white hover:border-primary-500/50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Yeni Video Ekle
            </button>
          )}

          {/* Divider */}
          <div className="border-t border-dark-100 my-6"></div>

          {/* Yapilacaklar */}
          <div>
            <h3 className="text-white font-semibold mb-3">Yapılacaklar</h3>
            <p className="text-gray-400 mb-4">{step.description}</p>
            <div className="prose prose-invert prose-sm max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: step.content || '<p>Bu adım için içerik yakında eklenecek.</p>' }} />
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
              <button onClick={handleComplete} className="btn-primary text-sm py-3">
                <CheckCircle2 className="w-4 h-4" />
                Tamamla
              </button>
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