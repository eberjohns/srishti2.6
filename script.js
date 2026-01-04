document.addEventListener('DOMContentLoaded', () => {
    const switchInput = document.getElementById('retro-switch');

    function handleSwitchChange(event) {
        if (event.target.checked) {
            alert('Registration Initialized!');
            // Or, redirect to a registration page:
            // window.location.href = 'registration.html';
        }
    }

    if(switchInput) {
        switchInput.addEventListener('change', handleSwitchChange);
    }
});

// --- SPARKLE GENERATOR (NEW) ---
function createSparkles() {
    const container = document.getElementById('sparkles');
    const count = 100; // Number of stars

    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 3 + 1; // 1px to 4px
        
        // Random animation delay
        const delay = Math.random() * 2;
        const duration = Math.random() * 2 + 1; // 1s to 3s

        sparkle.style.left = x + '%';
        sparkle.style.top = y + '%';
        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';
        sparkle.style.animationDelay = delay + 's';
        sparkle.style.setProperty('--duration', duration + 's');
        
        container.appendChild(sparkle);
    }
}

// --- DATA STORE ---
let eventsData = [];
let schedule = {};

// --- ASYNC DATA FETCHING ---
async function fetchData() {
    try {
        // Initialize visual effects immediately
        createSparkles();

        // Fetch both data sources in parallel
        const [eventsResponse, scheduleResponse] = await Promise.all([
            fetch("data/events.json"),
            fetch("data/schedule.json")
        ]);

        if (!eventsResponse.ok || !scheduleResponse.ok) {
            throw new Error(`HTTP error!`);
        }

        eventsData = await eventsResponse.json();
        schedule = await scheduleResponse.json();
        
        renderEvents('all');
        switchDay(1); 
    } catch (error) {
        console.error("Failed to fetch initial data:", error);
        document.getElementById('event-list').innerHTML = `<p class="mono" style="color: var(--text-muted); padding: 2rem 0;">Could not load event data.</p>`;
        document.getElementById('timeline').innerHTML = `<p class="mono" style="color: var(--text-muted); padding: 2rem 0;">Could not load schedule.</p>`;
    }
}

// --- SCHEDULE LOGIC ---
function renderSchedule(day) {
    const container = document.getElementById('timeline');
    container.innerHTML = '';
    
    if (!schedule || !schedule[day] || schedule[day].length === 0) {
        container.innerHTML = `<div class="timeline-item"><p class="mono">No schedule available.</p></div>`;
        return;
    }

    schedule[day].forEach(s => {
        container.innerHTML += `
            <div class="timeline-item">
                <span class="time">${s.time}</span>
                <h4>${s.name}</h4>
                <span class="timeline-cat mono">${s.cat}</span>
            </div>
        `;
    });
}

function switchDay(day) {
    document.querySelectorAll('.day-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i + 1 === day);
    });
    renderSchedule(day);
}

// --- RENDER LOGIC ---
function renderEvents(filter) {
    const list = document.getElementById('event-list');
    list.innerHTML = '';
    
    const filtered = filter === 'all' 
        ? eventsData 
        : eventsData.filter(e => e.category.toLowerCase() === filter);

    if (!filtered || filtered.length === 0) {
            list.innerHTML = filter === 'all' 
            ? `<p class="mono" style="color: var(--text-muted);">Loading events...</p>`
            : `<p class="mono" style="color: var(--text-muted);">No events in this category.</p>`;
        return;
    }
    
    filtered.forEach(e => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.onclick = () => openModal(e);
        card.innerHTML = `
            <img src="${e.image}" class="card-img" alt="${e.title}">
            <div class="card-body">
                <span class="tag">${e.category}</span>
                <h3>${e.title}</h3>
                <p class="mono" style="margin-top: 0.5rem; opacity: 0.7;">${e.fee} • Win ${e.prize}</p>
            </div>
        `;
        list.appendChild(card);
    });
}

function filterEvents(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderEvents(cat);
}

// --- MODAL LOGIC ---
const modal = document.getElementById('modal');
function openModal(e) {
    document.getElementById('modal-img').src = e.image;
    document.getElementById('modal-cat').innerText = e.category;
    document.getElementById('modal-title').innerText = e.title;
    document.getElementById('modal-desc').innerText = e.description;
    document.getElementById('modal-fee').innerText = e.fee;
    document.getElementById('modal-prize').innerText = e.prize;
    modal.classList.add('active');
}
function closeModal(e) {
    if (e.target.id === 'modal') modal.classList.remove('active');
}

// --- COUNTDOWN TIMER ---
const dest = new Date("Jan 20, 2026 09:00:00").getTime();
const countdownEl = document.getElementById('countdown');
const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const diff = dest - now;
    if (diff <= 0) {
        countdownEl.innerHTML = `<span class="segment" style="padding: 10px 20px;"><span class="digits">LIVE</span></span>`;
        clearInterval(countdownInterval);
        return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    countdownEl.innerHTML = `
        <span class="segment"><span class="digits">${String(d).padStart(2, '0')}</span><span class="unit">DAY</span></span>
        <span class="segment"><span class="digits">${String(h).padStart(2, '0')}</span><span class="unit">HOUR</span></span>
        <span class="segment"><span class="digits">${String(m).padStart(2, '0')}</span><span class="unit">MIN</span></span>
        <span class="segment"><span class="digits">${String(s).padStart(2, '0')}</span><span class="unit">SEC</span></span>
    `;
}, 1000);

document.addEventListener('DOMContentLoaded', () => {
    fetchData();

    const switchInput = document.getElementById('retro-switch');

    function handleSwitchChange(event) {
        if (event.target.checked) {
            alert('Registration Initialized!');
            // Or, redirect to a registration page:
            // window.location.href = 'registration.html';
        }
    }

    if(switchInput) {
        switchInput.addEventListener('change', handleSwitchChange);
    }
});
