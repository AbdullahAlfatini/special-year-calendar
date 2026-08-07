/**
 * My Special Year Calendar — Application Logic
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
        4: { name: "Spring", class: "season-spring", icon: "🌿" },
        5: { name: "Summer", class: "season-summer", icon: "☀️" },
        6: { name: "Summer", class: "season-summer", icon: "🌻" },
        7: { name: "Summer", class: "season-summer", icon: "🌊" },
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
                poemNote: "As October's golden leaves gather in gentle light, sixty years of warmth blossom like a garden held in quiet love.",
                season: "autumn"
            },
            {
                id: "sample-2",
                date: "2026-05-24",
                title: "Wedding Anniversary",
                context: "Favorite spring evening",
                poemNote: "May's twilight breeze whispers sweet memories of promises spoken beneath blooming branches.",
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

        calendarGrid.innerHTML = '';

        for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
            const monthCard = document.createElement('div');
            monthCard.className = 'month-card glass-card';
            monthCard.dataset.month = monthIndex;

            const seasonInfo = SEASONS[monthIndex];

            // Month Header
            const header = document.createElement('div');
            header.className = 'month-header';
            header.innerHTML = `
                <div class="month-name">${MONTH_NAMES[monthIndex]}</div>
                <div class="month-season ${seasonInfo.class}">${seasonInfo.icon} ${seasonInfo.name}</div>
            `;
            monthCard.appendChild(header);

            // Days Header (Sun - Sat)
            const daysHeader = document.createElement('div');
            daysHeader.className = 'days-header';
            ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(day => {
                const el = document.createElement('div');
                el.textContent = day;
                daysHeader.appendChild(el);
            });
            monthCard.appendChild(daysHeader);

            // Days Grid
            const daysGrid = document.createElement('div');
            daysGrid.className = 'days-grid';

            const firstDay = new Date(CURRENT_YEAR, monthIndex, 1).getDay();
            const daysInMonth = new Date(CURRENT_YEAR, monthIndex + 1, 0).getDate();

            // Empty padding days before day 1
            for (let i = 0; i < firstDay; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'day-cell empty';
                daysGrid.appendChild(emptyCell);
            }

            // Month Days
            for (let day = 1; day <= daysInMonth; day++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'day-cell';
                dayCell.textContent = day;

                const formattedMonth = String(monthIndex + 1).padStart(2, '0');
                const formattedDay = String(day).padStart(2, '0');
                const dateKey = `${CURRENT_YEAR}-${formattedMonth}-${formattedDay}`;

                if (milestonesByDate[dateKey]) {
                    const entry = milestonesByDate[dateKey];
                    dayCell.classList.add('has-milestone');
                    dayCell.title = `${entry.title} — Tap to read poem note`;
                    
                    const dot = document.createElement('span');
                    dot.className = 'milestone-dot';
                    dayCell.appendChild(dot);

                    dayCell.addEventListener('click', () => {
                        openPoemModal(entry);
                    });
                }

                daysGrid.appendChild(dayCell);
            }

            monthCard.appendChild(daysGrid);
            calendarGrid.appendChild(monthCard);
        }
    }

    // Modal Control
    function openPoemModal(entry) {
        activeModalEntryId = entry.id;
        modalTitle.textContent = entry.title;
        
        const dateObj = new Date(entry.date + 'T00:00:00');
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        modalDateStr.textContent = dateObj.toLocaleDateString('en-US', options);
        
        const seasonName = entry.season ? entry.season.charAt(0).toUpperCase() + entry.season.slice(1) : "Season";
        modalSeasonBadge.textContent = `✦ ${seasonName}`;

        modalPoemText.textContent = `“${entry.poemNote}”`;
        poemModal.classList.remove('hidden');
    }

    function closeModal() {
        poemModal.classList.add('hidden');
        activeModalEntryId = null;
    }

    closeModalBtn.addEventListener('click', closeModal);
    poemModal.addEventListener('click', (e) => {
        if (e.target === poemModal) closeModal();
    });

    // Delete Milestone Entry
    deleteEntryBtn.addEventListener('click', () => {
        if (!activeModalEntryId) return;
        let milestones = getStoredMilestones();
        milestones = milestones.filter(m => m.id !== activeModalEntryId);
        saveStoredMilestones(milestones);
        closeModal();
        renderCalendar();
    });

    // Form Drawer Control
    toggleFormBtn.addEventListener('click', () => {
        entryDrawer.classList.toggle('hidden');
    });

    closeDrawerBtn.addEventListener('click', () => {
        entryDrawer.classList.add('hidden');
    });

  // Handle Form Submission
milestoneForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dateVal = document.getElementById('eventDate').value;
    const titleVal = document.getElementById('eventTitle').value.trim();
    const contextVal = document.getElementById('eventContext').value.trim();

    if (!dateVal || !titleVal) return;

    const btnText = submitBtn.querySelector('.btn-text');
    if (btnText) btnText.textContent = "Weaving Poem Note...";

    // إنشاء العنصر وتحديث التخزين والتقويم
    const newEntry = {
        id: 'entry-' + Date.now(),
        date: dateVal,
        title: titleVal,
        context: contextVal,
        poemNote: `A glowing memory recorded for ${titleVal}.`,
        season: "autumn"
    };

    const milestones = getStoredMilestones();
    milestones.push(newEntry);
    saveStoredMilestones(milestones);

    if (typeof renderCalendar === 'function') {
        renderCalendar();
    }

    // إعادة ضبط الزر والنموذج
    if (btnText) btnText.textContent = "Generate Poem Note";
    submitBtn.disabled = false;
    
    if (entryDrawer) {
        entryDrawer.classList.add('hidden');
    }
    
    milestoneForm.reset();
});
