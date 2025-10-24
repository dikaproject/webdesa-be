/**
 * AI Configuration - OpenRouter Integration
 * Using: tngtech/deepseek-r1t2-chimera:free
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const AI_MODEL = 'tngtech/deepseek-r1t2-chimera:free';

/**
 * Smart keyword extraction and matching
 */
function extractKeywords(searchTerm) {
  if (!searchTerm) return [];
  
  const term = searchTerm.toLowerCase();
  const keywords = [];
  
  // Map common search terms to categories/keywords
  const keywordMaps = {
    'gunung': ['gunung', 'bukit', 'puncak', 'ketinggian'],
    'air terjun': ['curug', 'air terjun', 'waterfall'],
    'alam': ['alam', 'nature', 'pemandangan'],
    'keluarga': ['keluarga', 'family', 'anak'],
    'santai': ['santai', 'relax', 'healing'],
    'foto': ['foto', 'instagram', 'aesthetic'],
    'air panas': ['air panas', 'hot spring', 'pemandian'],
    'kolam': ['kolam', 'pool', 'swimming', 'renang'],
    'camping': ['camping', 'kemping'],
    'adventure': ['adventure', 'extreme', 'tracking']
  };
  
  for (const [key, values] of Object.entries(keywordMaps)) {
    if (values.some(v => term.includes(v))) {
      keywords.push(...values);
    }
  }
  
  keywords.push(...term.split(' ').filter(w => w.length > 2));
  return [...new Set(keywords)];
}

/**
 * Score wisata based on keyword relevance
 */
function scoreWisataRelevance(wisata, keywords, searchTerm) {
  if (keywords.length === 0) return 1;
  
  let score = 0;
  const searchableText = `
    ${wisata.nama} 
    ${wisata.deskripsi} 
    ${wisata.lokasi} 
    ${wisata.kategori || ''}
    ${wisata.fasilitas?.map(f => f.nama).join(' ') || ''}
  `.toLowerCase();
  
  keywords.forEach(keyword => {
    if (searchableText.includes(keyword)) {
      score += 1;
      if (wisata.nama.toLowerCase().includes(keyword)) score += 2;
      if (wisata.kategori?.toLowerCase().includes(keyword)) score += 1.5;
    }
  });
  
  if (searchTerm && searchableText.includes(searchTerm.toLowerCase())) {
    score += 3;
  }
  
  return score;
}

/**
 * Generate AI recommendation for wisata based on user preferences
 * OPTIMIZED: Simplified prompt for faster response
 */
