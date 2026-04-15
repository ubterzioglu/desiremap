export type CategorySlug = 'fkk' | 'laufhaus' | 'bordell' | 'studio' | 'privat'

export type CategoryData = {
  slug: CategorySlug
  name: Record<string, string>
  count: number
  image: string
  icon: string
  descriptions: Record<string, string>
  subtitles: Record<string, string>
  features: Record<string, string[]>
}

export const categoriesData: CategoryData[] = [
  {
    slug: 'fkk',
    name: {
      de: 'FKK Clubs',
      en: 'FKK Clubs',
      tr: 'FKK Kulüpleri',
      ar: 'نوادي FKK',
    },
    count: 198,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=1920&q=80',
    icon: 'Flame',
    descriptions: {
      de: 'FKK Clubs in Deutschland bieten ein einzigartiges Wellness-Erlebnis mit Sauna, Pool und entspannter Atmosphäre. Hier treffen Erotik und Erholung auf höchstem Niveau zusammen. Die besten FKK Clubs zeichnen sich durch erstklassige Ausstattung, diskretes Ambiente und professionellen Service aus.',
      en: 'FKK clubs in Germany offer a unique wellness experience with sauna, pool and a relaxed atmosphere. Here, eroticism and relaxation meet at the highest level. The best FKK clubs are characterized by first-class facilities, discreet ambiance and professional service.',
      tr: 'Almanya\'daki FKK kulüpleri sauna, havuz ve rahat bir atmosferle benzersiz bir wellness deneyimi sunar. Burada erotizm ve dinlenme en üst düzeyde buluşur. En iyi FKK kulüpleri birinci sınıf tesisler, gizli ortam ve profesyonel hizmetle öne çıkar.',
      ar: 'تقدم نوادي FKK في ألمانيا تجربة عافية فريدة مع ساونا ومسبوح وأجواء مريحة.',
    },
    subtitles: {
      de: 'Wellness & Erotik auf höchstem Niveau',
      en: 'Wellness & eroticism at the highest level',
      tr: 'En üst düzeyde wellness ve erotizm',
      ar: 'العافية والمتعة على أعلى مستوى',
    },
    features: {
      de: ['Sauna & Pool', 'Wellness-Bereich', 'All-Inclusive', 'Diskretes Ambiente'],
      en: ['Sauna & Pool', 'Wellness Area', 'All-Inclusive', 'Discreet Ambiance'],
      tr: ['Sauna & Havuz', 'Wellness Alanı', 'Her şey dahil', 'Gizli Ortam'],
      ar: ['ساونا ومسبح', 'منطقة العافية', 'شامل الكل', 'أجواء خاصة'],
    },
  },
  {
    slug: 'laufhaus',
    name: {
      de: 'Laufhaus',
      en: 'Laufhaus',
      tr: 'Laufhaus',
      ar: 'لاوفهاوس',
    },
    count: 234,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80',
    icon: 'Building2',
    descriptions: {
      de: 'Laufhäuser sind die klassische Form der Erotik-Etablissements in Deutschland. Mit mehreren Etagen und einer großen Auswahl an Damen bieten sie ein unvergessliches Erlebnis. Die bekanntesten Laufhäuser befinden sich in Köln, Frankfurt und Hamburg.',
      en: 'Laufhäuser are the classic form of erotic establishments in Germany. With several floors and a large selection of ladies, they offer an unforgettable experience. The most famous Laufhäuser are located in Cologne, Frankfurt and Hamburg.',
      tr: 'Laufhaus\'lar Almanya\'nın klasik erotik mekanlarıdır. Birkaç kat ve geniş bir bayan seçimiyle unutulmaz bir deneyim sunarlar. En ünlü Laufhaus\'lar Köln, Frankfurt ve Hamburg\'da bulunur.',
      ar: 'لاوفهاوس هي الشكل الكلاسيكي للمؤسسات الإباحية في ألمانيا. مع عدة طوابق واختيار كبير من السيدات.',
    },
    subtitles: {
      de: 'Größte Auswahl an Damen und Etagen',
      en: 'Largest selection of ladies and floors',
      tr: 'En geniş bayan ve kat seçimi',
      ar: 'أكبر اختيار من السيدات والطوابق',
    },
    features: {
      de: ['Mehrere Etagen', 'Große Auswahl', 'Zentrale Lage', '24h Geöffnet'],
      en: ['Multiple Floors', 'Large Selection', 'Central Location', '24h Open'],
      tr: ['Çoklu Katlar', 'Geniş Seçim', 'Merkezi Konum', '24h Açık'],
      ar: ['طوابق متعددة', 'اختيار كبير', 'موقع مركزي', 'مفتوح 24 ساعة'],
    },
  },
  {
    slug: 'bordell',
    name: {
      de: 'Bordelle',
      en: 'Brothels',
      tr: 'Bordell',
      ar: 'بيوت الدعارة',
    },
    count: 156,
    image: 'https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?w=1920&q=80',
    icon: 'Crown',
    descriptions: {
      de: 'Bordelle in Deutschland bieten ein diskretes und professionelles Umfeld für erotische encounters. Von eleganten VIP-Suiten bis hin zu gemütlichen Privatzimmern — hier findet jeder das passende Ambiente. Qualität und Diskretion stehen an erster Stelle.',
      en: 'Brothels in Germany offer a discreet and professional environment for erotic encounters. From elegant VIP suites to cozy private rooms — everyone finds the right ambiance here. Quality and discretion come first.',
      tr: 'Almanya\'daki bordeller, erotik karşılaşmalar için gizli ve profesyonel bir ortam sunar. Zarif VIP süitlerden rahat özel odalara kadar herkes burada uygun ortamı bulur. Kalite ve gizlilik her zaman ön plandadır.',
      ar: 'تقدم بيوت الدعارة في ألمانيا بيئة سرية ومهنية للمقابلات المثيرة.',
    },
    subtitles: {
      de: 'Diskret und professionell',
      en: 'Discreet and professional',
      tr: 'Gizli ve profesyonel',
      ar: 'سري ومهني',
    },
    features: {
      de: ['VIP Suiten', 'Privatzimmer', 'Professioneller Service', 'Diskretion'],
      en: ['VIP Suites', 'Private Rooms', 'Professional Service', 'Discretion'],
      tr: ['VIP Süitler', 'Özel Odalar', 'Profesyonel Hizmet', 'Gizlilik'],
      ar: ['أجنحة VIP', 'غرف خاصة', 'خدمة مهنية', 'السرية'],
    },
  },
  {
    slug: 'studio',
    name: {
      de: 'Studios',
      en: 'Studios',
      tr: 'Stüdyolar',
      ar: 'استوديوهات',
    },
    count: 183,
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1920&q=80',
    icon: 'Gem',
    descriptions: {
      de: 'Erotik Studios in Deutschland bieten intime und persönliche Erlebnisse in einem exklusiven Rahmen. Mit individuellen Services und einem Fokus auf Qualität und Diskretion sind Studios die perfekte Wahl für anspruchsvolle Gäste.',
      en: 'Erotic studios in Germany offer intimate and personal experiences in an exclusive setting. With individual services and a focus on quality and discretion, studios are the perfect choice for discerning guests.',
      tr: 'Almanya\'daki erotik stüdyolar, eksklüzif bir çerçevede samimi ve kişisel deneyimler sunar. Bireysel hizmetler ve kalite ile gizliliğe odaklanan stüdyolar, seçkin misafirler için mükemmel bir tercih.',
      ar: 'تقدم الاستوديوهات الإباحية في ألمانيا تجارب حميمة وشخصية في إطار حصري.',
    },
    subtitles: {
      de: 'Intim und exklusiv',
      en: 'Intimate and exclusive',
      tr: 'Samimi ve eksklüzif',
      ar: 'حميم وحصري',
    },
    features: {
      de: ['Individueller Service', 'Intimes Ambiente', 'Flexible Zeiten', 'Premium Qualität'],
      en: ['Individual Service', 'Intimate Ambiance', 'Flexible Hours', 'Premium Quality'],
      tr: ['Bireysel Hizmet', 'Samimi Ortam', 'Esnek Saatler', 'Premium Kalite'],
      ar: ['خدمة فردية', 'أجواء حميمة', 'ساعات مرنة', 'جودة متميزة'],
    },
  },
  {
    slug: 'privat',
    name: {
      de: 'Privat',
      en: 'Private',
      tr: 'Özel',
      ar: 'خاص',
    },
    count: 76,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80',
    icon: 'Shield',
    descriptions: {
      de: 'Private Erotik-Angebote in Deutschland bieten höchste Diskretion und persönliche Betreuung. Ideal für Gäste, die Wert auf Privatsphäre und ein ungezwungenes Ambiente legen. Hier steht die individuelle Erfahrung im Vordergrund.',
      en: 'Private erotic offerings in Germany offer the highest discretion and personal attention. Ideal for guests who value privacy and a relaxed atmosphere. Here, the individual experience is the focus.',
      tr: 'Almanya\'daki özel erotik teklifler en yüksek gizliliği ve kişisel ilgilenmeyi sunar. Mahremiyete ve rahat bir ortama değer veren misafirler için idealdir. Burada bireysel deneyim ön plandadır.',
      ar: 'تقدم العروض الإباحية الخاصة في ألمانيا أعلى مستوى من السرية والاهتمام الشخصي.',
    },
    subtitles: {
      de: 'Höchste Diskretion und Privatsphäre',
      en: 'Highest discretion and privacy',
      tr: 'En yüksek gizlilik ve mahremiyet',
      ar: 'أعلى مستوى من السرية والخصوصية',
    },
    features: {
      de: ['Maximale Diskretion', 'Persönliche Betreuung', 'Ungezwungen', 'Termine nach Vereinbarung'],
      en: ['Maximum Discretion', 'Personal Attention', 'Relaxed', 'By Appointment'],
      tr: ['Maksimum Gizlilik', 'Kişisel İlgilenme', 'Rahat', 'Randevu ile'],
      ar: ['أقصى سرية', 'اهتمام شخصي', 'مريح', 'بالموعد'],
    },
  },
]

export function getCategoryBySlug(slug: string): CategoryData | undefined {
  return categoriesData.find((c) => c.slug === slug)
}

export const categorySlugs = categoriesData.map((c) => c.slug)
