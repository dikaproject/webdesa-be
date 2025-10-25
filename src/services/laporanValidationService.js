/**
 * Laporan Validation Service - AI Vision Analysis
 * 
 * Menggunakan AI untuk menganalisis foto dan deskripsi laporan
 * untuk memastikan validitas sebelum data dikirim ke database.
 * 
 * Model: meta-llama/llama-4-maverick:free (support vision)
 */

const fs = require('fs');
const path = require('path');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const VISION_MODEL = 'meta-llama/llama-4-maverick:free';

/**
 * Convert image file to base64
 */
function imageToBase64(filePath) {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');
    const ext = path.extname(filePath).toLowerCase();
    
    // Determine MIME type
    let mimeType = 'image/jpeg';
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.webp') mimeType = 'image/webp';
    else if (ext === '.gif') mimeType = 'image/gif';
    
    return `data:${mimeType};base64,${base64Image}`;
  } catch (error) {
    console.error('Error reading image file:', error);
    throw new Error('Failed to read image file');
  }
}

/**
 * Analyze laporan dengan AI Vision
 * 
 * @param {string} kategori - Kategori laporan (INFRASTRUKTUR, KESEHATAN, dll)
 * @param {string} judul - Judul laporan
 * @param {string} deskripsi - Deskripsi laporan
 * @param {string} photoPath - Path ke foto laporan
 * @returns {Promise<Object>} Hasil analisis: { valid, confidence, reason, suggestions }
 */
async function validateLaporanWithAI(kategori, judul, deskripsi, photoPath) {
  console.log('🤖 Starting AI validation for laporan...');
  
  if (!OPENROUTER_API_KEY) {
    console.warn('⚠️ OPENROUTER_API_KEY not configured, skipping AI validation');
    return {
      valid: true,
      confidence: 0,
      reason: 'AI validation disabled (no API key)',
      skipped: true
    };
  }

  try {
    // Convert image to base64
    const base64Image = imageToBase64(photoPath);
    
    // Build AI prompt
    const systemPrompt = `Kamu adalah AI validator untuk sistem laporan desa. Tugasmu adalah menganalisis foto dan deskripsi laporan warga untuk mendeteksi laporan yang tidak valid, iseng, atau spam.

KATEGORI LAPORAN:
- INFRASTRUKTUR: jalan rusak, jembatan, drainase, fasilitas umum
- KESEHATAN: masalah sanitasi, sampah, air bersih, kesehatan lingkungan
- PENDIDIKAN: fasilitas sekolah, perpustakaan, akses pendidikan
- LINGKUNGAN: polusi, kerusakan alam, banjir, tanah longsor
- KEAMANAN: pencurian, kekerasan, gangguan ketertiban
- LAINNYA: masalah lain yang relevan dengan desa

KRITERIA VALID:
✓ Foto menunjukkan kondisi yang sesuai dengan kategori dan deskripsi
✓ Deskripsi jelas, spesifik, dan masuk akal
✓ Foto adalah foto situasi nyata (bukan selfie, foto random, meme, screenshot)
✓ Ada korelasi antara foto dengan masalah yang dilaporkan
✓ Tidak ada unsur spam atau iseng

KRITERIA TIDAK VALID:
✗ Foto selfie/orang acak tidak relevan dengan laporan
✗ Foto screenshot, meme, atau gambar internet random
✗ Deskripsi tidak jelas/terlalu pendek (<10 kata)
✗ Foto dan deskripsi tidak match (misal: lapor jalan rusak tapi foto makanan)
✗ Deskripsi ngawur/tidak masuk akal
✗ Foto blur/gelap sehingga tidak bisa dianalisis
✗ Terkesan iseng atau spam

RESPONSE FORMAT (JSON):
{
  "valid": true/false,
  "confidence": 0-100,
  "reason": "penjelasan singkat kenapa valid/tidak valid",
  "suggestions": "saran perbaikan jika tidak valid"
}`;

    const userPrompt = `Analisis laporan ini:

KATEGORI: ${kategori}
JUDUL: ${judul}
DESKRIPSI: ${deskripsi}

Berikan penilaian apakah laporan ini VALID atau TIDAK VALID. Berikan confidence score 0-100.`;

    // Call OpenRouter Vision API
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://desa-baturaden.id',
        'X-Title': 'Desa Baturaden - Laporan Validation'
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenRouter API error:', response.status, errorText);
      
      // Fallback: skip validation jika API error
      return {
        valid: true,
        confidence: 0,
        reason: 'AI validation failed, proceeding without validation',
        skipped: true
      };
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';
    
    console.log('🤖 AI Response:', aiResponse);
    
    // Parse JSON response
    let result;
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      
      // Fallback parsing: look for keywords
      const lowerResponse = aiResponse.toLowerCase();
      const isValid = lowerResponse.includes('valid') && 
                      !lowerResponse.includes('tidak valid') &&
                      !lowerResponse.includes('invalid');
      
      result = {
        valid: isValid,
        confidence: isValid ? 70 : 30,
        reason: aiResponse.substring(0, 200),
        suggestions: isValid ? '' : 'Mohon perbaiki foto dan deskripsi agar lebih jelas'
      };
    }

    // Ensure result has all required fields
    result.valid = result.valid === true;
    result.confidence = Math.min(100, Math.max(0, parseInt(result.confidence) || 0));
    result.reason = result.reason || 'Analisis AI tidak lengkap';
    result.suggestions = result.suggestions || '';
    
    console.log('✅ AI Validation Result:', result);
    
    return result;

  } catch (error) {
    console.error('❌ AI Validation error:', error);
    
    // Fallback: skip validation on error
    return {
      valid: true,
      confidence: 0,
      reason: `AI validation error: ${error.message}`,
      skipped: true
    };
  }
}

/**
 * Heuristic fallback validation (jika AI tidak tersedia)
 */
function heuristicValidation(kategori, judul, deskripsi) {
  const issues = [];
  
  // Check deskripsi length
  const wordCount = deskripsi.trim().split(/\s+/).length;
  if (wordCount < 10) {
    issues.push('Deskripsi terlalu pendek (minimal 10 kata)');
  }
  
  // Check judul length
  if (judul.trim().length < 5) {
    issues.push('Judul terlalu pendek');
  }
  
  // Check for spam patterns
  const spamPatterns = [
    /test/i,
    /coba/i,
    /^a+$/i,
    /^haha+$/i,
    /asdf/i
  ];
  
  const textToCheck = `${judul} ${deskripsi}`.toLowerCase();
  for (const pattern of spamPatterns) {
    if (pattern.test(textToCheck)) {
      issues.push('Terdeteksi pola spam atau iseng');
      break;
    }
  }
  
  const isValid = issues.length === 0;
  
  return {
    valid: isValid,
    confidence: isValid ? 60 : 40,
    reason: isValid ? 'Validasi dasar berhasil' : issues.join('; '),
    suggestions: isValid ? '' : 'Mohon berikan informasi yang lebih detail dan serius',
    heuristic: true
  };
}

module.exports = {
  validateLaporanWithAI,
  heuristicValidation
};
