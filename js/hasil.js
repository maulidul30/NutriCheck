/**
 * NutriCheck — Logika & Tampilan Hasil BMI (Tugas Anggota 3 & 4)
 * File: js/hasil.js
 */

(function () {
    'use strict';

    // Standar Kemenkes RI
    const CATEGORIES = {
        kurus: {
            label: 'Kurus (Kekurangan Berat Badan)',
            badgeClass: 'bg-sky-100 text-sky-700 border-sky-200',
            barColor: 'bg-sky-500',
            textColor: 'text-sky-600',
            risk: 'Risiko kekurangan gizi, anemia, osteoporosis, dan penurunan daya tahan tubuh.',
            recommendation: 'Tingkatkan asupan kalori padat gizi, konsumsi protein seimbang, dan lakukan latihan beban untuk meningkatkan massa otot.',
            minBmi: 0,
            maxBmi: 18.4
        },
        normal: {
            label: 'Normal (Ideal)',
            badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            barColor: 'bg-emerald-500',
            textColor: 'text-emerald-600',
            risk: 'Risiko penyakit kardiovaskular dan metabolik berada pada level terendah.',
            recommendation: 'Pertahankan pola makan bergizi seimbang, cukupi kebutuhan cairan harian, dan rutin berolahraga minimal 150 menit per minggu.',
            minBmi: 18.5,
            maxBmi: 24.9
        },
        overweight: {
            label: 'Kelebihan Berat Badan',
            badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
            barColor: 'bg-amber-500',
            textColor: 'text-amber-600',
            risk: 'Mulai meningkatkan risiko hipertensi, gangguan kolesterol, dan resistensi insulin.',
            recommendation: 'Atur defisit kalori terukur, batasi konsumsi gula, garam, dan lemak jenuh, serta perbanyak aktivitas fisik harian.',
            minBmi: 25.0,
            maxBmi: 27.0
        },
        obesitas: {
            label: 'Obesitas (Tingkat Berat)',
            badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
            barColor: 'bg-rose-500',
            textColor: 'text-rose-600',
            risk: 'Risiko tinggi Diabetes Tipe 2, penyakit jantung koroner, perlemakan hati, dan hipertensi.',
            recommendation: 'Disarankan berkonsultasi dengan dokter atau ahli gizi untuk program penurunan berat badan yang aman dan terpantau.',
            minBmi: 27.1,
            maxBmi: 100
        }
    };

    /**
     * Mengambil data dari localStorage
     */
    function getStoredData() {
        try {
            const raw = localStorage.getItem('nutricheck_data');
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed.weight || !parsed.heightCm) return null;
            return parsed;
        } catch (e) {
            console.error('Gagal membaca data dari localStorage:', e);
            return null;
        }
    }

    /**
     * Hitung BMI dan kategori
     */
    function calculateBMI(weightKg, heightCm) {
        const heightM = heightCm / 100;
        const bmi = weightKg / (heightM * heightM);
        const roundedBmi = Math.round(bmi * 10) / 10;

        let categoryKey = 'normal';
        if (roundedBmi < 18.5) {
            categoryKey = 'kurus';
        } else if (roundedBmi <= 24.9) {
            categoryKey = 'normal';
        } else if (roundedBmi <= 27.0) {
            categoryKey = 'overweight';
        } else {
            categoryKey = 'obesitas';
        }

        // Rentang berat badan ideal (BMI 18.5 - 24.9)
        const minIdeal = Math.round((18.5 * heightM * heightM) * 10) / 10;
        const maxIdeal = Math.round((24.9 * heightM * heightM) * 10) / 10;

        return {
            bmi: roundedBmi,
            categoryKey: categoryKey,
            category: CATEGORIES[categoryKey],
            minIdeal: minIdeal,
            maxIdeal: maxIdeal
        };
    }

    /**
     * Hitung posisi persentase jarum gauge (0% - 100%)
     */
    function getGaugePercentage(bmi) {
        let percent = 0;
        if (bmi < 18.5) {
            percent = ((Math.max(12, bmi) - 12) / (18.5 - 12)) * 25;
        } else if (bmi <= 24.9) {
            percent = 25 + ((bmi - 18.5) / (24.9 - 18.5)) * 25;
        } else if (bmi <= 27.0) {
            percent = 50 + ((bmi - 25.0) / (27.0 - 25.0)) * 25;
        } else {
            percent = 75 + ((Math.min(35, bmi) - 27.0) / (35.0 - 27.0)) * 25;
        }
        return Math.min(Math.max(percent, 3), 97);
    }

    // Eksekusi saat DOM siap
    document.addEventListener('DOMContentLoaded', function () {
        const data = getStoredData();
        const noDataState = document.getElementById('no-data-state');
        const resultState = document.getElementById('result-state');

        if (!data) {
            if (noDataState) noDataState.classList.remove('hidden');
            if (resultState) resultState.classList.add('hidden');
            return;
        }

        if (noDataState) noDataState.classList.add('hidden');
        if (resultState) resultState.classList.remove('hidden');

        const result = calculateBMI(data.weight, data.heightCm);

        // Isi elemen hasil
        const elBmiScore = document.getElementById('bmi-score');
        const elBmiCategory = document.getElementById('bmi-category');
        const elBmiBadge = document.getElementById('bmi-badge');
        const elGaugePointer = document.getElementById('gauge-pointer');
        const elGaugeScore = document.getElementById('gauge-score');

        const elUserGender = document.getElementById('user-gender');
        const elUserAge = document.getElementById('user-age');
        const elUserWeight = document.getElementById('user-weight');
        const elUserHeight = document.getElementById('user-height');

        const elIdealRange = document.getElementById('ideal-range');
        const elIdealNote = document.getElementById('ideal-note');
        const elRiskText = document.getElementById('risk-text');
        const elRecommendationText = document.getElementById('recommendation-text');

        if (elBmiScore) elBmiScore.textContent = result.bmi.toFixed(1);
        if (elBmiCategory) elBmiCategory.textContent = result.category.label;
        if (elBmiBadge) {
            elBmiBadge.className = 'inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ' + result.category.badgeClass;
            elBmiBadge.textContent = result.category.label;
        }

        // Animasi jarum gauge
        if (elGaugePointer) {
            const percentage = getGaugePercentage(result.bmi);
            setTimeout(() => {
                elGaugePointer.style.left = percentage + '%';
            }, 100);
        }
        if (elGaugeScore) elGaugeScore.textContent = result.bmi.toFixed(1);

        // Biodata pengguna
        if (elUserGender) elUserGender.textContent = data.gender === 'pria' ? 'Laki-laki' : 'Perempuan';
        if (elUserAge) elUserAge.textContent = (data.age || '-') + ' Tahun';
        if (elUserWeight) elUserWeight.textContent = data.weight + ' kg';
        if (elUserHeight) elUserHeight.textContent = data.heightCm + ' cm';

        // Rentang ideal
        if (elIdealRange) elIdealRange.textContent = `${result.minIdeal} kg – ${result.maxIdeal} kg`;
        if (elIdealNote) {
            if (data.weight < result.minIdeal) {
                const diff = (result.minIdeal - data.weight).toFixed(1);
                elIdealNote.innerHTML = `<span class="text-sky-600 font-semibold">Disarankan menaikkan sekitar ${diff} kg</span> untuk mencapai berat normal.`;
            } else if (data.weight > result.maxIdeal) {
                const diff = (data.weight - result.maxIdeal).toFixed(1);
                elIdealNote.innerHTML = `<span class="text-amber-600 font-semibold">Disarankan menurunkan sekitar ${diff} kg</span> untuk mencapai berat normal.`;
            } else {
                elIdealNote.innerHTML = `<span class="text-emerald-600 font-semibold">Hebat! Berat badan Anda sudah berada dalam rentang ideal.</span>`;
            }
        }

        // Risiko & Saran
        if (elRiskText) elRiskText.textContent = result.category.risk;
        if (elRecommendationText) elRecommendationText.textContent = result.category.recommendation;

        // Tombol Cetak
        const btnPrint = document.getElementById('btn-print');
        if (btnPrint) {
            btnPrint.addEventListener('click', function () {
                window.print();
            });
        }
    });

})();
