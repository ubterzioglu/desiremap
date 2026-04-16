export type CitySlug = 'berlin' | 'hamburg' | 'muenchen' | 'koeln' | 'frankfurt' | 'duesseldorf' | 'stuttgart' | 'nuernberg' | 'karlsruhe'

export type CityData = {
  slug: CitySlug
  name: string
  count: number
  image: string
  lat: number
  lng: number
  descriptions: Record<string, string>
  subtitles: Record<string, string>
}

export const citiesData: CityData[] = [
  {
    slug: 'berlin',
    name: 'Berlin',
    count: 124,
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1920&q=80',
    lat: 52.52,
    lng: 13.405,
    descriptions: {
      de: 'Berlin bietet die größte Dichte an Premium- und Wellness-orientierten Adressen in Deutschland. Von renommierten FKK Clubs im Stadtzentrum bis hin zu diskreten Studios in ruhigen Nebenstraßen — die Hauptstadt vereint Vielfalt und Qualität.',
      en: 'Berlin offers the highest density of premium and wellness-oriented venues in Germany. From renowned FKK clubs in the city center to discreet studios in quiet side streets — the capital combines variety and quality.',
      tr: 'Berlin, Almanya\'da Premium ve wellness odaklı mekanların en yoğun olduğu şehirdir. Şehir merkezindeki ünlü FKK kulüplerinden sakin sokaklardaki stüdyolara kadar başkent çeşitliliği ve kaliteyi bir araya getiriyor.',
      ar: 'يقدم برلين أعلى كثافة من الأماكن المتميزة والموجهة نحو العافية في ألمانيا.',
    },
    subtitles: {
      de: 'Größte Dichte an Premium-Adressen',
      en: 'Highest density of premium venues',
      tr: 'Premium mekanların en yoğun olduğu şehir',
      ar: 'أعلى كثافة من الأماكن المتميزة',
    },
  },
  {
    slug: 'hamburg',
    name: 'Hamburg',
    count: 87,
    image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1920&q=80',
    lat: 53.5753,
    lng: 10.0153,
    descriptions: {
      de: 'Hamburg überzeugt mit diskreten Studios und bekannten Häusern in zentralen Lagen. Die Hansestadt bietet eine ausgewogene Mischung aus Tradition und Moderne.',
      en: 'Hamburg impresses with discreet studios and well-known venues in central locations. The Hanseatic city offers a balanced mix of tradition and modernity.',
      tr: 'Hamburg, merkezi konumlardaki stüdyoları ve ünlü mekanlarıyla etkileyicidir. Hanseatik şehir gelenek ve modernliğin dengeli bir karışımını sunar.',
      ar: 'يمتاز هامبورغ بالاستوديوهات والأماكن المعروفة في مواقع مركزية.',
    },
    subtitles: {
      de: 'Diskrete Studios und bekannte Häuser',
      en: 'Discreet studios and renowned venues',
      tr: 'Stüdyolar ve ünlü mekanlar',
      ar: 'استوديوهات وأماكن شهيرة',
    },
  },
  {
    slug: 'muenchen',
    name: 'München',
    count: 54,
    image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1920&q=80',
    lat: 48.1351,
    lng: 11.582,
    descriptions: {
      de: 'München steht für privatere und hochpreisige Adressen mit exklusiver Ausrichtung. Die bayerische Hauptstadt bietet ein gehobenes Umfeld mit erstklassigem Service.',
      en: 'Munich stands for more private and upscale venues with an exclusive orientation. The Bavarian capital offers an upscale environment with first-class service.',
      tr: 'Münih, özel ve yüksek fiyatlı mekanlarıyla bilinir. Bavyera başkenti birinci sınıf hizmetle üst düzey bir ortam sunar.',
      ar: 'يمثل ميونخ أماكن أكثر خصوصية ورفاهية مع توجه حصري.',
    },
    subtitles: {
      de: 'Private und exklusive Adressen',
      en: 'Private and exclusive venues',
      tr: 'Özel ve eksklüzif mekanlar',
      ar: 'أماكن خاصة وحصرية',
    },
  },
  {
    slug: 'koeln',
    name: 'Köln',
    count: 92,
    image: 'https://images.unsplash.com/photo-1524491751889-2433a6c22a6b?w=1920&q=80',
    lat: 50.9333,
    lng: 6.95,
    descriptions: {
      de: 'Köln ist das Zentrum der Laufhaus-Kultur mit hoher Nachfrage und starker Markenbekanntheit. Die Domstadt bietet eine lebendige Szene mit professionellen Adressen.',
      en: 'Cologne is the center of laufhaus culture with high demand and strong brand awareness. The cathedral city offers a vibrant scene with professional venues.',
      tr: 'Köln, yüksek talep ve güçlü marka bilinirliğiyle laufhaus kültürünün merkezidir. Katedral şehri canlı bir sahne sunar.',
      ar: 'كولونيا هي مركز ثقافة laufhaus مع طلب مرتفع ووعي قوي بالعلامة التجارية.',
    },
    subtitles: {
      de: 'Laufhaus-Cluster mit hoher Nachfrage',
      en: 'Laufhaus cluster with high demand',
      tr: 'Yüksek talepli laufhaus merkezi',
      ar: 'مركز laufhaus مع طلب مرتفع',
    },
  },
  {
    slug: 'frankfurt',
    name: 'Frankfurt',
    count: 68,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80',
    lat: 50.1109,
    lng: 8.6821,
    descriptions: {
      de: 'Frankfurt besticht durch das Bahnhofsviertel und Premium-Locations mit hoher Besuchsfrequenz. Die Mainmetropole vereint internationale Ausrichtung mit einer aktiven Szene.',
      en: 'Frankfurt impresses with its Bahnhofsviertel and premium locations with high visitor frequency. The Main metropolis combines an international orientation with an active scene.',
      tr: 'Frankfurt, Bahnhofsviertel ve yüksek ziyaretçi sıklığına sahip premium mekanlarıyla etkileyicidir.',
      ar: 'يمتاز فرانكفورت بمنطقة Bahnhofsviertel والمواقع المتميزة.',
    },
    subtitles: {
      de: 'Bahnhofsviertel und Premium-Locations',
      en: 'Bahnhofsviertel and premium locations',
      tr: 'Bahnhofsviertel ve premium mekanlar',
      ar: 'Bahnhofsviertel ومواقع متميزة',
    },
  },
  {
    slug: 'duesseldorf',
    name: 'Düsseldorf',
    count: 48,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80',
    lat: 51.2217,
    lng: 6.7762,
    descriptions: {
      de: 'Düsseldorf bietet eine elegante Auswahl an FKK Clubs und Studios mit gutem Wellness-Angebot. Die Landeshauptstadt punktet mit Stil und Diskretion.',
      en: 'Düsseldorf offers an elegant selection of FKK clubs and studios with good wellness offerings. The state capital scores with style and discretion.',
      tr: 'Düsseldorf, iyi wellness teklifleriyle zarif FKK kulüpleri ve stüdyoları sunar.',
      ar: 'يقدم دوسلدورف مجموعة أنيقة من نوادي FKK والاستوديوهات مع عروض عافية جيدة.',
    },
    subtitles: {
      de: 'Elegante Clubs mit Wellness-Fokus',
      en: 'Elegant clubs with wellness focus',
      tr: 'Wellness odaklı zarif kulüpler',
      ar: 'نوادي أنيقة مع تركيز على العافية',
    },
  },
  {
    slug: 'stuttgart',
    name: 'Stuttgart',
    count: 42,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80',
    lat: 48.7758,
    lng: 9.1829,
    descriptions: {
      de: 'Stuttgart überzeugt mit einer FKK- und Club-lastigen Auswahl mit gutem Wellness-Fit. Die schwäbische Metropole bietet Premium-Adressen in entspannter Atmosphäre.',
      en: 'Stuttgart impresses with a FKK and club-heavy selection with good wellness fit. The Swabian metropolis offers premium venues in a relaxed atmosphere.',
      tr: 'Stuttgart, iyi wellness uyumuyla FKK ve kulüp ağırlıklı seçkisiyle etkileyicidir.',
      ar: 'يمتاز شتوتغارت باختيار غني بنوادي FKK مع عروض عافية جيدة.',
    },
    subtitles: {
      de: 'FKK-Clubs mit gutem Wellness-Fit',
      en: 'FKK clubs with good wellness fit',
      tr: 'İyi wellness uyumlu FKK kulüpleri',
      ar: 'نوادي FKK مع عروض عافية جيدة',
    },
  },
  {
    slug: 'nuernberg',
    name: 'Nürnberg',
    count: 35,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80',
    lat: 49.4521,
    lng: 11.0767,
    descriptions: {
      de: 'Nürnberg bietet eine überschaubare aber qualitativ hochwertige Auswahl an Adressen. Die fränkische Metropole besticht durch persönliche Betreuung und eine vertraute Atmosphäre.',
      en: 'Nuremberg offers a manageable but high-quality selection of venues. The Franconian metropolis impresses with personal attention and a familiar atmosphere.',
      tr: 'Nürnberg, yönetilebilir ama yüksek kaliteli bir mekan seçkisi sunar.',
      ar: 'يقدم نورنبرغ مجموعة عالية الجودة من الأماكن.',
    },
    subtitles: {
      de: 'Überschaubare Auswahl mit Qualität',
      en: 'Manageable selection with quality',
      tr: 'Kaliteli ve yönetilebilir seçki',
      ar: 'اختيار مع جودة',
    },
  },
  {
    slug: 'karlsruhe',
    name: 'Karlsruhe',
    count: 1,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80',
    lat: 49.0069,
    lng: 8.4037,
    descriptions: {
      de: 'Karlsruhe und das nahe Ettlingen bieten eine diskrete FKK- und Wellness-Option mit guter Erreichbarkeit aus Süddeutschland und dem Grenzraum zu Frankreich.',
      en: 'Karlsruhe and nearby Ettlingen offer a discreet FKK and wellness option with strong accessibility from southern Germany and the French border region.',
      tr: 'Karlsruhe ve yakın Ettlingen, Güney Almanya ve Fransa sınır bölgesinden kolay erişilen, gizlilik odaklı bir FKK ve wellness seçeneği sunar.',
      ar: 'كارلسروه وإتلينغن القريبة توفران خيارًا يجمع بين الخصوصية وبيئة FKK والعافية مع سهولة وصول من جنوب ألمانيا ومنطقة الحدود الفرنسية.',
    },
    subtitles: {
      de: 'Diskreter FKK-Standort im Süden',
      en: 'Discreet FKK destination in the south',
      tr: 'Güneyde gizli ve rahat FKK noktası',
      ar: 'وجهة FKK هادئة في الجنوب',
    },
  },
]

export function getCityBySlug(slug: string): CityData | undefined {
  return citiesData.find((c) => c.slug === slug)
}

export function getCityByName(name: string): CityData | undefined {
  return citiesData.find((c) => c.name === name)
}

export const citySlugs = citiesData.map((c) => c.slug)
