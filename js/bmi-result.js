/**
 * NutriCheck — Modul Tampilan Hasil BMI & Indikator Visual (Tugas Anggota 4 - Bagian 1)
 * File: js/bmi-result.js
 * 
 * Modul ini menangani:
 * 1. Pembuatan komponen kartu hasil perhitungan BMI secara dinamis.
 * 2. Visual meter (gauge / segmented scale bar) dengan jarum penunjuk proporsional.
 * 3. Tampilan rentang berat badan ideal dan ringkasan kondisi gizi.
 * 4. Catatan penafian medis (Medical Disclaimer).
 * 5. Penanganan pesan kesalahan validasi pada DOM.
 */

(function (global) {
  'use strict';

  /**
   * Menghitung posisi persentase (0% - 100%) untuk marker indikator visual
   * Membagi skala ke dalam 4 kuadran visual proporsional:
   * - 0% - 25%   : Kurus (< 18.5)
   * - 25% - 50%  : Normal (18.5 - 24.9)
   * - 50% - 75%  : Kelebihan Berat Badan (25.0 - 27.0)
   * - 75% - 100% : Obesitas (> 27.0)
   * @param {number} bmi 
   * @returns {number} Persentase clamped antara 2% - 98%
   */
  function calculateGaugePercentage(bmi) {
    const val = Number(bmi);
    let percentage = 0;

    if (val < 18.5) {
      // Skala 10 - 18.5 ke 0% - 25%
      const clamped = Math.max(10, val);
      percentage = ((clamped - 10) / (18.5 - 10)) * 25;
    } else if (val <= 24.9) {
      // Skala 18.5 - 24.9 ke 25% - 50%
      percentage = 25 + ((val - 18.5) / (24.9 - 18.5)) * 25;
    } else if (val <= 27.0) {
      // Skala 25.0 - 27.0 ke 50% - 75%
      percentage = 50 + ((val - 25.0) / (27.0 - 25.0)) * 25;
    } else {
      // Skala 27.0 - 40.0 ke 75% - 100%
      const clamped = Math.min(40, val);
      percentage = 75 + ((clamped - 27.0) / (40.0 - 27.0)) * 25;
    }

    // Clamp agar marker tidak overflow keluar dari track
    return Math.min(Math.max(percentage, 2), 98);
  }

  /**
   * Menghasilkan markup HTML kartu hasil perhitungan BMI
   * @param {object} result Objek hasil dari BMICalculator.calculateBMI()
   * @returns {string}
   */
  function generateHTML(result) {
    if (!result || !result.success) {
      return generateErrorHTML(result ? result.errors : ['Hasil perhitungan tidak valid.']);
    }

    const { bmi, category, idealWeight, weightKg, heightCm } = result;
    const markerPosition = calculateGaugePercentage(bmi).toFixed(1);

    const minIdealStr = Number(idealWeight.min).toFixed(1);
    const maxIdealStr = Number(idealWeight.max).toFixed(1);

    // Hitung selisih dengan berat ideal
    let weightNote = '';
    if (weightKg < idealWeight.min) {
      const diff = (idealWeight.min - weightKg).toFixed(1);
      weightNote = `<span class="text-info fw-semibold">Disarankan menaikkan sekitar ${diff} kg</span> untuk mencapai berat ideal.`;
    } else if (weightKg > idealWeight.max) {
      const diff = (weightKg - idealWeight.max).toFixed(1);
      weightNote = `<span class="text-warning fw-semibold">Disarankan menurunkan sekitar ${diff} kg</span> untuk mencapai berat ideal.`;
    } else {
      weightNote = `<span class="text-success fw-semibold">Berat badan Anda sudah berada dalam rentang ideal!</span>`;
    }

    return `
      <div class="card shadow-sm border-0 bmi-result-card animate-fade-in">
        <div class="card-body p-4">
          <!-- Header Hasil -->
          <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h5 class="card-title mb-0 text-secondary">
              <i class="fa-solid fa-square-poll-vertical me-2 text-primary"></i>Hasil Analisis BMI
            </h5>
            <span class="badge ${category.badgeClass} px-3 py-2 fs-6 rounded-pill">
              ${category.name}
            </span>
          </div>

          <!-- Skor Utama BMI -->
          <div class="text-center my-4">
            <div class="display-3 fw-bold bmi-score text-dark mb-1">${Number(bmi).toFixed(1)}</div>
            <p class="text-muted mb-0">Indeks Massa Tubuh (kg/m²)</p>
          </div>

          <!-- Visual Segmented Gauge Bar -->
          <div class="bmi-gauge-wrapper my-4">
            <div class="d-flex justify-content-between text-xs text-muted mb-1 px-1">
              <small>Kurus (&lt;18.5)</small>
              <small>Normal (18.5-24.9)</small>
              <small>Berlebih (25-27)</small>
              <small>Obesitas (&gt;27)</small>
            </div>
            
            <div class="bmi-scale-bar position-relative rounded-pill overflow-hidden">
              <div class="bmi-bar-segment segment-kurus" title="Kurus (< 18.5)"></div>
              <div class="bmi-bar-segment segment-normal" title="Normal (18.5 - 24.9)"></div>
              <div class="bmi-bar-segment segment-overweight" title="Kelebihan Berat Badan (25.0 - 27.0)"></div>
              <div class="bmi-bar-segment segment-obesitas" title="Obesitas (> 27.0)"></div>
            </div>

            <!-- Pointer Jarum Penunjuk -->
            <div class="position-relative bmi-marker-track">
              <div class="bmi-gauge-marker" style="left: ${markerPosition}%;">
                <div class="marker-pin" style="border-bottom-color: ${category.color};"></div>
                <div class="marker-value-badge" style="background-color: ${category.color};">${Number(bmi).toFixed(1)}</div>
              </div>
            </div>
          </div>

          <!-- Penjelasan Status & Rekomendasi -->
          <div class="alert alert-light border p-3 rounded-3 mb-4">
            <div class="d-flex">
              <div class="me-3 fs-3 text-primary">
                <i class="fa-solid fa-circle-info"></i>
              </div>
              <div>
                <h6 class="fw-bold mb-1">Status: ${category.name}</h6>
                <p class="mb-0 text-secondary">${category.description}</p>
              </div>
            </div>
          </div>

          <!-- Ringkasan Profil & Berat Ideal -->
          <div class="row g-3 mb-4">
            <div class="col-sm-6">
              <div class="p-3 bg-light rounded-3 text-center border h-100">
                <small class="text-muted d-block mb-1">Data Anda</small>
                <div class="fw-bold text-dark">
                  ${weightKg} kg / ${heightCm} cm
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="p-3 bg-light rounded-3 text-center border h-100">
                <small class="text-muted d-block mb-1">Rentang Berat Ideal</small>
                <div class="fw-bold text-success">
                  ${minIdealStr} kg – ${maxIdealStr} kg
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mb-4 text-muted small">
            ${weightNote}
          </div>

          <!-- Medical Disclaimer -->
          <div class="medical-disclaimer p-3 rounded-3 mb-4">
            <div class="d-flex align-items-center">
              <i class="fa-solid fa-triangle-exclamation text-warning fs-4 me-3"></i>
              <div class="small text-muted">
                <strong>Catatan Penting:</strong> Hasil perhitungan BMI ini merupakan skrining awal kesehatan dan <strong>bukan merupakan diagnosis medis</strong> resmi. Konsultasikan dengan dokter atau ahli gizi untuk evaluasi klinis yang lebih komprehensif.
              </div>
            </div>
          </div>

          <!-- Tombol Aksi -->
          <div class="d-flex gap-2 justify-content-center flex-wrap">
            <button type="button" class="btn btn-outline-secondary px-4 py-2" id="btn-recalculate" onclick="if(window.resetBMICalculator) window.resetBMICalculator();">
              <i class="fa-solid fa-rotate-left me-1"></i> Hitung Ulang
            </button>
            <a href="guide.html" class="btn btn-primary px-4 py-2">
              <i class="fa-solid fa-book-open me-1"></i> Panduan Lengkap BMI
            </a>
          </div>

        </div>
      </div>
    `;
  }

  /**
   * Menghasilkan markup pesan kesalahan validasi
   * @param {string[]} errors 
   * @returns {string}
   */
  function generateErrorHTML(errors) {
    const errorList = (errors && errors.length > 0)
      ? errors.map(err => `<li>${err}</li>`).join('')
      : '<li>Input tidak valid. Periksa kembali angka yang Anda masukkan.</li>';

    return `
      <div class="alert alert-danger shadow-sm border-0 animate-fade-in" role="alert">
        <div class="d-flex align-items-start">
          <i class="fa-solid fa-circle-exclamation fs-4 me-3 mt-1"></i>
          <div>
            <h6 class="alert-heading fw-bold mb-1">Terjadi Kesalahan Input</h6>
            <ul class="mb-0 ps-3 small">
              ${errorList}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Merender hasil perhitungan ke elemen container DOM
   * @param {HTMLElement|string} containerElementOrId 
   * @param {object} calculationResult 
   */
  function render(containerElementOrId, calculationResult) {
    const container = typeof containerElementOrId === 'string'
      ? document.getElementById(containerElementOrId)
      : containerElementOrId;

    if (!container) {
      console.warn('BMIResult: Elemen container tidak ditemukan.');
      return;
    }

    container.innerHTML = generateHTML(calculationResult);
  }

  /**
   * Merender pesan error ke elemen container DOM
   * @param {HTMLElement|string} containerElementOrId 
   * @param {string[]} errors 
   */
  function renderError(containerElementOrId, errors) {
    const container = typeof containerElementOrId === 'string'
      ? document.getElementById(containerElementOrId)
      : containerElementOrId;

    if (!container) return;
    container.innerHTML = generateErrorHTML(errors);
  }

  /**
   * Mengosongkan tampilan hasil pada elemen container DOM
   * @param {HTMLElement|string} containerElementOrId 
   */
  function clear(containerElementOrId) {
    const container = typeof containerElementOrId === 'string'
      ? document.getElementById(containerElementOrId)
      : containerElementOrId;

    if (!container) return;
    container.innerHTML = '';
  }

  const BMIResult = {
    calculateGaugePercentage,
    generateHTML,
    generateErrorHTML,
    render,
    renderError,
    clear
  };

  // Ekspor untuk browser dan Node.js environment
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BMIResult;
  }
  if (typeof window !== 'undefined') {
    window.BMIResult = BMIResult;
  }

  return BMIResult;
})(typeof window !== 'undefined' ? window : globalThis);
