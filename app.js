/**
 * My Special Year Calendar – Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const CURRENT_YEAR = 2026;
    const STORAGE_KEY = 'special_year_calendar_milestones_v1';

    // DOM Elements
    const toggleFormBtn = document.getElementById('toggleFormBtn');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const entryDrawer = document.getElementById('entryDrawer');
    const milestoneForm = document.getElementById('milestoneForm');
    const submitBtn = document.getElementById('submitBtn');
    const calendarGrid = document.getElementById('calendarGrid');

    const poemModal = document.getElementById('poemModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalSeasonBadge = document.getElementById('modalSeasonBadge');
    const modalTitle = document.getElementById('modalTitle');
    const modalDateStr = document.getElementById('modalDateStr');
    const modalPoemText = document.getElementById('modalPoemText');
    const deleteEntryBtn = document.getElementById('deleteEntryBtn');

    let activeModalEntryId = null;

    // Month Metadata
    const MONTH_NAMES = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const SEASONS = {
        0: { name: "Winter", class: "season-winter", icon: "❄️" },
        1: { name: "Winter", class: "season-winter", icon: "❄️" },
        2: { name: "Spring", class: "season-spring", icon: "🌱" },
        3: { name: "Spring", class: "season-spring", icon: "🌸" },
        4: { name: "Spring", class: "season-spring", icon: "🍀" },
        5: { name: "Summer", class: "season-summer", icon: "☀️" },
        6: { name: "Summer", class: "season-summer", icon: "🏖️" },
        7: { name: "Summer", class: "season-summer", icon: "🌻" },
        8: { name: "Autumn", class: "season-autumn", icon: "🍂" },
        9: { name: "Autumn", class: "season-autumn", icon: "🍁" },
        10: { name: "Autumn", class: "season-autumn", icon: "🌾" },
        11: { name: "Winter", class: "season-winter", icon: "❄️" }
    };

    // State Management
    function getStoredMilestones() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.error("Error reading localStorage:", e);
        }

        // Default sample entries if empty
        const defaultSamples = [
            {
                id: "sample-1",
                date: "2026-10-14",
                title: "Mom's 60th Birthday",
                context: "Loves autumn leaves & gardening",
                poemNote: "Golden leaves dance softly in October light...",
                season: "autumn"
            },
            {
                id: "sample-2",
                date: "2026-05-24",
                title: "Wedding Anniversary",
                context: "Favorite spring evening",
                poemNote: "May's twilight breeze whispers sweet memories...",
                season: "spring"
            }
        ];
        saveStoredMilestones(defaultSamples);
        return defaultSamples;
    }

    function saveStoredMilestones(milestones) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(milestones));
        } catch (e) {
            console.error("Error saving localStorage:", e);
        }
    }

    // Calendar Generation
    function renderCalendar() {
        const milestones = getStoredMilestones();
        const milestonesByDate = {};
        milestones.forEach(item => {
            milestonesByDate[item.date] = item;
        });

        if (!calendarGrid) return;
        calendarGrid.innerHTML = '';

        for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
            const season = SEASONS[monthIndex];
            const monthCard = document.createElement('div');
            monthCard.className = `month-card glass-card ${season.class}`;

            const monthHeader = document.createElement('div');
            monthHeader.className = 'month-header';
            monthHeader.innerHTML = `
                <h3 class="month-title">${MONTH_NAMES[monthIndex]}</h3>
                <span class="season-badge">${season.icon} ${season.name.toUpperCase()}</span>
            `;
            monthCard.appendChild(monthHeader);

            const daysHeader = document.createElement('div');
            daysHeader.className = 'days-header';
            ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(day => {
                const dayLabel = document.createElement('span');
                dayLabel.textContent = day;
                daysHeader.appendChild(dayLabel);
            });
            monthCard.appendChild(daysHeader);

            const daysGrid = document.createElement('div');
            daysGrid.className = 'days-grid';

            const firstDay = new Date(CURRENT_YEAR, monthIndex, 1).getDay();
            const totalDays = new Date(CURRENT_YEAR, monthIndex + 1, 0).getDate();

            for (let i = 0; i < firstDay; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'day-cell empty';
                daysGrid.appendChild(emptyCell);
            }

            for (let day = 1; day <= totalDays; day++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'day-cell';
                dayCell.textContent = day;

                const monthStr = String(monthIndex + 1).padStart(2, '0');
                const dayStr = String(day).padStart(2, '0');
                const dateKey = `${CURRENT_YEAR}-${monthStr}-${dayStr}`;

                if (milestonesByDate[dateKey]) {
                    const entry = milestonesByDate[dateKey];
                    dayCell.classList.add('has-milestone');
                    dayCell.title = entry.title;

                    dayCell.addEventListener('click', () => {
                        openModal(entry);
                    });
                }

                daysGrid.appendChild(dayCell);
            }

            monthCard.appendChild(daysGrid);
            calendarGrid.appendChild(monthCard);
        }
    }

    // Modal Display
    function openModal(entry) {
        if (!poemModal) return;
        activeModalEntryId = entry.id;

        const dateObj = new Date(entry.date + 'T00:00:00');
        const monthIdx = dateObj.getMonth();
        const season = SEASONS[monthIdx];

        if (modalSeasonBadge) modalSeasonBadge.textContent = `${season.icon} ${season.name}`;
        if (modalTitle) modalTitle.textContent = entry.title;
        if (modalDateStr) {
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
            modalDateStr.textContent = formattedDate;
        }
        if (modalPoemText) modalPoemText.textContent = entry.poemNote || "A special moment captured.";

        poemModal.classList.remove('hidden');
    }

    function closeModal() {
        if (poemModal) poemModal.classList.add('hidden');
        activeModalEntryId = null;
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (deleteEntryBtn) {
        deleteEntryBtn.addEventListener('click', () => {
            if (!activeModalEntryId) return;
            let milestones = getStoredMilestones();
            milestones = milestones.filter(m => m.id !== activeModalEntryId);
            saveStoredMilestones(milestones);
            closeModal();
            renderCalendar();
        });
    }

    // Drawer Controls
    if (toggleFormBtn) {
        toggleFormBtn.addEventListener('click', () => {
            if (entryDrawer) entryDrawer.classList.toggle('hidden');
        });
    }

    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', () => {
            if (entryDrawer) entryDrawer.classList.add('hidden');
        });
    }

    // Form Submission Logic
    if (milestoneForm) {
        milestoneForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const dateVal = document.getElementById('eventDate').value;
            const titleVal = document.getElementById('eventTitle').value.trim();
            const contextVal = document.getElementById('eventContext').value.trim();

            if (!dateVal || !titleVal) return;

            const newEntry = {
                id: 'entry-' + Date.now(),
                date: dateVal,
                title: titleVal,
                context: contextVal,
                poemNote: `A glowing memory recorded for "${titleVal}".`,
                season: "autumn"
            };

            const milestones = getStoredMilestones();
            milestones.push(newEntry);
            saveStoredMilestones(milestones);

            renderCalendar();

            if (entryDrawer) entryDrawer.classList.add('hidden');
            milestoneForm.reset();
        });
    }

    // Initial Render
    renderCalendar();
});
