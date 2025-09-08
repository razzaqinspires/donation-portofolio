document.addEventListener('DOMContentLoaded', () => {
    // Modal untuk Form (DANA & Saweria)
    const donationButtons = document.querySelectorAll('.donation-button');
    const formModalOverlay = document.getElementById('donation-modal');
    const formModalContent = formModalOverlay.querySelector('.modal-content');
    const closeFormModalButton = document.getElementById('close-form-modal');
    
    // Modal untuk QRIS Langsung
    const directQrisButton = document.getElementById('direct-qris-button');
    const qrisModalOverlay = document.getElementById('qris-direct-modal');
    const qrisModalContent = qrisModalOverlay.querySelector('.modal-content');
    const closeQrisModalButton = document.getElementById('close-qris-modal');

    // Elemen Form
    const donationForm = document.getElementById('donation-form');
    const donationMethodInput = document.getElementById('donation-method');

    // --- GANTI URL FORMSPREE DI BAWAH INI ---
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xandaknd';
    const DANA_LINK = 'https://link.dana.id/minta?full_url=https://qr.dana.id/v1/281012012020063028837582';
    const SAWERIA_LINK = 'https://saweria.co/arzzq';

    let currentDonationMethod = '';

    // --- FUNGSI UNTUK MEMBUKA & MENUTUP MODAL ---
    function openModal(overlay, content) {
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.opacity = 1;
            content.style.transform = 'scale(1)';
        }, 10);
    }

    function closeModal(overlay, content) {
        overlay.style.opacity = 0;
        content.style.transform = 'scale(0.95)';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 400); // Sesuaikan dengan durasi transisi di CSS
    }

    // --- LOGIKA UNTUK MODAL FORM (DANA & SAWERIA) ---
    donationButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentDonationMethod = button.dataset.method;
            donationMethodInput.value = currentDonationMethod;
            openModal(formModalOverlay, formModalContent);
        });
    });

    closeFormModalButton.addEventListener('click', () => closeModal(formModalOverlay, formModalContent));
    formModalOverlay.addEventListener('click', (event) => {
        if (event.target === formModalOverlay) {
            closeModal(formModalOverlay, formModalContent);
        }
    });

    donationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitButton = document.getElementById('submit-form-button');
        submitButton.textContent = 'Mengirim...';
        submitButton.disabled = true;

        const formData = new FormData(donationForm);
        
        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                handlePaymentStep();
            } else {
                throw new Error('Gagal mengirim data. Silakan coba lagi.');
            }
        } catch (error) {
            alert(error.message);
        } finally {
            submitButton.textContent = 'Lanjut ke Pembayaran';
            submitButton.disabled = false;
        }
    });

    function handlePaymentStep() {
        if (currentDonationMethod === 'dana') {
            window.open(DANA_LINK, '_blank');
        } else if (currentDonationMethod === 'saweria') {
            window.open(SAWERIA_LINK, '_blank');
        }
        closeModal(formModalOverlay, formModalContent);
        donationForm.reset();
    }

    // --- LOGIKA UNTUK MODAL QRIS LANGSUNG ---
    directQrisButton.addEventListener('click', () => {
        openModal(qrisModalOverlay, qrisModalContent);
    });

    closeQrisModalButton.addEventListener('click', () => closeModal(qrisModalOverlay, qrisModalContent));
    qrisModalOverlay.addEventListener('click', (event) => {
        if (event.target === qrisModalOverlay) {
            closeModal(qrisModalOverlay, qrisModalContent);
        }
    });
});