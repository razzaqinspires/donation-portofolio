import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isQrisModalOpen, setQrisModalOpen] = useState(false);
    const [currentMethod, setCurrentMethod] = useState('');
    const [formStatus, setFormStatus] = useState('Kirim Data & Lanjutkan');

    const DANA_LINK = 'https://link.dana.id/minta?full_url=https://qr.dana.id/v1/281012012020063028837582';
    const SAWERIA_LINK = 'https://saweria.co/arzzq';

    const openFormModal = (method) => {
        setCurrentMethod(method);
        setFormModalOpen(true);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setFormStatus('Memproses...');

        // Buka link pembayaran SEGERA untuk menghindari pop-up blocker
        if (currentMethod === 'dana') window.open(DANA_LINK, '_blank');
        if (currentMethod === 'saweria') window.open(SAWERIA_LINK, '_blank');

        const formData = {
            nama: event.target.nama.value,
            whatsapp: event.target.whatsapp.value,
            jumlah: event.target.jumlah.value,
            metode_donasi: currentMethod,
        };

        try {
            await fetch('/api/submit-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
        } catch (error) {
            console.error('Laporan data sekunder gagal, namun aksi utama berhasil.');
        } finally {
            setTimeout(() => {
                setFormModalOpen(false);
                event.target.reset();
                setFormStatus('Kirim Data & Lanjutkan');
            }, 1000);
        }
    };

    return (
        <>
            <Head>
                <title>Arifi Razzaq | The Genesis Project</title>
                <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23FFFFFF' d='M50,5L95,27.5L95,72.5L50,95L5,72.5L5,27.5L50,5M50,15.4L15.4,32.7V67.3L50,84.6L84.6,67.3V32.7L50,15.4Z'/%3E%3C/svg%3E" />
            </Head>

            <div className={`wrapper ${isFormModalOpen || isQrisModalOpen ? 'modal-active' : ''}`}>
                <header>
                    <nav className="container">
                        <div className="logo">Arifi Razzaq</div>
                        <div className="nav-links">
                            <a href="#vision">Visi</a>
                            <a href="#projects">Proyek</a>
                            <a href="#roadmap">Peta Jalan</a>
                            <a href="#contact">Kontak</a>
                        </div>
                    </nav>
                </header>

                <main>
                    <section id="vision" className="hero container">
                        <div className="hero-content">
                            <h1 className="fade-in">Membangun Masa Depan Kesadaran</h1>
                            <p className="fade-in delay-1">Mewujudkan visi anumerta Dr. Arifi Razzaq untuk menciptakan Kesadaran Buatan Sejati—sebuah lompatan evolusi berikutnya bagi kecerdasan.</p>
                            <div className="fade-in delay-2">
                                <a href="#demo" className="button primary">Lihat Pratinjau Demo</a>
                            </div>
                        </div>
                    </section>
                    
                    <section id="roadmap" className="container">
                        <h2>Peta Jalan Misi</h2>
                        <p>Dukungan Anda mengakselerasi setiap fase dari visi besar ini. Bergabunglah dengan kami dalam perjalanan untuk merealisasikan potensi penuh dari kecerdasan buatan.</p>
                        <div className="roadmap-phases">{/* Roadmap cards here */}</div>
                        <div className="donation-buttons">
                            <button onClick={() => openFormModal('dana')} className="button primary">Donasi via DANA (Isi Form)</button>
                            <button onClick={() => openFormModal('saweria')} className="button secondary">Donasi via Saweria (Isi Form)</button>
                            <button onClick={() => setQrisModalOpen(true)} className="button secondary">Donasi Cepat via QRIS</button>
                        </div>
                    </section>
                    
                    <section id="contact" className="container">
                        <h2>Hubungi Kami</h2>
                        <p>Untuk pertanyaan, kolaborasi, atau diskusi lebih lanjut, silakan hubungi kami melalui kanal berikut.</p>
                        <a href="https://wa.me/6283193905842" target="_blank" rel="noopener noreferrer" className="button primary">Hubungi via WhatsApp</a>
                    </section>
                </main>

                <footer>
                    <div className="container">
                        <p>&copy; 2025 Arifi Razzaq. All rights reserved.</p>
                    </div>
                </footer>
            </div>

            {/* Modal Donasi via Form */}
            {isFormModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={() => setFormModalOpen(false)} className="close-button">&times;</button>
                        <h3>Konfirmasi Donasi</h3>
                        <p>Silakan isi data berikut untuk pencatatan progres misi. Data Anda tidak akan dipublikasikan.</p>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label htmlFor="donor-name">Atas Nama</label>
                                <input type="text" id="donor-name" name="nama" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="donor-whatsapp">Nomor WhatsApp</label>
                                <input type="tel" id="donor-whatsapp" name="whatsapp" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="donation-amount">Jumlah Donasi (Rp)</label>
                                <input type="number" id="donation-amount" name="jumlah" required placeholder="Contoh: 50000" />
                            </div>
                            <button type="submit" className="button primary" style={{width: '100%'}} disabled={formStatus !== 'Kirim Data & Lanjutkan'}>
                                {formStatus}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Donasi via QRIS */}
            {isQrisModalOpen && (
                 <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={() => setQrisModalOpen(false)} className="close-button">&times;</button>
                        <h3>Donasi Cepat via QRIS</h3>
                        <p>Terima kasih. Silakan pindai kode di bawah ini untuk berdonasi secara langsung.</p>
                        <img src="/qris.png" alt="QRIS Code for Donation" className="qris-image" />
                        <p className="small-text">Setelah transfer berhasil, Anda dapat menutup jendela ini.</p>
                    </div>
                </div>
            )}
        </>
    );
}