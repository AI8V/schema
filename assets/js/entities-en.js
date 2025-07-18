'use strict';

/**
 * @file entities-en.js
 * @description Module for the Entity Management Platform (EMP), handling core brand entities. (English Version)
 */

var getEntity; // Declare globally to be accessible by schema-architect.js

const initializeEmp = (function() {

    const EMP_STORAGE_KEY = 'schemaArchitect_emp';
    let empModalInstance = null; // To hold the Bootstrap Modal instance

    // --- DOM Elements ---
    const empBtn = document.getElementById('empBtn');
    const empModalEl = document.getElementById('empModal');
    const saveEmpBtn = document.getElementById('saveEmpBtn');
    const addEmpFieldBtn = document.getElementById('addEmpFieldBtn');
    const empFormContainer = document.getElementById('emp-form-container');

    /**
     * Predefined fields for the EMP form.
     * @type {Object.<string, string>}
     */
    const predefinedEmpFields = {
        // i18n-key: empLabelOrgName
        organizationName: 'Official Organization Name',
        // i18n-key: empLabelLogo
        logo: 'Official Logo URL',
        // i18n-key: empLabelTelephone
        telephone: 'Main Telephone Number',
        // i18n-key: empLabelMainAuthor
        mainAuthor: 'Main Author for Articles/Reviews',
    };

    /**
     * Retrieves all saved entity data from localStorage.
     * @returns {Object} The saved entity data object.
     */
    function getSavedData() {
        return JSON.parse(localStorage.getItem(EMP_STORAGE_KEY) || '{}');
    }

    /**
     * Renders the form inside the EMP modal based on predefined and custom fields.
     */
    function renderEmpForm() {
        empFormContainer.innerHTML = ''; // Clear previous form
        const savedData = getSavedData();

        const allFields = { ...predefinedEmpFields };
        for (const key in savedData) {
            if (!allFields[key]) {
                const readableLabel = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                allFields[key] = readableLabel;
            }
        }

        for (const key in allFields) {
            const label = allFields[key];
            const value = savedData[key] || '';
            const isPredefined = !!predefinedEmpFields[key];

            const fieldHtml = `
                <div class="input-group mb-2" data-field-key="${key}">
                    <label class="input-group-text" style="width: 200px;">${label}</label>
                    <input type="text" class="form-control" value="${value}" placeholder="${label}...">
                    ${!isPredefined ? `<button class="btn btn-outline-danger btn-sm emp-delete-field-btn" type="button" title="Delete this custom field"><i class="bi bi-trash"></i></button>` : ''}
                </div>
            `;
            empFormContainer.insertAdjacentHTML('beforeend', fieldHtml);
        }

        // Add event listeners for the new delete buttons
        empFormContainer.querySelectorAll('.emp-delete-field-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fieldKey = e.currentTarget.closest('.input-group').dataset.fieldKey;
                const currentData = getSavedData();
                delete currentData[fieldKey];
                localStorage.setItem(EMP_STORAGE_KEY, JSON.stringify(currentData));
                renderEmpForm(); // Re-render to reflect the deletion
            });
        });
    }

    /**
     * Saves all data from the EMP form to localStorage.
     */
    function saveEmpData() {
        const newData = {};
        empFormContainer.querySelectorAll('.input-group').forEach(group => {
            const key = group.dataset.fieldKey;
            const input = group.querySelector('input');
            if (key && input && input.value.trim()) {
                newData[key] = input.value.trim();
            }
        });

        localStorage.setItem(EMP_STORAGE_KEY, JSON.stringify(newData));
        // i18n-key: toastEmpSaveSuccess
        showToast('Entity data saved successfully.', 'success');
        if (empModalInstance) {
            empModalInstance.hide();
        }
    }

    /**
     * Prompts the user to add a new custom field to the form.
     */
    function addCustomEmpField() {
        // i18n-key: promptCustomFieldKey
        const key = prompt("Enter a unique key for the field (in English, no spaces, e.g., 'ceoName'):");
        if (!key || !/^[a-zA-Z0-9_]+$/.test(key)) {
            // i18n-key: toastInvalidKey
            showToast('Invalid key name. It must be a single English word (underscores are allowed).', 'danger');
            return;
        }
        
        const savedData = getSavedData();
        if (savedData[key] || predefinedEmpFields[key]) {
            // i18n-key: toastKeyExists
            showToast('This key is already in use.', 'danger');
            return;
        }

        // i18n-key: promptCustomFieldValue
        const value = prompt(`Enter the value for the new field "${key}":`);
        if (value === null) return; // User cancelled

        savedData[key] = value.trim();
        localStorage.setItem(EMP_STORAGE_KEY, JSON.stringify(savedData));
        renderEmpForm(); // Re-render to show the new field
    }

    /**
     * Main initialization function for the EMP module.
     */
    function init() {
        if (!empBtn || !empModalEl) return;

        empModalInstance = new bootstrap.Modal(empModalEl);

        empBtn.addEventListener('click', () => {
            empModalInstance.show();
        });

        empModalEl.addEventListener('show.bs.modal', () => {
            renderEmpForm();
        });

        saveEmpBtn.addEventListener('click', saveEmpData);
        addEmpFieldBtn.addEventListener('click', addCustomEmpField);
    }
   
    /**
     * Globally accessible function to retrieve a single entity value.
     * @param {string} key - The key of the entity to retrieve.
     * @returns {string|null} The value of the entity or null if not found.
     */
    getEntity = function(key) {
        const data = JSON.parse(localStorage.getItem(EMP_STORAGE_KEY) || '{}');
        return data[key] || null;
    };

    // Run the initializer
    init();

    // Return a reference to the init function
    return init;

})();