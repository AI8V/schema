'use strict';
/**
@file projects.js
@description Module for managing project templates (custom selector configurations) using localStorage.
*/
const initializeProjectHub = (function() {
const PROJECTS_STORAGE_KEY = 'schemaArchitect_projects';

const projectSelector = document.getElementById('projectSelector');
const newProjectNameInput = document.getElementById('newProjectName');
const saveProjectBtn = document.getElementById('saveProjectBtn');
const deleteProjectBtn = document.getElementById('deleteProjectBtn');

/**
 * Returns an array of DOM element IDs for all savable custom identifier inputs.
 * @returns {string[]} Array of input element IDs.
 */
function getSavableInputs() {
    return [
        'customFaqItem', 'customFaqQuestion', 'customFaqAnswer',
        'customProductPrice', 'customProductCurrency', 'customProductSku', 'customProductBrand',
        'customRecipePrepTime', 'customRecipeCookTime', 'customRecipeIngredients',
        'customReviewRating', 'customReviewItemName',
        'customHowToStep', 'customHowToText',
        'customBreadcrumbItem',
        'customEventStartDate', 'customEventLocation', 'customEventOrganizer',
        'customOrgLogo', 'customOrgAddress', 'customOrgTelephone'
    ];
}

/**
 * Saves the current state of custom identifier inputs as a new project.
 * @param {string} projectName - The name for the new project.
 */
function saveProject(projectName) {
    if (!projectName || !projectName.trim()) {
        // i18n-key: toastEnterProjectName
        showToast('يرجى إدخال اسم للمشروع.', 'warning');
        return;
    }

    const savableInputs = getSavableInputs();
    const newProjectData = {};

    savableInputs.forEach(id => {
        const inputElement = document.getElementById(id);
        if (inputElement && inputElement.value.trim()) {
            newProjectData[id] = inputElement.value.trim();
        }
    });

    if (Object.keys(newProjectData).length === 0) {
        // i18n-key: toastNoIdentifiersToSave
        showToast('لا توجد مُعرّفات مخصصة للحفظ. يرجى ملء حقل واحد على الأقل.', 'info');
        return;
    }

    const allProjects = JSON.parse(localStorage.getItem(PROJECTS_STORAGE_KEY) || '{}');
    allProjects[projectName.trim()] = newProjectData;
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(allProjects));
    
    populateProjectDropdown();
    newProjectNameInput.value = '';
    // i18n-key: toastProjectSavedSuccess
    showToast(`تم حفظ المشروع "${projectName.trim()}" بنجاح.`, 'success');
}

/**
 * Loads the selectors from a saved project into the input fields,
 * or clears the fields if the default option is selected.
 * @param {string} projectName - The name of the project to load.
 */
function loadProject(projectName) {
    const savableInputs = getSavableInputs();

    // **المنطق الجديد الذي أضفته**
    // If the project name is empty (user selected "-- اختر مشروع محفوظ --")
    if (!projectName) {
        // Clear all savable input fields
        savableInputs.forEach(id => {
            const inputElement = document.getElementById(id);
            if (inputElement) {
                inputElement.value = '';
            }
        });
        // لا نعرض رسالة هنا لتجربة أكثر سلاسة
        return; 
    }

    // المنطق الحالي (يبقى كما هو)
    const allProjects = JSON.parse(localStorage.getItem(PROJECTS_STORAGE_KEY) || '{}');
    const projectData = allProjects[projectName];

    if (!projectData) {
        // i18n-key: toastProjectNotFound
        showToast('لم يتم العثور على المشروع المحدد.', 'danger');
        return;
    }

    savableInputs.forEach(id => {
        const inputElement = document.getElementById(id);
        if (inputElement) {
            inputElement.value = projectData[id] || '';
        }
    });
    // i18n-key: toastProjectLoaded
    showToast(`تم تحميل مُعرّفات المشروع "${projectName}".`, 'info');
}

/**
 * Deletes a project from localStorage.
 * @param {string} projectName - The name of the project to delete.
 */
function deleteProject(projectName) {
    if (!projectName) {
        // i18n-key: toastSelectProjectToDelete
        showToast('يرجى اختيار مشروع لحذفه.', 'warning');
        return;
    }
    // i18n-key: confirmDeleteProject
    if (!confirm(`هل أنت متأكد من رغبتك في حذف المشروع "${projectName}"؟ لا يمكن التراجع عن هذا الإجراء.`)) {
        return;
    }

    const allProjects = JSON.parse(localStorage.getItem(PROJECTS_STORAGE_KEY) || '{}');
    delete allProjects[projectName];
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(allProjects));

    populateProjectDropdown();
    // i18n-key: toastProjectDeleted
    showToast(`تم حذف المشروع "${projectName}".`, 'success');
}

/**
 * Populates the project selector dropdown with projects from localStorage.
 */
function populateProjectDropdown() {
    const allProjects = JSON.parse(localStorage.getItem(PROJECTS_STORAGE_KEY) || '{}');
    const projectNames = Object.keys(allProjects);

    // Clear existing options but keep the first one
    // i18n-key: dropdownDefaultOption
    projectSelector.innerHTML = '<option selected value="">-- اختر مشروع محفوظ --</option>';

    projectNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        projectSelector.appendChild(option);
    });
}

/**
 * Initializes the project hub by setting up event listeners.
 */
function init() {
    if (!projectSelector) return; // Failsafe if the element doesn't exist

    populateProjectDropdown();

    saveProjectBtn.addEventListener('click', () => {
        saveProject(newProjectNameInput.value);
    });

    deleteProjectBtn.addEventListener('click', () => {
        deleteProject(projectSelector.value);
    });

    projectSelector.addEventListener('change', (e) => {
        loadProject(e.target.value);
    });
}

// Run the initializer
init();

// Return a reference to the init function to be called from the main script
return init;
})();