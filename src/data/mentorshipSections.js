// Mentörlük Bölümleri Yapılandırması
// Bu dosyayı düzenleyerek içerik ve süreleri yönetebilirsin

export const SECTIONS = [
  {
    id: 'teknik',
    title: 'Teknik',
    subtitle: 'Web sitesi ve teknik altyapı',
    icon: 'Wrench',
    duration: 2,
    minDuration: 1,
    steps: [
      {
        id: 'teknik-1',
        title: 'Hesap Oluşturma',
        description: 'Lightfunnels ve GoDaddy hesaplarınızı oluşturun',
        content: `
          <h3>Yapılacaklar:</h3>
          <ul>
            <li><a href="https://app.lightfunnels.com" target="_blank" style="color: #38bdf8;">Lightfunnels hesabı oluşturun →</a></li>
            <li><a href="https://www.godaddy.com" target="_blank" style="color: #38bdf8;">GoDaddy hesabı oluşturun →</a></li>
            <li>Alan adınızı belirleyin</li>
          </ul>
          <h3>Kaynaklar:</h3>
          <ul>
            <li><a href="https://www.notion.so/SAYFA-TEKN-K-12a7d57b8aef810aa161d0d71047dc92" target="_blank" style="color: #38bdf8;">Teknik Sayfa Detayları →</a></li>
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
            <li>Alan adınızı Godaddy'den satın alın</li>
            <li>DNS ayarlarını yapılandırın</li>
            <li>SSL sertifikasını aktifleştirin</li>
          </ul>
        `
      },
      {
        id: 'teknik-3',
        title: 'Temel Sayfa Ayarları',
        description: 'Site temel ayarlarını yapın',
        content: '<p>Temel sayfa yapılandırması için teknik dokümantasyonu inceleyin.</p>'
      },
      {
        id: 'teknik-4',
        title: 'Tema Seçimi',
        description: 'Site temanızı seçin',
        content: '<p>Tema seçimi ve özelleştirme için Lightfunnels tema kütüphanesini kullanın.</p>'
      },
      {
        id: 'teknik-5',
        title: 'Renk ve Logo',
        description: 'Marka kimliğinizi yansıtın',
        content: '<p>Renk ve logo ayarları için marka rehberinizi hazırlayın.</p>'
      },
      {
        id: 'teknik-6',
        title: 'Header ve Footer',
        description: 'Site başlık ve alt kısımları',
        content: '<p>Header ve footer yapılandırması için template\'i inceleyin.</p>'
      },
      {
        id: 'teknik-7',
        title: 'Form Oluşturma',
        description: 'İletişim ve kayıt formları',
        content: '<p>Form oluşturma ve entegrasyon adımları.</p>'
      },
      {
        id: 'teknik-8',
        title: 'Teknik Tamamlama',
        description: 'Son kontroller ve test',
        content: '<p>Son kontroller ve site testi için checklist\'i kullanın.</p>'
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
        content: `
          <h3>Kaynaklar:</h3>
          <ul>
            <li><a href="https://www.notion.so/D-J-TAL-R-N-REHBER-2b37d57b8aef80029570d968c73d9cb1" target="_blank" style="color: #38bdf8;">Dijital Ürün Rehberi →</a></li>
            <li><a href="https://www.notion.so/r-n-Sorular-v1-2ac7d57b8aef80b2897eff94ff33ee7b" target="_blank" style="color: #38bdf8;">Ürün Soruları v1 →</a></li>
            <li><a href="https://www.notion.so/AKINAY-MENT-D-J-TAL-R-N-FORM-2ac7d57b8aef809bb17ac200928f0d11" target="_blank" style="color: #38bdf8;">Dijital Ürün Form →</a></li>
          </ul>
        `
      },
      {
        id: 'urun-2',
        title: 'Prompt Oluşturma',
        description: 'AI için prompt hazırlayın',
        content: `
          <h3>Kaynaklar:</h3>
          <ul>
            <li><a href="https://www.notion.so/PROMPT-ER-K-HAZAL-G-RS-N-D-YE-2757d57b8aef8002bd53f7063a4f9ccd" target="_blank" style="color: #38bdf8;">Prompt (İçerik) →</a></li>
            <li><a href="https://www.notion.so/erik-Bulman-in-80-Do-ruluk-GPT-Promptu-S-n-rs-z-erik-ret-2647d57b8aef808f9de1e23be6a2b153" target="_blank" style="color: #38bdf8;">İçerik Bulmanın 80 Doğruluk GPT Prompt'u →</a></li>
          </ul>
        `
      },
      {
        id: 'urun-3',
        title: 'Ürün Geliştirme',
        description: 'Dijital ürünü geliştirin',
        content: '<p>Ürün geliştirme sürecini başlatın. AI araçlarını kullanarak içerik üretin.</p>'
      },
      {
        id: 'urun-4',
        title: 'Ürün Lansman',
        description: 'Ürünü piyasaya sunun',
        content: '<p>Ürün lansmanı için hazırlık listesini tamamlayın.</p>'
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
        content: `
          <h3>Kaynaklar:</h3>
          <ul>
            <li><a href="https://www.notion.so/erik-Havuzu-1e87d57b8aef800fa0ccc494b195ffc5" target="_blank" style="color: #38bdf8;">İçerik Havuzu →</a></li>
            <li><a href="https://www.notion.so/V-RAL-ER-K-S-STEM-1f77d57b8aef80b188ade02e6ab2a8bb" target="_blank" style="color: #38bdf8;">Viral İçerik Sistemi →</a></li>
            <li><a href="https://www.notion.so/50x-Haz-r-Viral-erik-ablonlar-Ger-ek-rnekler-Sadece-Bak-ve-Yap-2677d57b8aef81dea289d72ec61f2dc4" target="_blank" style="color: #38bdf8;">50x Hazır Viral İçerik Şablonları →</a></li>
          </ul>
        `
      },
      {
        id: 'icerik-2',
        title: 'İçerik Planlaması',
        description: 'İçerik takviminizi oluşturun',
        content: `
          <h3>Kaynaklar:</h3>
          <ul>
            <li><a href="https://www.notion.so/HER-G-N-ER-K-RET-12a7d57b8aef81efae1fde58ef0929de" target="_blank" style="color: #38bdf8;">Her Gün İçerik Üret →</a></li>
            <li><a href="https://www.notion.so/M-teri-Getiren-3-erik-T-r-2677d57b8aef815399ffc279e7eac381" target="_blank" style="color: #38bdf8;">Müşteri Getiren 3 İçerik Türü →</a></li>
          </ul>
        `
      },
      {
        id: 'icerik-3',
        title: 'İçerik Üretimi',
        description: 'Videolarınızı çekin',
        content: `
          <h3>Kaynaklar:</h3>
          <ul>
            <li><a href="https://www.notion.so/ECOM-ER-K-1f77d57b8aef8060bf2ed5278f24befb" target="_blank" style="color: #38bdf8;">Ecom İçerik →</a></li>
            <li><a href="https://www.notion.so/Reklam-ve-erikler-22e7d57b8aef80f3a5c9c2698d7b4f09" target="_blank" style="color: #38bdf8;">Reklam ve İçerikler →</a></li>
          </ul>
        `
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
        content: '<p>VSL videosu için senaryo ve çekim rehberini inceleyin.</p>'
      },
      {
        id: 'site-2',
        title: 'Landing Page',
        description: 'Satış sayfanızı oluşturun',
        content: '<p>Landing page için template ve örnekleri inceleyin.</p>'
      },
      {
        id: 'site-3',
        title: 'Test ve Yayın',
        description: 'Siteyi test edin ve yayına alın',
        content: '<p>Test ve yayın checklist\'ini tamamlayın.</p>'
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
        content: '<p>Meta reklam hesabı kurulumu için Business Manager rehberini inceleyin.</p>'
      },
      {
        id: 'reklam-2',
        title: 'Kampanya Oluşturma',
        description: 'İlk kampanyalarınızı başlatın',
        content: '<p>Kampanya oluşturma ve hedefleme ayarları için dokümantasyonu takip edin.</p>'
      },
      {
        id: 'reklam-3',
        title: 'Optimizasyon',
        description: 'Reklamlarınızı optimize edin',
        content: '<p>Reklam optimizasyonu için A/B test ve analiz adımlarını uygulayın.</p>'
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
