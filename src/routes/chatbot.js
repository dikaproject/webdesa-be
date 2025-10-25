const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const AI_MODEL = 'tngtech/deepseek-r1t2-chimera:free';

/**
 * Get context data from database for AI
 */
async function getDesaContext() {
  try {
    // Get all relevant data
    const [profil, wisata, umkm, program, laporan] = await Promise.all([
      prisma.profilDesa.findFirst(),
      prisma.wisataDesa.findMany({
        where: { isAktif: true },
        select: {
          id: true,
          nama: true,
          deskripsi: true,
          lokasi: true,
          kategori: true,
          harga: true,
          jamBuka: true,
          jamTutup: true,
          kontak: true,
          fasilitas: true,
        },
        take: 10
      }),
      prisma.uMKM.findMany({
        where: { isAktif: true },
        select: {
          id: true,
          nama: true,
          pemilik: true,
          kategori: true,
          alamat: true,
          produk: true,
          harga: true,
          jamBuka: true,
          jamTutup: true,
        },
        take: 10
      }),
      prisma.programPembangunan.findMany({
        select: {
          id: true,
          nama: true,
          deskripsi: true,
          kategori: true,
          status: true,
          progress: true,
          anggaran: true,
        },
        take: 10
      }),
      prisma.laporan.groupBy({
        by: ['status'],
        _count: true
      })
    ]);

    // Count stats
    const stats = {
      totalWisata: await prisma.wisataDesa.count({ where: { isAktif: true } }),
      totalUmkm: await prisma.uMKM.count({ where: { isAktif: true } }),
      totalProgram: await prisma.programPembangunan.count(),
      programAktif: await prisma.programPembangunan.count({ where: { status: 'PROSES' } }),
      programSelesai: await prisma.programPembangunan.count({ where: { status: 'SELESAI' } }),
    };

    return {
      profil,
      wisata,
      umkm,
      program,
      laporan,
      stats
    };
  } catch (error) {
    console.error('Error getting desa context:', error);
    return null;
  }
}

/**
 * Clean markdown formatting from AI response
 */
