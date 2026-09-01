// api/search.js
// Serverless function di Vercel. Berjalan di server, BUKAN di browser.
// Key diambil dari Environment Variable "YOUTUBE_API_KEY" yang kamu set
// di Vercel Dashboard -> Settings -> Environment Variables.
// Key TIDAK PERNAH ditulis di file ini, jadi aman untuk di-push ke GitHub publik sekalipun.

export default async function handler(req, res) {
  // Hanya izinkan method GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method tidak diizinkan' });
  }

  const { q } = req.query;
  if (!q || !q.trim()) {
    return res.status(400).json({ error: 'Parameter "q" (kata kunci pencarian) wajib diisi' });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    // Ini akan muncul kalau kamu lupa set env var di Vercel
    return res.status(500).json({ error: 'YOUTUBE_API_KEY belum diatur di server. Cek Vercel Environment Variables.' });
  }

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('type', 'video');
    url.searchParams.set('videoCategoryId', '10'); // kategori Musik
    url.searchParams.set('maxResults', '15');
    url.searchParams.set('q', q);
    url.searchParams.set('key', apiKey);

    const ytRes = await fetch(url.toString());
    const data = await ytRes.json();

    if (!ytRes.ok) {
      // Teruskan pesan error dari YouTube API tanpa membocorkan key
      return res.status(ytRes.status).json({ error: data.error?.message || 'Gagal mengambil data dari YouTube' });
    }

    // Rapikan hasil supaya cocok dengan format yang dipakai frontend (mockData)
    const results = (data.items || []).map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      genre: 'Cari',
      thumb: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
    }));

    // Cache ringan di edge selama 5 menit supaya hemat kuota API kalau ada pencarian sama berulang
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ results });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
}
