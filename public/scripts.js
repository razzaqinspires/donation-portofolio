document.addEventListener('DOMContentLoaded', () => {
    const formModalOverlay = document.getElementById('donation-modal');
    const qrisModalOverlay = document.getElementById('qris-direct-modal');
    const donationForm = document.getElementById('donation-form');
    const donationMethodInput = document.getElementById('donation-method');
    const donationContainer = document.querySelector('.donation-buttons');
    const allModals = document.querySelectorAll('.modal-overlay');

    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xandaknd';
    const DANA_LINK = 'https://link.dana.id/minta?full_url=https://qr.dana.id/v1/281012012020063028837582';
    const SAWERIA_LINK = 'https://saweria.co/arzzq';

    let currentDonationMethod = '';

    function openModal(modal) {
        document.body.classList.add('modal-active');
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.style.opacity = 1;
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);
    }

    function closeModal(modal) {
        document.body.classList.remove('modal-active');
        modal.style.opacity = 0;
        modal.querySelector('.modal-content').style.transform = 'scale(0.95)';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 400);
    }

    if (donationContainer) {
        donationContainer.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (!button) return;

            const method = button.dataset.method;
            const id = button.id;

            if (method) {
                currentDonationMethod = method;
                donationMethodInput.value = currentDonationMethod;
                openModal(formModalOverlay);
            } else if (id === 'direct-qris-button') {
                openModal(qrisModalOverlay);
            }
        });
    }

    allModals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal || event.target.closest('.close-button')) {
                closeModal(modal);
            }
        });
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
                submitButton.textContent = 'Data Diterima! Mengalihkan...';
                setTimeout(handlePaymentStep, 1000);
            } else {
                throw new Error('Gagal mengirim data. Silakan coba lagi.');
            }
        } catch (error) {
            alert(error.message);
            submitButton.textContent = 'Kirim Data & Lanjutkan';
            submitButton.disabled = false;
        }
    });

    function handlePaymentStep() {
        if (currentDonationMethod === 'dana') {
            window.open(DANA_LINK, '_blank');
        } else if (currentDonationMethod === 'saweria') {
            window.open(SAWERIA_LINK, '_blank');
        }
        
        closeModal(formModalOverlay);
        donationForm.reset();
        const submitButton = document.getElementById('submit-form-button');
        submitButton.textContent = 'Kirim Data & Lanjutkan';
        submitButton.disabled = false;
    }
});