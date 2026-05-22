const defaultStadtSeoMetadata = {
  title: 'FKK Clubs & Studios nach Stadt finden in DE | DesireMap',
  description: 'FKK Clubs, Laufhäuser und Studios nach Stadt finden: geprüfte Adressen in Berlin, Hamburg, München und weitere Städte auf DesireMap – schneller zum passenden Treffer.',
}

const stadtSeoMetadata: Record<string, { title: string; description: string }> = {
  de: defaultStadtSeoMetadata,
  en: {
    title: 'Find FKK Clubs & Studios by City in DE | DesireMap',
    description: 'Find FKK clubs, laufhaus venues and studios by city: explore verified addresses in Berlin, Hamburg, Munich and more German cities on DesireMap.',
  },
  tr: {
    title: 'Şehre Göre FKK Club ve Stüdyo Bul | DesireMap',
    description: 'Şehre göre FKK club, laufhaus ve stüdyo bul: Berlin, Hamburg, Münih ve diğer Alman şehirlerindeki doğrulanmış adresleri keşfet.',
  },
  ar: {
    title: 'ابحث عن نوادي FKK والاستوديوهات حسب المدينة | DesireMap',
    description: 'ابحث عن نوادي FKK وlaufhaus والاستوديوهات حسب المدينة، واكتشف عناوين موثوقة في برلين وهامبورغ وميونخ ومدن ألمانية أخرى.',
  },
}

export function getStadtSeoMetadata(locale: string) {
  return stadtSeoMetadata[locale] ?? defaultStadtSeoMetadata
}

export function getStadtFAQItems(locale: string): Array<{ question: string; answer: string }> {
  if (locale === 'de') {
    return [
      {
        question: 'Welche Städte finde ich auf DesireMap?',
        answer: 'DesireMap listet wichtige deutsche Städte wie Berlin, Hamburg, München, Köln, Frankfurt und weitere Standorte mit passenden FKK Clubs, Laufhäusern und Studios.',
      },
      {
        question: 'Wie wähle ich eine Stadt aus?',
        answer: 'Wähle auf der Städteübersicht eine Stadtkarte aus, um die jeweilige Stadtseite mit verfügbaren Betrieben und lokalen Informationen zu öffnen.',
      },
      {
        question: 'Sind alle Betriebe auf DesireMap verifiziert?',
        answer: 'Ja – alle auf DesireMap gelisteten Betriebe durchlaufen einen Prüfprozess. Verifizierte Adressen sind entsprechend gekennzeichnet, sodass du dir sicher sein kannst.',
      },
      {
        question: 'Wie oft werden die Stadtseiten aktualisiert?',
        answer: 'Die Stadtseiten und Betriebsprofile werden regelmäßig aktualisiert, um korrekte Öffnungszeiten, Preise und Verfügbarkeiten zu gewährleisten.',
      },
      {
        question: 'Kann ich über DesireMap auch reservieren?',
        answer: 'Ja. DesireMap verbindet die Städteübersicht mit Detailseiten und Reservierungsoberflächen, damit du nach der lokalen Auswahl ohne Umweg in den passenden Anfrage- oder Buchungsprozess wechseln kannst.',
      },
      {
        question: 'Wie zuverlässig ist das Reservierungssystem auf DesireMap?',
        answer: 'Der Reservierungsfluss ist auf klare Schritte, nachvollziehbare Bestätigungen und eine verlässliche Übergabe zwischen Suche, Detailseite und Anfrage ausgelegt, damit du schneller und strukturierter zum passenden Ergebnis kommst.',
      },
      {
        question: 'Was passiert mit meinen Reservierungs- und Kontaktdaten?',
        answer: 'Reservierungs- und Kontaktdaten werden innerhalb des DesireMap Flows vertraulich behandelt. Der Prozess ist darauf ausgelegt, nur notwendige Angaben abzufragen und sensible Informationen nicht unnötig offenzulegen.',
      },
      {
        question: 'Warum kann ich DesireMap mehr vertrauen als vielen anderen Branchenverzeichnissen?',
        answer: 'Weil DesireMap bewusst gegen die oft qualitativ schwachen, unübersichtlichen Brancheninhalte arbeitet: mit kuratierteren Informationen, diskreter Nutzerführung, vertrauensbetonter Produktlogik und einem Team, das seit Jahren an großen Digitalprodukten arbeitet.',
      },
    ]
  }
  if (locale === 'tr') {
    return [
      {
        question: "DesireMap'de hangi şehirleri bulabilirim?",
        answer: "DesireMap, Berlin, Hamburg, Münih, Köln, Frankfurt ve daha fazlası gibi önemli Alman şehirlerini FKK club'ları, laufhaus mekanları ve stüdyolarla listeler.",
      },
      {
        question: 'Bir şehri nasıl seçerim?',
        answer: 'Şehir dizininde bir şehir kartı seçerek mevcut mekanlar ve yerel bilgilerle ilgili şehir sayfasını açın.',
      },
      {
        question: "DesireMap'deki tüm mekanlar doğrulanmış mı?",
        answer: "Evet – DesireMap'de listelenen tüm mekanlar bir doğrulama sürecinden geçer. Doğrulanmış adresler işaretlenerek güvenle ziyaret edebilirsiniz.",
      },
      {
        question: 'Şehir sayfaları ne sıklıkla güncellenir?',
        answer: 'Şehir sayfaları ve mekan profilleri, doğru çalışma saatleri, fiyatlar ve müsaitliği sağlamak için düzenli olarak güncellenir.',
      },
    ]
  }
  if (locale === 'ar') {
    return [
      {
        question: 'ما المدن المتاحة على DesireMap؟',
        answer: 'يضم DesireMap مدنًا ألمانية رئيسية مثل برلين وهامبورغ وميونخ وكولونيا وفرانكفورت وغيرها مع نوادي FKK ومنشآت laufhaus والاستوديوهات.',
      },
      {
        question: 'كيف أختار مدينة؟',
        answer: 'حدد بطاقة مدينة في فهرس المدن لفتح صفحة المدينة المقابلة مع المنشآت المتاحة والمعلومات المحلية.',
      },
      {
        question: 'هل جميع المنشآت موثوقة على DesireMap؟',
        answer: 'نعم – تخضع جميع المنشآت المدرجة في DesireMap لعملية تحقق. العناوين الموثوقة مميزة حتى تتمكن من الزيارة بثقة.',
      },
      {
        question: 'كم مرة يتم تحديث صفحات المدن؟',
        answer: 'يتم تحديث صفحات المدن وملفات المنشآت بانتظام لضمان دقة ساعات العمل والأسعار والتوافر.',
      },
    ]
  }
  return [
    {
      question: 'Which cities are available on DesireMap?',
      answer: 'DesireMap lists major German cities such as Berlin, Hamburg, Munich, Cologne, Frankfurt and more locations with relevant FKK clubs, laufhaus venues and studios.',
    },
    {
      question: 'How do I choose a city?',
      answer: 'Select a city card on the city index to open the matching city page with available venues and local information.',
    },
    {
      question: 'Are all venues on DesireMap verified?',
      answer: 'Yes – all venues listed on DesireMap go through a verification process. Verified addresses are marked so you can visit with confidence.',
    },
    {
      question: 'How often are city pages updated?',
      answer: 'City pages and venue profiles are regularly updated to keep opening hours, price notes, and listing information current.',
    },
  ]
}
