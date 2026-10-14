(function () {
    'use strict';

    const form = document.getElementById('bmi-form');
    const btnReset = document.getElementById('btn-reset');

    const genderRadios = document.querySelectorAll('input[name="gender"]');
    const inputWeight = document.getElementById('input-weight');
    const inputHeight = document.getElementById('input-height');
    const inputAge = document.getElementById('input-age');

    const errorGender = document.getElementById('error-gender');
    const errorWeight = document.getElementById('error-weight');
    const errorHeight = document.getElementById('error-height');
    const errorAge = document.getElementById('error-age');

    // === Batas Validasi ===
    const LIMITS = {
        weight: { min: 2, max: 500, label: 'Berat badan' },
        height: { min: 30, max: 300, label: 'Tinggi badan' },
        age:    { min: 1,  max: 150, label: 'Usia' }
    };

    // === Fungsi Utilitas ===

    /**
     * Menampilkan pesan error pada elemen <p> error.
     * @param {HTMLElement} el
     * @param {string} message
     */
    function showError(el, message) {
        const span = el.querySelector('span');
        if (span) {
            span.textContent = message;
        } else {
            el.innerHTML = '<i class="fa-solid fa-circle-exclamation mr-1"></i> ' + message;
        }
        el.classList.remove('hidden');
    }

    /**
     * Menyembunyikan pesan error.
     * @param {HTMLElement} el
     */
    function hideError(el) {
        el.classList.add('hidden');
    }

    function hideAllErrors() {
        hideError(errorGender);
        hideError(errorWeight);
        hideError(errorHeight);
        hideError(errorAge);
    }

    /**
     * Menambahkan styling error pada input field.
     * @param {HTMLElement} input
     */
    function markInputError(input) {
        input.classList.add('border-red-400', 'bg-red-50/50');
        input.classList.remove('border-slate-200', 'bg-slate-50');
    }

    /**
     * Menghapus styling error pada input field.
     * @param {HTMLElement} input
     */
    function clearInputError(input) {
        input.classList.remove('border-red-400', 'bg-red-50/50');
        input.classList.add('border-slate-200', 'bg-slate-50');
    }

    /**
     * Validasi satu field numerik.
     * @param {HTMLInputElement} input
     * @param {HTMLElement} errorEl
     * @param {object} limits
     * @returns {number|null}
     */
    function validateNumericField(input, errorEl, limits) {
        const rawValue = input.value.trim();

        if (rawValue === '') {
            showError(errorEl, limits.label + ' tidak boleh kosong.');
            markInputError(input);
            return null;
        }

        const value = parseFloat(rawValue);

        if (isNaN(value)) {
            showError(errorEl, limits.label + ' harus berupa angka.');
            markInputError(input);
            return null;
        }

        if (value <= 0) {
            showError(errorEl, limits.label + ' harus lebih dari nol.');
            markInputError(input);
            return null;
        }

        if (value < limits.min || value > limits.max) {
            showError(errorEl, limits.label + ' harus antara ' + limits.min + ' dan ' + limits.max + '.');
            markInputError(input);
            return null;
        }

        hideError(errorEl);
        clearInputError(input);
        return value;
    }

    genderRadios.forEach(function (radio) {
        radio.addEventListener('change', function () {
            hideError(errorGender);
        });
    });

    inputWeight.addEventListener('input', function () {
        hideError(errorWeight);
        clearInputError(inputWeight);
    });

    inputHeight.addEventListener('input', function () {
        hideError(errorHeight);
        clearInputError(inputHeight);
    });

    inputAge.addEventListener('input', function () {
        hideError(errorAge);
        clearInputError(inputAge);
    });

    // === Submit Form ===

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        hideAllErrors();

        let isValid = true;

        const selectedGender = document.querySelector('input[name="gender"]:checked');
        if (!selectedGender) {
            showError(errorGender, 'Pilih jenis kelamin Anda.');
            isValid = false;
        }

        const weight = validateNumericField(inputWeight, errorWeight, LIMITS.weight);
        if (weight === null) isValid = false;

        const heightCm = validateNumericField(inputHeight, errorHeight, LIMITS.height);
        if (heightCm === null) isValid = false;

        const age = validateNumericField(inputAge, errorAge, LIMITS.age);
        if (age === null) isValid = false;

        if (!isValid) return;

        const data = {
            weight: weight,
            heightCm: heightCm,
            age: Math.floor(age),
            gender: selectedGender.value
        };

        localStorage.setItem('nutricheck_data', JSON.stringify(data));
        window.location.href = 'hasil.html';
    });

    // === Reset Form ===

    btnReset.addEventListener('click', function () {
        form.reset();

        hideAllErrors();
        clearInputError(inputWeight);
        clearInputError(inputHeight);
        clearInputError(inputAge);
    });

})();
