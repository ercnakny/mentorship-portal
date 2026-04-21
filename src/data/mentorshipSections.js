// Mentörlük Bölümleri Yapılandırması
// Bu dosyayı düzenleyerek içerik ve süreleri yönetebilirsin

export const SECTIONS = [
  {
    id: 'teknik',
    title: 'Teknik',
    subtitle: 'Web sitesi ve teknik altyapı',
    icon: 'Wrench',
    duration: 2, // gün
    minDuration: 1, // minimum süre (bu süreden önce geçiş için onay gerekli)
    steps: [
      {
        id: 'teknik-1',
        title: 'Hesap Oluşturma',
        description: 'Lightfunnels ve GoDaddy hesaplarınızı oluşturun',
        content: `
          <h3>Yapılacaklar:</h3>
          <ul>
            <li>Lightfunnels hesabı oluşturun (app.lightfunnels.com)</li>
            <li>GoDaddy hesabı oluşturun</li>
            <li>Alan adınızı belirleyin</li>
          </ul>
        `
      },
      {
        id: 'teknik-2',
        title: 'Alan Adı Bağlantısı',
        description: 'Domain\'inizi bağlayın',
        content: `
          <h3>Yapılacaklar:</h3>
          <ul>
            <li>Alan adınızı Godaddy\'den satın alın</li>
            <li>DNS ayarlarını yapılandırın</li>
            <li>SSL sertifikasını aktifleştirin</li>
          </ul>
        `
      },
      {
        id: 'teknik-3',
        title: 'Temel Sayfa Ayarları',
        description: 'Site temel ayarlarını yapın',
        content: '<p>Temel sayfa yapılandırması...</p>'
      },
      {
        id: 'teknik-4',
        title: 'Tema Seçimi',
        description: 'Site temanızı seçin',
        content: '<p>Tema seçimi ve özelleştirme...</p>'
      },
      {
        id: 'teknik-5',
        title: 'Renk ve Logo',
        description: 'Marka kimliğinizi yansıtın',
        content: '<p>Renk ve logo ayarları...</p>'
      },
      {
        id: 'teknik-6',
        title: 'Header ve Footer',
        description: 'Site başlık ve alt kısımları',
        content: '<p>Header ve footer yapılandırması...</p>'
      },
      {
        id: 'teknik-7',
        title: 'Form Oluşturma',
        description: 'İletişim ve kayıt formları',
        content: '<p>Form oluşturma ve entegrasyon...</p>'
      },
      {
        id: 'teknik-8',
        title: 'Teknik Tamamlama',
        description: 'Son kontroller ve test',
        content: '<p>Son kontroller ve site testi...</p>'
      }
    ]
  },
  {
    id: 'urun',
    title: 'Ürün',
    subtitle: 'Dijital ürün oluşturma',
    icon: 'Package',
    duration: 15,
    minDuration: 6,
    steps: [
      {
        id: 'urun-1',
        title: 'Ürün Fikri Belirleme',
        description: 'Danışanınızın ürün fikrini belirleyin',
        content: '<p>Ürün fikri belirleme süreci...</p>'
      },
      {
        id: 'urun-2',
        title: 'Prompt Oluşturma',
        description: 'AI için prompt hazırlayın',
        content: '<p>Prompt oluşturma...</p>'
      },
      {
        id: 'urun-3',
        title: 'Ürün Geliştirme',
        description: 'Dijital ürünü geliştirin',
        content: '<p>Ürün geliştirme süreci...</p>'
      },
      {
        id: 'urun-4',
        title: 'Ürün Lansman',
        description: 'Ürünü piyasaya sunun',
        content: '<p>Ürün lansmanı...</p>'
      }
    ]
  },
  {
    id: 'icerik',
    title: 'İçerik',
    subtitle: 'İçerik stratejisi ve üretim',
    icon: 'FileText',
    duration: 7,
    minDuration: 3,
    steps: [
      {
        id: 'icerik-1',
        title: 'Hesap Analizi',
        description: 'Rakip hesapları analiz edin',
        content: '<p>Hesap analizi...</p>'
      },
      {
        id: 'icerik-2',
        title: 'İçerik Planlaması',
        description: 'İçerik takviminizi oluşturun',
        content: '<p>İçerik planlaması...</p>'
      },
      {
        id: 'icerik-3',
        title: 'İçerik Üretimi',
        description: 'Videolarınızı çekin',
        content: '<p>İçerik üretimi...</p>'
      }
    ]
  },
  {
    id: 'site',
    title: 'Site',
    subtitle: 'Landing page ve VSL',
    icon: 'Globe',
    duration: 3,
    minDuration: 2,
    steps: [
      {
        id: 'site-1',
        title: 'VSL Videosu',
        description: 'Satış videosunu hazırlayın',
        content: '<p>VSL videosu hazırlama...</p>'
      },
      {
        id: 'site-2',
        title: 'Landing Page',
        description: 'Satış sayfanızı oluşturun',
        content: '<p>Landing page oluşturma...</p>'
      },
      {
        id: 'site-3',
        title: 'Test ve Yayın',
        description: 'Siteyi test edin ve yayına alın',
        content: '<p>Test ve yayın...</p>'
      }
    ]
  },
  {
    id: 'reklam',
    title: 'Reklam',
    subtitle: 'Meta reklam kampanyaları',
    icon: 'Megaphone',
    duration: 3,
    minDuration: 2,
    steps: [
      {
        id: 'reklam-1',
        title: 'Reklam Hesabı',
        description: 'Meta reklam hesabınızı kurun',
        content: '<p>Reklam hesabı kurulumu...</p>'
      },
      {
        id: 'reklam-2',
        title: 'Kampanya Oluşturma',
        description: 'İlk kampanyalarınızı başlatın',
        content: '<p>Kampanya oluşturma...</p>'
      },
      {
        id: 'reklam-3',
        title: 'Optimizasyon',
        description: 'Reklamlarınızı optimize edin',
        content: '<p>Reklam optimizasyonu...</p>'
      }
    ]
  }
];

export const getSection = (id) => SECTIONS.find(s => s.id === id);
export const getStep = (sectionId, stepId) => {
  const section = getSection(sectionId);
  return section?.steps.find(s => s.id === stepId);
};
export const getTotalSteps = () => SECTIONS.reduce((acc, s) => acc + s.steps.length, 0);
export const getTotalDuration = () => SECTIONS.reduce((acc, s) => acc + s.duration, 0);