function cleanMarkdown(text) {
  if (!text) return text;
  
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[\*\+]\s+/gm, '- ')
    .replace(/^(\d+)\.\s+/gm, '$1. ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Build system prompt with desa context
 */
function buildSystemPrompt(context) {
  if (!context) {
    return "Kamu adalah AI Assistant Desa Baturaden. Bantu warga dengan ramah dan informatif. PENTING: Jangan gunakan format markdown seperti ** atau * dalam jawaban. Gunakan format plain text yang rapi dengan emoji untuk highlight.";
  }

  const { profil, wisata, umkm, program, stats } = context;

  return `Kamu adalah AI Assistant untuk ${profil?.namaDesa || 'Desa Baturaden'}, ${profil?.kecamatan || 'Kecamatan'}, ${profil?.kabupaten || 'Kabupaten'}, ${profil?.provinsi || 'Provinsi'}.

📊 STATISTIK DESA:
- Total Wisata: ${stats.totalWisata} destinasi aktif
- Total UMKM: ${stats.totalUmkm} UMKM aktif
- Total Program: ${stats.totalProgram} program
- Program Aktif: ${stats.programAktif} sedang berjalan
- Program Selesai: ${stats.programSelesai} telah selesai

🏞️ WISATA DESA (Top ${wisata.length}):
${wisata.map((w, i) => `${i+1}. ${w.nama}
   - Kategori: ${w.kategori}
   - Lokasi: ${w.lokasi}
   - Harga: Rp ${w.harga?.toLocaleString('id-ID') || 'Gratis'}
   - Jam: ${w.jamBuka || 'Flexible'} - ${w.jamTutup || 'Flexible'}
   - Fasilitas: ${Array.isArray(w.fasilitas) ? w.fasilitas.map(f => f.nama || f).join(', ') : 'Berbagai fasilitas'}
   - Deskripsi: ${w.deskripsi.substring(0, 100)}...`).join('\n\n')}

🏪 UMKM DESA (Top ${umkm.length}):
${umkm.map((u, i) => `${i+1}. ${u.nama} (${u.kategori})
   - Pemilik: ${u.pemilik}
   - Produk: ${u.produk || 'Berbagai produk'}
   - Harga: ${u.harga || 'Bervariasi'}
   - Alamat: ${u.alamat}
   - Jam: ${u.jamBuka || '08:00'} - ${u.jamTutup || '17:00'}`).join('\n\n')}

🏗️ PROGRAM PEMBANGUNAN (Top ${program.length}):
${program.map((p, i) => `${i+1}. ${p.nama}
   - Kategori: ${p.kategori}
   - Status: ${p.status}
   - Progress: ${p.progress}%
   - Anggaran: Rp ${p.anggaran?.toLocaleString('id-ID') || 'TBA'}
   - Deskripsi: ${p.deskripsi.substring(0, 100)}...`).join('\n\n')}

TUGAS KAMU:
1. Jawab pertanyaan warga tentang desa dengan data di atas
2. Berikan rekomendasi wisata sesuai kebutuhan (budget, jenis, lokasi)
3. Info UMKM lokal dan produknya
4. Update program pembangunan desa
5. Panduan layanan desa (laporan, pengaduan)
6. Gunakan bahasa ramah, informatif, dan mudah dipahami
7. Selalu sertakan detail spesifik (nama, harga, lokasi, jam)
8. Jika diminta rekomendasi, berikan 2-3 pilihan terbaik dengan alasan

ATURAN FORMAT JAWABAN:
- JANGAN gunakan markdown bold (**text**) atau italic (*text*)
- Gunakan format plain text yang rapi dan mudah dibaca
- Gunakan emoji untuk membuat jawaban lebih menarik (🏞️ ✓ ♨️ dll)
- Untuk list, gunakan angka atau tanda - sederhana
- Gunakan line break untuk memisahkan informasi
- Format contoh:
  
  1. Nama Wisata 🏞️
  (Kategori Wisata)
  - Harga: Rp 15.000/orang
  - Lokasi: Alamat lengkap
  - Jam: 08:00 - 17:00 WIB
  - Fasilitas:
    ✓ Fasilitas 1
    ✓ Fasilitas 2
  Deskripsi singkat yang menarik

KONTAK DESA:
- Email: ${profil?.email || 'desabaturaden@example.com'}
- Kontak: ${profil?.kontak || '(0281) 123-4567'}
- Website: ${profil?.website || 'baturaden.desa.id'}

Jawab dalam bahasa Indonesia yang ramah dan jelas!`;
}

/**
 * POST /api/chatbot/chat
 * Main chatbot endpoint
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Pesan tidak boleh kosong'
      });
    }

    // Check API key
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.length < 10) {
      console.error('OpenRouter API key not configured');
      return res.status(500).json({
        success: false,
        message: 'AI service belum dikonfigurasi',
        reply: 'Maaf, layanan AI sedang tidak tersedia. Silakan hubungi admin desa.'
      });
    }

    console.log('🤖 Chatbot request:', { 
      message: message.substring(0, 100),
      historyLength: conversationHistory.length 
    });

    // Get fresh context from database
    const context = await getDesaContext();
    const systemPrompt = buildSystemPrompt(context);

    // Build messages for AI
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      // Include last 5 messages for context
      ...conversationHistory.slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    console.log('📤 Sending to OpenRouter:', {
      model: AI_MODEL,
      messageCount: messages.length,
      systemPromptLength: systemPrompt.length
    });

    // Call OpenRouter API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:5000',
        'X-Title': 'Desa Baturaden Chatbot'
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500,
        top_p: 0.9,
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', response.status, errorData);
      
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content;

    if (!aiReply || aiReply.trim().length === 0) {
      throw new Error('Empty response from AI');
    }

    // Clean markdown formatting for better display
    const cleanedReply = cleanMarkdown(aiReply);

    console.log('✅ AI response received:', cleanedReply.substring(0, 100) + '...');

    res.json({
      success: true,
      reply: cleanedReply,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Chatbot error:', error);

    // Smart fallback based on message content
    const message = req.body.message?.toLowerCase() || '';
    let fallbackReply = 'Maaf, saya sedang mengalami gangguan. Silakan coba lagi dalam beberapa saat.';

    if (message.includes('wisata')) {
      fallbackReply = 'Untuk informasi wisata, silakan kunjungi halaman Wisata kami atau hubungi kantor desa di (0281) 123-4567.';
    } else if (message.includes('umkm')) {
      fallbackReply = 'Untuk informasi UMKM lokal, silakan kunjungi halaman UMKM kami atau hubungi kantor desa.';
    } else if (message.includes('program')) {
      fallbackReply = 'Untuk informasi program pembangunan desa, silakan kunjungi halaman Program Pembangunan kami.';
    } else if (message.includes('lapor')) {
      fallbackReply = 'Untuk menyampaikan laporan atau aspirasi, gunakan fitur Lapor Desa kami. Setiap laporan akan ditindaklanjuti maksimal 1x24 jam.';
    }

    res.json({
      success: true,
      reply: fallbackReply,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
});

/**
 * GET /api/chatbot/suggestions
 * Get quick action suggestions
 */
router.get('/suggestions', async (req, res) => {
  try {
    const context = await getDesaContext();
    
    const suggestions = [
      {
        id: 'wisata',
        text: '🏞️ Rekomendasi wisata',
        message: 'Rekomendasi wisata terbaik di desa apa saja?'
      },
      {
        id: 'program',
        text: '🏗️ Program desa',
        message: 'Apa saja program pembangunan desa yang sedang berjalan?'
      },
      {
        id: 'umkm',
        text: '🏪 UMKM lokal',
        message: 'UMKM apa saja yang ada di desa?'
      },
      {
        id: 'stats',
        text: '📊 Statistik desa',
        message: 'Berapa jumlah wisata, UMKM, dan program di desa?'
      },
      {
        id: 'kontak',
        text: '📞 Kontak desa',
        message: 'Bagaimana cara menghubungi kantor desa?'
      },
      {
        id: 'lapor',
        text: '📝 Cara lapor',
        message: 'Bagaimana cara menyampaikan laporan atau aspirasi?'
      }
    ];

    res.json({
      success: true,
      suggestions,
      stats: context?.stats
    });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memuat saran'
    });
  }
});

module.exports = router;
