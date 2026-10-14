/**
 * NutriCheck — Logika Kalkulator BMI & Validasi (Tugas Anggota 3)
 * File: js/bmi-calculator.js
 * 
 * Modul ini menangani:
 * 1. Validasi input berat & tinggi badan (angka positif, batas wajar fisiologis).
 * 2. Konversi satuan tinggi (cm -> m).
 * 3. Kalkulasi nilai BMI berdasarkan rumus: BB (kg) / (TB (m))^2.
 * 4. Klasifikasi kategori status gizi berdasarkan standar resmi Kemenkes RI.
 * 5. Kalkulasi rentang berat badan ideal untuk tinggi badan tertentu.
 */

(function (global) {
  'use strict';

  // Batas toleransi nilai realistis/fisiologis manusia
  const LIMITS = {
    MIN_WEIGHT: 10,  // kg
    MAX_WEIGHT: 400, // kg
    MIN_HEIGHT: 50,  // cm
    MAX_HEIGHT: 300  // cm
  };

  /**
   * Mengonversi tinggi badan dari sentimeter ke meter
   * @param {number} heightCm 
   * @returns {number}
   */
  function convertCmToMeter(heightCm) {
    return Number((Number(heightCm) / 100).toFixed(4));
  }

  /**
   * Memvalidasi input berat dan tinggi badan
   * @param {number|string} weight 
   * @param {number|string} height 
   * @returns {{ isValid: boolean, errors: string[], weight?: number, height?: number }}
   */
  function validateBMIInput(weight, height) {
    const errors = [];

    // Validasi berat badan
    if (weight === null || weight === undefined || String(weight).trim() === '') {
      errors.push('Berat badan wajib diisi.');
    } else {
      const numWeight = Number(weight);
      if (isNaN(numWeight)) {
        errors.push('Berat badan harus berupa angka valid.');
      } else if (numWeight <= 0) {
        errors.push('Berat badan harus lebih besar dari 0.');
      } else if (numWeight < LIMITS.MIN_WEIGHT || numWeight > LIMITS.MAX_WEIGHT) {
        errors.push(`Berat badan harus berada dalam rentang wajar (${LIMITS.MIN_WEIGHT} - ${LIMITS.MAX_WEIGHT} kg).`);
      }
    }

    // Validasi tinggi badan
    if (height === null || height === undefined || String(height).trim() === '') {
      errors.push('Tinggi badan wajib diisi.');
    } else {
      const numHeight = Number(height);
      if (isNaN(numHeight)) {
        errors.push('Tinggi badan harus berupa angka valid.');
      } else if (numHeight <= 0) {
        errors.push('Tinggi badan harus lebih besar dari 0.');
      } else if (numHeight < LIMITS.MIN_HEIGHT || numHeight > LIMITS.MAX_HEIGHT) {
        errors.push(`Tinggi badan harus berada dalam rentang wajar (${LIMITS.MIN_HEIGHT} - ${LIMITS.MAX_HEIGHT} cm).`);
      }
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        errors: errors
      };
    }

    return {
      isValid: true,
      errors: [],
      weight: Number(weight),
      height: Number(height)
    };
  }

  /**
   * Menentukan kategori BMI berdasarkan standar Kemenkes RI
   * @param {number} bmi 
   * @returns {{ key: string, name: string, color: string, badgeClass: string, description: string }}
   */
  function getBMICategory(bmi) {
    const score = Number(bmi);

    if (score < 18.5) {
      return {
        key: 'kurus',
        name: 'Kurus (Kekurangan Berat Badan)',
        color: '#0dcaf0', // info
        badgeClass: 'bg-info text-dark',
        description: 'Berat badan Anda berada di bawah batas normal. Disarankan meningkatkan asupan nutrisi seimbang dan berkonsultasi dengan ahli gizi.'
      };
    } else if (score <= 24.9) {
      return {
        key: 'normal',
        name: 'Normal (Ideal)',
        color: '#198754', // success
        badgeClass: 'bg-success text-white',
        description: 'Selamat! Berat badan Anda berada dalam kategori sehat dan ideal. Pertahankan pola makan bergizi dan olahraga teratur.'
      };
    } else if (score <= 27.0) {
      return {
        key: 'overweight',
        name: 'Kelebihan Berat Badan (Tingkat Ringan)',
        color: '#ffc107', // warning
        badgeClass: 'bg-warning text-dark',
        description: 'Berat badan Anda melebihi batas ideal. Mulailah mengatur porsi makan dan perbanyak aktivitas fisik harian.'
      };
    } else {
      return {
        key: 'obesitas',
        name: 'Obesitas (Kelebihan Berat Badan Tingkat Berat)',
        color: '#dc3545', // danger
        badgeClass: 'bg-danger text-white',
        description: 'Anda berada dalam kategori obesitas yang berisiko memicu gangguan metabolisme. Dianjurkan konsultasi medis atau pola diet terkontrol.'
      };
    }
  }

  /**
   * Menghitung rentang berat badan ideal untuk tinggi tertentu berdasarkan standar BMI Normal (18.5 - 24.9)
   * @param {number} heightCm 
   * @returns {{ min: number, max: number }}
   */
  function calculateIdealWeightRange(heightCm) {
    const heightM = convertCmToMeter(heightCm);
    const heightSq = heightM * heightM;
    const minWeight = Number((18.5 * heightSq).toFixed(1));
    const maxWeight = Number((24.9 * heightSq).toFixed(1));
    return {
      min: minWeight,
      max: maxWeight
    };
  }

  /**
   * Menghitung BMI secara menyeluruh beserta validasi dan analisis kategori
   * @param {number|string} weightKg 
   * @param {number|string} heightCm 
   * @returns {object}
   */
  function calculateBMI(weightKg, heightCm) {
    const validation = validateBMIInput(weightKg, heightCm);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    const heightM = convertCmToMeter(validation.height);
    const rawBmi = validation.weight / (heightM * heightM);
    const roundedBmi = Number(rawBmi.toFixed(1));
    const category = getBMICategory(roundedBmi);
    const idealWeight = calculateIdealWeightRange(validation.height);

    return {
      success: true,
      bmi: roundedBmi,
      rawBmi: rawBmi,
      weightKg: validation.weight,
      heightCm: validation.height,
      heightM: heightM,
      category: category,
      idealWeight: idealWeight
    };
  }

  const BMICalculator = {
    LIMITS,
    convertCmToMeter,
    validateBMIInput,
    getBMICategory,
    calculateIdealWeightRange,
    calculateBMI
  };

  // Ekspor untuk browser dan Node.js environment
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BMICalculator;
  }
  if (typeof window !== 'undefined') {
    window.BMICalculator = BMICalculator;
  }

  return BMICalculator;
})(typeof window !== 'undefined' ? window : globalThis);
