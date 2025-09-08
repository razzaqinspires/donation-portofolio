export default async function handler(req, res) {
    if (req.method === 'POST') {
        const formData = req.body;
        const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT;

        if (!formspreeEndpoint) {
            return res.status(500).json({ error: 'Konfigurasi server tidak ditemukan.' });
        }

        try {
            const response = await fetch(formspreeEndpoint, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            });

            if (response.ok) {
                return res.status(200).json({ message: 'Data berhasil dikirim.' });
            } else {
                return res.status(response.status).json({ error: 'Gagal meneruskan data.' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Terjadi kesalahan internal.' });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}