async function getWisataRecommendation(preferences, wisataList) {
  try {
    const { location, numPeople, maxPrice } = preferences;

    console.log(`🔍 Search preferences:`, { location, numPeople, maxPrice });

    const keywords = extractKeywords(location);
    console.log(`🔑 Extracted keywords:`, keywords);

    // Smart filtering
    const filteredWisata = wisataList
      .filter(w => {
        const matchPrice = !maxPrice || w.harga <= maxPrice;
        if (!w.isAktif || !matchPrice) return false;
        if (!location) return true;
        const relevanceScore = scoreWisataRelevance(w, keywords, location);
        return relevanceScore > 0;
      })
      .map(w => ({
        ...w,
        relevanceScore: scoreWisataRelevance(w, keywords, location)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    console.log(`📊 Filtered ${filteredWisata.length} wisata from ${wisataList.length} total`);
    
    if (filteredWisata.length > 0) {
      console.log(`🏆 Top 3 by relevance:`, filteredWisata.slice(0, 3).map(w => ({
        nama: w.nama,
        score: w.relevanceScore,
        kategori: w.kategori
      })));
    }

    // Handle empty results
    if (filteredWisata.length === 0) {
      return {
        success: true,
        analysis: `Tidak ditemukan destinasi untuk "${location}"${maxPrice ? ` dengan budget Rp ${maxPrice.toLocaleString('id-ID')}` : ''}.`,
        recommendations: [],
        tips: 'Coba kata kunci: "air terjun", "keluarga", "kolam renang", "adventure".',
        totalFound: 0,
        noResults: true
      };
    }

    // ✅ CHECK: Validate API key
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.length < 10) {
      console.warn('⚠️ Invalid OpenRouter API Key, using fallback');
      throw new Error('Invalid API key');
    }

    // ✅ OPTIMIZED: Only send top 3 for faster processing
    const topWisata = filteredWisata.slice(0, 3);
    
    // ✅ SIMPLIFIED: Minimal data structure
    const wisataData = topWisata.map(w => ({
      nama: w.nama,
      kategori: w.kategori,
      harga: w.harga
    }));

    // ✅ ULTRA COMPACT PROMPT - Even shorter
    const prompt = `User cari: "${location}", ${numPeople} org, max Rp${maxPrice?.toLocaleString('id-ID') || '∞'}

Top 3:
${wisataData.map((w, i) => `${i+1}. ${w.nama} (${w.kategori}) Rp${w.harga.toLocaleString('id-ID')}`).join('\n')}

JSON format (no markdown):
{"analysis":"ringkasan singkat","topRecommendations":[{"namaWisata":"nama exact","score":9,"reason":"kenapa cocok","highlight":"keunikan"}],"tips":"saran praktis"}`;

    console.log('🚀 Calling OpenRouter API...');
    console.log('📝 Prompt length:', prompt.length, 'chars');

    // Call OpenRouter API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:5000',
        'X-Title': 'Wisata Baturaden AI'
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a tourism advisor. Always respond in valid JSON format only, no markdown.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5, // ✅ Lower for more focused output
        max_tokens: 1000, // ✅ Increased from 500
        top_p: 0.9
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('📡 API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // ✅ Check if response was truncated
    const finishReason = data.choices?.[0]?.finish_reason;
    if (finishReason === 'length') {
      console.warn('⚠️ Response truncated (hit max_tokens), using fallback');
      throw new Error('Response truncated');
    }

    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse || aiResponse.trim().length === 0) {
      console.error('❌ Empty AI response');
      throw new Error('Empty AI response');
    }

    console.log('🤖 AI Response:', aiResponse.substring(0, 200) + '...');

    // Parse AI response - More robust parsing
    let aiResult;
    try {
      // Remove ALL markdown artifacts
      let cleanResponse = aiResponse
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/g, '')
        .replace(/`/g, '')
        .trim();
      
      // Find JSON object - support multiple patterns
      let jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        // Try finding array first
        jsonMatch = cleanResponse.match(/\[[\s\S]*\]/);
      }
      
      if (jsonMatch) {
        cleanResponse = jsonMatch[0];
      }
      
      // ✅ Additional cleanup for common issues
      cleanResponse = cleanResponse
        .replace(/,\s*}/g, '}') // Remove trailing commas
        .replace(/,\s*]/g, ']');
      
      aiResult = JSON.parse(cleanResponse);
      console.log('✅ Parsed AI result successfully');
    } catch (e) {
      console.error('❌ Parse error:', e.message);
      console.error('Raw (first 300 chars):', aiResponse.substring(0, 300));
      throw new Error('Invalid JSON format');
    }

    // ✅ Validate structure
    if (!aiResult.topRecommendations || !Array.isArray(aiResult.topRecommendations)) {
      console.error('❌ Missing topRecommendations array');
      throw new Error('Invalid structure');
    }

    if (aiResult.topRecommendations.length === 0) {
      console.error('❌ Empty recommendations');
      throw new Error('No recommendations');
    }

    // Enrich with full wisata data
    const enrichedRecommendations = aiResult.topRecommendations
      .map(rec => {
        if (!rec.namaWisata) {
          console.warn('⚠️ Missing namaWisata field');
          return null;
        }

        const wisata = filteredWisata.find(w => 
          w.nama.toLowerCase().trim() === rec.namaWisata.toLowerCase().trim()
        );
        
        if (!wisata) {
          console.warn(`⚠️ Wisata not found: ${rec.namaWisata}`);
          // Try fuzzy match
          const fuzzyMatch = filteredWisata.find(w =>
            w.nama.toLowerCase().includes(rec.namaWisata.toLowerCase()) ||
            rec.namaWisata.toLowerCase().includes(w.nama.toLowerCase())
          );
          if (fuzzyMatch) {
            console.log(`✅ Fuzzy matched: ${rec.namaWisata} → ${fuzzyMatch.nama}`);
            return { ...rec, wisataData: fuzzyMatch };
          }
          return null;
        }
        
        return {
          ...rec,
          wisataData: wisata
        };
      })
      .filter(rec => rec !== null)
      .slice(0, 3);

    if (enrichedRecommendations.length === 0) {
      throw new Error('No valid recommendations after enrichment');
    }

    console.log(`✅ AI Success! ${enrichedRecommendations.length} recommendations`);

    return {
      success: true,
      analysis: aiResult.analysis || `Ditemukan ${filteredWisata.length} destinasi cocok`,
      recommendations: enrichedRecommendations,
      tips: aiResult.tips || 'Kunjungi pagi hari untuk pengalaman terbaik.',
      totalFound: filteredWisata.length
    };

  } catch (error) {
    console.error('🚨 AI Error:', error.message);
    
    // ✅ SMART FALLBACK: Always reliable
    const keywords = extractKeywords(preferences.location);
    
    const filteredWisata = wisataList
      .filter(w => {
        const matchPrice = !preferences.maxPrice || w.harga <= preferences.maxPrice;
        if (!w.isAktif || !matchPrice) return false;
        if (!preferences.location) return true;
        const relevanceScore = scoreWisataRelevance(w, keywords, preferences.location);
        return relevanceScore > 0;
      })
      .map(w => ({
        ...w,
        relevanceScore: scoreWisataRelevance(w, keywords, preferences.location)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    console.log(`📊 Fallback: ${filteredWisata.length} wisata`);

    if (filteredWisata.length === 0) {
      return {
        success: true,
        analysis: `Tidak ada destinasi untuk "${preferences.location}"${preferences.maxPrice ? ` budget Rp ${preferences.maxPrice.toLocaleString('id-ID')}` : ''}.`,
        recommendations: [],
        tips: 'Coba: "air terjun", "keluarga", "kolam renang", atau "adventure".',
        totalFound: 0,
        noResults: true,
        fallback: true
      };
    }

    const topWisata = filteredWisata.slice(0, 3);

    return {
      success: true,
      analysis: `Ditemukan ${filteredWisata.length} destinasi untuk ${preferences.numPeople} orang${preferences.maxPrice ? ` (budget Rp ${preferences.maxPrice.toLocaleString('id-ID')})` : ''}.`,
      recommendations: topWisata.map((w, i) => ({
        namaWisata: w.nama,
        score: Math.max(7, 9 - i),
        reason: generateSmartReason(w, preferences, keywords[0]),
        highlight: generateSmartHighlight(w),
        wisataData: w
      })),
      tips: generateSmartTips(preferences, keywords[0]),
      totalFound: filteredWisata.length,
      fallback: true
    };
  }
}

// ✅ SIMPLIFIED Helper functions
function generateSmartReason(wisata, preferences, primaryKeyword) {
  const parts = [];
  
  if (wisata.harga <= (preferences.maxPrice || 999999)) {
    parts.push(`Rp ${wisata.harga.toLocaleString('id-ID')}`);
  }
  
  if (wisata.fasilitas?.length >= 5) {
    parts.push(`${wisata.fasilitas.length} fasilitas lengkap`);
  } else if (primaryKeyword) {
    parts.push(`cocok untuk ${primaryKeyword}`);
  }
  
  return parts.join(', ') || `${wisata.kategori} populer di Baturaden`;
}

function generateSmartHighlight(wisata) {
  const highlights = {
    'Cipendok': 'Air terjun tertinggi Jawa Tengah (92m)',
    'Owabong': 'Waterpark terbesar Jawa Tengah',
    'Pancuran Pitu': '7 pancuran air panas terapi',
    'Village': '50+ spot foto European style',
    'Kebun Raya': 'Ribuan koleksi flora Indonesia',
    'Lokawisata': 'Kolam renang & playground lengkap',
    'Adventure': 'Flying fox & high rope',
    'Watu Meja': 'View 360° Purwokerto'
  };
  
  for (const [key, value] of Object.entries(highlights)) {
    if (wisata.nama.includes(key)) return value;
  }
  
  return `${wisata.kategori} dengan ${wisata.fasilitas?.length || 0} fasilitas`;
}

function generateSmartTips(preferences, primaryKeyword) {
  const { numPeople } = preferences;
  
  if (numPeople >= 5) {
    return 'Booking gazebo H-1 untuk group discount & tempat nyaman.';
  }
  
  if (primaryKeyword === 'kolam' || primaryKeyword === 'renang') {
    return 'Datang weekday jam 9 pagi untuk kolam sepi & air bersih.';
  }
  
  if (primaryKeyword === 'curug' || primaryKeyword === 'air terjun') {
    return 'Tracking pagi jam 7-8, bawa kamera waterproof!';
  }
  
  return 'Kunjungi weekday untuk harga murah & pengalaman nyaman.';
}

module.exports = {
  getWisataRecommendation
};