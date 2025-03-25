const airdropsData = [
    {
        id: 1,
        title: "Chaos Labs",
        brief: "Chaos Labs builds technology that makes markets safer and more accessible. Our risk management systems, oracles, and AI models secure billions in value while democratizing access to world-class financial tools.",
        datePosted: "2025-03-24 15:30",
        expectedReward: "$100-$1000",
        expectedTGE: "Invalid",
        investmentRequired: false, // free airdrop
        investmentAmount: null,
        funding: "$55M",
        tasks: [
            "Sign up and join waitlist"
        ],
        joinLink: "https://chaoslabs.xyz/ai/signup"
    },
        {
        id: 2,
        title: "Billions Network",
        brief: "Billions network is a global network that integrated humans and AI using zero knowledge proof for enhanced privacy and trust",
        datePosted: "2025-03-24 16:00",
        expectedReward: "$100-$1000",
        expectedTGE: "Q3 2025",
        investmentRequired: false, // free airdrop
        investmentAmount: null,
        funding: "Invalid",
        tasks: [
            "Sign up with google",
            "Connect your wallet",
            "Complete simple tasks to get more power"
        ],
        joinLink: "https://signup.billions.network?rc=IMQPRDQZ"
    }

].sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted)); // Sort by newest first

// Add this updates data structure
const updatesData = [
    {
        id: 1,
        projectName: "Invalid",
        type: "important",
        timestamp: "2025-03-22 15:30",
        content: "🚨 Important: Join NexDrop!!!",
        telegramLink: "https://t.me/NexDrop"
    }
].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by newest first

// Simplified timeAgo function
function timeAgo(dateString) {
    const now = new Date();
    const posted = new Date(dateString.replace(' ', 'T')); // Convert to ISO format
    
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
        return 'just now';
    } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
}

// Simplified NEW tag check
function shouldShowNewTag(dateString) {
    const now = new Date();
    const posted = new Date(dateString.replace(' ', 'T'));
    const diffInHours = (now - posted) / (1000 * 60 * 60);
    return diffInHours <= 24;
}

// Add these user authentication functions
function initializeAuth() {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        updateUIForLoggedInUser(currentUser);
    }
}

function getCurrentUser() {
    // First try to get from localStorage
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
        return JSON.parse(storedUser);
    }
    
    // If not in localStorage, try to get from Telegram
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (telegramUser) {
        const user = {
            id: telegramUser.id.toString(),
            username: telegramUser.username,
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name
        };
        localStorage.setItem('userData', JSON.stringify(user));
        return user;
    }
    
    return null;
}

function getUserStorageKey(userId) {
    return `savedAirdrops_${userId}`;
}

function updateUIForLoggedInUser(user) {
    // Update any UI elements that should reflect logged-in state
    loadSavedAirdrops(user.id);
    updateSaveButtonStates(user.id);
}

// Add this function to render airdrop cards
function renderAirdropCard(airdrop) {
    const currentUser = getCurrentUser();
    const userId = currentUser ? currentUser.id : null;
    
    const isNew = shouldShowNewTag(airdrop.datePosted);
    
    const investmentAndFundingInfo = `
        <div class="info-badges">
            <div class="investment-badge ${airdrop.investmentRequired ? 'paid' : 'free'}">
                <div class="badge-icon">
                    <i class="fas ${airdrop.investmentRequired ? 'fa-coins' : 'fa-gift'}"></i>
                </div>
                <div class="badge-text">
                    <span class="badge-label">${airdrop.investmentRequired ? 'Investment Required' : 'Free to Join'}</span>
                    <span class="badge-value">${airdrop.investmentRequired ? airdrop.investmentAmount : 'No Investment'}</span>
                </div>
            </div>
            ${airdrop.funding ? `
            <div class="funding-badge">
                <div class="badge-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="badge-text">
                    <span class="badge-label">Total Funding</span>
                    <span class="badge-value">${airdrop.funding}</span>
                </div>
            </div>
            ` : ''}
        </div>`;

    const savedAirdrops = userId ? getSavedAirdrops(userId) : [];
    const isSaved = savedAirdrops.some(saved => saved.id === airdrop.id);

    const buttonGroup = `
        <div class="card-button-group">
            <a href="${airdrop.joinLink}" target="_blank" class="join-btn">
                JOIN AIRDROP
            </a>
            <button class="save-btn ${isSaved ? 'saved' : ''}" 
                    data-id="${airdrop.id}" 
                    onclick="handleSaveClick(${JSON.stringify(airdrop).replace(/"/g, '&quot;')})">
                <i class="fas ${isSaved ? 'fa-check' : 'fa-bookmark'}"></i>
            </button>
        </div>
    `;

    return `
        <div class="airdrop-card" data-date="${airdrop.datePosted}" data-id="${airdrop.id}">
            <div class="card-content">
                <div class="card-header">
                    <div class="title-section">
                        <div class="title-row">
                            <h2>${airdrop.title}</h2>
                            ${isNew ? `
                            <div class="new-badge">
                                <span class="new-tag">NEW</span>
                            </div>
                            ` : ''}
                        </div>
                        ${investmentAndFundingInfo}
                        <p class="project-brief">${airdrop.brief}</p>
                    </div>
                </div>
                
                <div class="reward-section">
                    <div class="reward-box">
                        <span class="label">Expected Reward</span>
                        <span class="value">${airdrop.expectedReward}</span>
                    </div>
                    <div class="reward-box">
                        <span class="label">Expected TGE</span>
                        <span class="value">${airdrop.expectedTGE}</span>
                    </div>
                </div>

                <div class="tasks-preview">
                    <div class="tasks-header" onclick="toggleTasks(this)">
                        <h3>Tasks</h3>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="tasks-content collapsed">
                        <ul>
                            ${airdrop.tasks.map(task => `<li>✦ ${task}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                ${buttonGroup}

                <span class="time-posted">
                    <i class="far fa-clock"></i>
                    Posted ${timeAgo(airdrop.datePosted)}
                </span>
            </div>
        </div>
    `;
}

// Add this function to render all airdrops
function renderAirdrops() {
    const airdropsGrid = document.querySelector('.airdrops-grid');
    
    // Sort airdrops by date before rendering
    const sortedAirdrops = [...airdropsData].sort((a, b) => 
        new Date(b.datePosted) - new Date(a.datePosted)
    );
    
    airdropsGrid.innerHTML = sortedAirdrops
        .map(airdrop => renderAirdropCard(airdrop))
        .join('');
    
    // Reinitialize tasks preview state
    document.querySelectorAll('.tasks-content').forEach(content => {
        if (content.scrollHeight > 65) {
            content.classList.add('collapsed');
        } else {
            content.classList.remove('collapsed');
            content.closest('.tasks-preview').querySelector('.tasks-header i').style.display = 'none';
        }
    });

    // Set up the Intersection Observer
    const observerOptions = {
        root: null, // use viewport
        rootMargin: '-30% 0px -60% 0px', // triggers when card is ~1/3 visible
        threshold: 0 // trigger as soon as even one pixel is visible
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('card-visible');
            } else {
                entry.target.classList.remove('card-visible');
            }
        });
    }, observerOptions);

    // Function to observe cards
    function observeCards() {
        const cards = document.querySelectorAll('.airdrop-card');
        cards.forEach(card => {
            cardObserver.observe(card);
            // Set initial state
            card.classList.add('card-fade');
        });
    }

    // Initial observation
    observeCards();
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        
        // Get user data
        const userData = window.Telegram.WebApp.initDataUnsafe?.user;
        if (userData) {
            const user = {
                id: userData.id.toString(),
                username: userData.username,
                firstName: userData.first_name,
                lastName: userData.last_name
            };
            
            // Store user data
            localStorage.setItem('userData', JSON.stringify(user));
            updateUIForLoggedInUser(user);
        }
    }

    // Handle splash screen and telegram popup sequence
    const splashScreen = document.querySelector('.splash-screen');
    const telegramPopup = document.querySelector('.telegram-popup');
    
    // First show splash screen
    setTimeout(() => {
        splashScreen.classList.add('fade-out');
        setTimeout(() => {
            splashScreen.style.display = 'none';
            // Show telegram popup after splash screen
            showTelegramPopup();
        }, 500);
    }, 1500);

    function showTelegramPopup() {
        // Get current visit count
        let visitCount = parseInt(localStorage.getItem('visitCount') || '0');
        visitCount++;
        
        // Store updated visit count
        localStorage.setItem('visitCount', visitCount.toString());

        // Show popup every 5th visit
        if (visitCount % 5 === 0) {
            telegramPopup.style.display = 'flex';
            setTimeout(() => {
                telegramPopup.classList.add('show');
            }, 100);
        }
    }

    

    // Handle popup buttons
    const maybeLaterBtn = document.querySelector('.maybe-later-btn');
    maybeLaterBtn.addEventListener('click', () => {
        telegramPopup.classList.remove('show');
        
        setTimeout(() => {
            telegramPopup.style.display = 'none';
        }, 300);
    });

    // Show airdrops section by default
    document.querySelector('.nav-item[data-section="airdrops"]').classList.add('active');
    document.getElementById('airdrops-section').classList.add('active');

    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get the current active section
            const currentSection = document.querySelector('.content-section.active');
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
 
            // Get target section
            const sectionId = `${this.dataset.section}-section`;
            const targetSection = document.getElementById(sectionId);
            
            // If there's a current section, fade it out first
            if (currentSection) {
                currentSection.style.opacity = '0';
                currentSection.style.transform = 'translateY(20px)';
                
                // Wait for fade out, then switch sections
                setTimeout(() => {
                    currentSection.classList.remove('active');
                    targetSection.classList.add('active');
                    
                    // Force a reflow to ensure the animation runs
                    targetSection.offsetHeight;
                    
                    // Fade in the new section
                    targetSection.style.opacity = '1';
                    targetSection.style.transform = 'translateY(0)';
                }, 300);
            } else {
                // If no current section, just show the target
                targetSection.classList.add('active');
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';
            }

            // Reset scroll position to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // If switching to updates section, re-render updates
            if (this.dataset.section === 'updates') {
                renderUpdates('all');
            }
        });
    });

    // Filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const airdropCards = document.querySelectorAll('.airdrop-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            airdropCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Enhanced search functionality
    const searchInput = document.querySelector('#searchInput');
    const clearSearchBtn = document.querySelector('.clear-search');
    const airdropsGrid = document.querySelector('.airdrops-grid');
    
    // Add this div after the airdrops-grid in your HTML
    const noResultsDiv = document.createElement('div');
    noResultsDiv.className = 'no-results';
    noResultsDiv.innerHTML = `
        <i class="fas fa-search"></i>
        <p>No airdrops found matching your search</p>
    `;
    airdropsGrid.parentNode.insertBefore(noResultsDiv, airdropsGrid.nextSibling);

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let hasResults = false;
        
        // Show/hide clear button
        clearSearchBtn.style.display = searchTerm ? 'flex' : 'none';
        
        document.querySelectorAll('.airdrop-card').forEach(card => {
            const title = card.querySelector('h2').textContent.toLowerCase();
            const brief = card.querySelector('.project-brief').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || brief.includes(searchTerm)) {
                card.style.display = 'block';
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });

        // Show/hide no results message
        noResultsDiv.style.display = hasResults ? 'none' : 'block';
        airdropsGrid.style.display = hasResults ? 'grid' : 'none';
    }

    // Search input event listener
    searchInput.addEventListener('input', performSearch);

    // Clear search button
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        performSearch();
        searchInput.focus();
    });

    // Add keyboard shortcut (Ctrl/Cmd + K) to focus search
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        // Press Esc to clear search
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            performSearch();
            searchInput.blur();
        }
    });

    // Modal functionality
    const modal = document.getElementById('airdropModal');
    const detailsBtns = document.querySelectorAll('.details-btn');
    const closeModal = document.querySelector('.close-modal');

    detailsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Initialize tasks preview state
    document.querySelectorAll('.tasks-content').forEach(content => {
        if (content.scrollHeight > 65) { // If content is taller than collapsed height
            content.classList.add('collapsed');
        } else {
            content.classList.remove('collapsed');
            content.closest('.tasks-preview').querySelector('.tasks-header i').style.display = 'none';
        }
    });

    // Initialize authentication
    initializeAuth();
    
    // Render airdrops
    renderAirdrops();
    
    // Update timestamps every minute
    setInterval(() => {
        document.querySelectorAll('.time-posted').forEach(timeElement => {
            const card = timeElement.closest('.airdrop-card');
            const datePosted = card.dataset.date;
            timeElement.textContent = timeAgo(datePosted);
        });
    }, 60000);

    initializeUpdates();
    initializeUpdatesSearch();
    initializeManageSection();
});

// Update the updateNewTags function to use actual current time
function updateNewTags() {
    const currentTime = new Date();
    const airdropCards = document.querySelectorAll('.airdrop-card');
    
    airdropCards.forEach(card => {
        const datePosted = card.dataset.date;
        
        // Skip if date is in future
        if (new Date(datePosted) > currentTime) {
            const newBadge = card.querySelector('.new-badge');
            if (newBadge) newBadge.style.display = 'none';
            return;
        }

        const timeDifference = currentTime - new Date(datePosted);
        const hoursDifference = timeDifference / (1000 * 60 * 60);
        
        const newBadge = card.querySelector('.new-badge');
        const timeLeft = card.querySelector('.time-left');
        
        if (hoursDifference <= 24) {
            newBadge.style.display = 'block';
            
            // Calculate and display time left
            const hoursLeft = Math.floor(24 - hoursDifference);
            const minutesLeft = Math.floor((24 - hoursDifference - hoursLeft) * 60);
            
            if (hoursLeft > 0) {
                timeLeft.textContent = `${hoursLeft}h ${minutesLeft}m left`;
            } else {
                timeLeft.textContent = `${minutesLeft}m left`;
            }
        } else {
            newBadge.style.display = 'none';
        }
    });
}

// Run immediately and then every minute
updateNewTags();
setInterval(updateNewTags, 60000);

// Add this new function
function toggleTasks(header) {
    const tasksPreview = header.closest('.tasks-preview');
    const tasksContent = tasksPreview.querySelector('.tasks-content');
    const arrow = header.querySelector('i');
    
    tasksPreview.classList.toggle('expanded');
    tasksContent.classList.toggle('collapsed');
    
    // Optional: Scroll into view if expanding and content is cut off
    if (!tasksContent.classList.contains('collapsed')) {
        setTimeout(() => {
            tasksContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }
}

// Example of adding a new airdrop with funding
addNewAirdrop({
    title: "New Protocol",
    brief: "Description here",
    expectedReward: "$100-$500",
    expectedTGE: "Q2 2024",
    investmentRequired: true,
    investmentAmount: "2 ETH",
    funding: "$5M",
    tasks: ["Task 1", "Task 2"],
    joinLink: "https://youtube.com"
});

function initializeUpdates() {
    const filterChips = document.querySelectorAll('.filter-chip');
    
    // First render all updates when page loads
    renderUpdates('all');
    
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Update active state
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            // Filter updates
            const filter = chip.dataset.filter;
            renderUpdates(filter);
        });
    });
}

// Add this function to render a single update
function renderUpdate(update) {
    const taskPreview = update.taskDetails ? `
        <div class="task-preview">
            <h4>Task Details:</h4>
            <ul>
                ${update.taskDetails.map(task => `<li>✦ ${task}</li>`).join('')}
            </ul>
        </div>
    ` : '';

    return `
        <div class="update-card ${update.type}" data-timestamp="${update.timestamp}">
            <div class="update-header">
                <div class="update-project">
                    <span class="project-name">${update.projectName}</span>
                    <span class="update-tag ${update.type}">${update.type.replace('-', ' ').toUpperCase()}</span>
                </div>
                <span class="update-time">${timeAgo(update.timestamp)}</span>
            </div>
            <div class="update-content">
                <p>${update.content}</p>
                ${taskPreview}
            </div>
            <a href="${update.telegramLink}" target="_blank" class="more-details-btn">
                <i class="fab fa-telegram"></i> VISIT CHAT GROUP
            </a>
        </div>
    `;
}

// Add this function to render all updates
function renderUpdates(filter = 'all', searchTerm = '') {
    const updatesContainer = document.querySelector('.updates-container');
    const noResults = document.getElementById('updatesNoResults');
    
    let filteredUpdates = updatesData;
    
    // Apply filter
    if (filter !== 'all') {
        filteredUpdates = filteredUpdates.filter(update => update.type === filter);
    }
    
    // Apply search
    if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredUpdates = filteredUpdates.filter(update => 
            update.projectName.toLowerCase().includes(searchLower) ||
            update.content.toLowerCase().includes(searchLower)
        );
    }

    // Show/hide no results message
    if (filteredUpdates.length === 0) {
        updatesContainer.style.display = 'none';
        noResults.style.display = 'block';
    } else {
        updatesContainer.style.display = 'flex';
        noResults.style.display = 'none';
    }

    // Render updates
    updatesContainer.innerHTML = filteredUpdates
        .map(update => renderUpdate(update))
        .join('');
}

// Add search functionality to updates section
function initializeUpdatesSearch() {
    const searchInput = document.getElementById('updatesSearchInput');
    const clearButton = searchInput.parentElement.querySelector('.clear-search');
    const filterChips = document.querySelectorAll('.updates-filter .filter-chip');
    let currentFilter = 'all';

    // Search input handler
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        clearButton.style.display = searchTerm ? 'flex' : 'none';
        renderUpdates(currentFilter, searchTerm);
    });

    // Clear search button
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        clearButton.style.display = 'none';
        renderUpdates(currentFilter, '');
        searchInput.focus();
    });

    // Update filter click handlers
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.dataset.filter;
            renderUpdates(currentFilter, searchInput.value);
        });
    });
}

// Function to add a new update
function addNewUpdate(updateData) {
    const now = new Date();
    const timestamp = now.getFullYear() + '-' + 
                     String(now.getMonth() + 1).padStart(2, '0') + '-' +
                     String(now.getDate()).padStart(2, '0') + ' ' +
                     String(now.getHours()).padStart(2, '0') + ':' +
                     String(now.getMinutes()).padStart(2, '0');

    const newUpdate = {
        id: updatesData.length + 1,
        timestamp: timestamp,
        ...updateData
    };

    // Add to beginning of array to maintain newest first order
    updatesData.unshift(newUpdate);
    
    // Re-render updates
    const searchTerm = document.getElementById('updatesSearchInput').value;
    const currentFilter = document.querySelector('.updates-filter .filter-chip.active').dataset.filter;
    renderUpdates(currentFilter, searchTerm);
}

// Update the initializeManageSection function
function initializeManageSection() {
    const currentUser = getCurrentUser();
    const container = document.querySelector('.saved-airdrops-container');
    
    if (!currentUser) {
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-telegram"></i>
                    <h3>Connect Telegram</h3>
                    <p>Connect your Telegram account to save and manage airdrops</p>
                    <button class="login-btn" onclick="window.Telegram?.WebApp?.expand()">
                        Connect Telegram
                    </button>
                </div>
            `;
        }
        return;
    }

    // Initialize for logged-in user
    loadSavedAirdrops(currentUser.id);
    
    // Set up search and view toggle
    setupManageSectionControls();
}

function setupManageSectionControls() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const savedAirdropsContainer = document.querySelector('.saved-airdrops-container');
    const searchInput = document.getElementById('manageSearchInput');
    const clearSearchBtn = searchInput?.parentElement.querySelector('.clear-search');
    
    if (viewBtns && savedAirdropsContainer) {
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const view = btn.dataset.view;
                savedAirdropsContainer.className = `saved-airdrops-container ${view}-view`;
            });
        });
    }

    if (searchInput && clearSearchBtn) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            clearSearchBtn.style.display = searchTerm ? 'flex' : 'none';
            filterSavedAirdrops(searchTerm);
        });

        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearSearchBtn.style.display = 'none';
            filterSavedAirdrops('');
            searchInput.focus();
        });
    }
}

// Update storage functions to be user-specific
function getSavedAirdrops(userId) {
    const storageKey = getUserStorageKey(userId);
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
}

function setSavedAirdrops(userId, airdrops) {
    const storageKey = getUserStorageKey(userId);
    localStorage.setItem(storageKey, JSON.stringify(airdrops));
}

// Update the toggleSaveAirdrop function
function toggleSaveAirdrop(airdropData, userId) {
    if (!userId) {
        showToast('Please login to save airdrops');
        return;
    }

    const savedAirdrops = getSavedAirdrops(userId);
    const isSaved = savedAirdrops.some(saved => saved.id === airdropData.id);
    
    if (isSaved) {
        showCustomPopup(
            'Unsave Airdrop',
            'Are you sure you want to remove this airdrop from your saved list?',
            'Remove',
            'Cancel',
            () => {
                const updatedAirdrops = savedAirdrops.filter(airdrop => airdrop.id !== airdropData.id);
                setSavedAirdrops(userId, updatedAirdrops);
                
                document.querySelectorAll(`.save-btn[data-id="${airdropData.id}"]`).forEach(btn => {
                    btn.classList.remove('saved');
                    btn.querySelector('i').className = 'fas fa-bookmark';
                });
                
                showToast('Airdrop removed from saved list');
                updateManageSection(userId);
            }
        );
    } else {
        const newSavedAirdrop = {
            ...airdropData,
            savedAt: new Date().toISOString()
        };
        
        savedAirdrops.push(newSavedAirdrop);
        setSavedAirdrops(userId, savedAirdrops);
        
        document.querySelectorAll(`.save-btn[data-id="${airdropData.id}"]`).forEach(btn => {
            btn.classList.add('saved');
            btn.querySelector('i').className = 'fas fa-check';
        });
        
        showToast('Airdrop saved successfully!');
        updateManageSection(userId);
    }
}

// Update the loadSavedAirdrops function
function loadSavedAirdrops(userId) {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        showLoginPrompt();
        return;
    }

    const savedAirdrops = getSavedAirdrops(currentUser.id);
    const container = document.querySelector('.saved-airdrops-container');
    
    if (!container) return;
    
    if (savedAirdrops.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bookmark"></i>
                <h3>No saved airdrops</h3>
                <p>Start saving airdrops to track them here!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = savedAirdrops
        .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
        .map(airdrop => renderSavedCard(airdrop, currentUser.id))
        .join('');
}

// Update the deleteSavedAirdrop function
function deleteSavedAirdrop(id, userId) {
    if (!userId) {
        showToast('Please login to manage airdrops');
        return;
    }

    showCustomPopup(
        'Remove Saved Airdrop',
        'Are you sure you want to remove this airdrop from your saved list?',
        'Remove',
        'Cancel',
        () => {
            const savedAirdrops = getSavedAirdrops(userId);
            const updatedAirdrops = savedAirdrops.filter(airdrop => airdrop.id !== id);
            setSavedAirdrops(userId, updatedAirdrops);
            
            document.querySelectorAll(`.save-btn[data-id="${id}"]`).forEach(btn => {
                btn.classList.remove('saved');
                btn.querySelector('i').className = 'fas fa-bookmark';
            });
            
            showToast('Airdrop removed from saved list');
            updateManageSection(userId);
        }
    );
}

// Update the renderSavedCard function
function renderSavedCard(airdrop, userId) {
    return `
        <div class="saved-card" data-id="${airdrop.id}">
            <div class="card-content">
                <h3>${airdrop.title}</h3>
                <div class="airdrop-info">
                    <span class="reward">${airdrop.expectedReward}</span>
                    <span class="tge">${airdrop.expectedTGE}</span>
                </div>
            </div>
            <div class="actions">
                <a href="${airdrop.joinLink}" target="_blank" class="visit-btn">
                    <i class="fas fa-external-link-alt"></i>
                    Visit
                </a>
                <button class="delete-btn" onclick="deleteSavedAirdrop(${airdrop.id}, '${userId}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `;
}

// Update statistics
function updateStats() {
    const savedAirdrops = JSON.parse(localStorage.getItem('savedAirdrops') || '[]');
    const completedAirdrops = savedAirdrops.filter(airdrop => airdrop.progress === 100);
    
    document.getElementById('savedCount').textContent = savedAirdrops.length;
    document.getElementById('completedCount').textContent = completedAirdrops.length;
}

// Update the showCustomPopup function
function showCustomPopup(title, message, confirmText, cancelText, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    
    const popup = document.createElement('div');
    popup.className = 'custom-popup';
    
    popup.innerHTML = `
        <div class="popup-content">
            <h3 class="popup-title">${title}</h3>
            <p class="popup-message">${message}</p>
            <div class="popup-buttons">
                <button class="popup-btn cancel">${cancelText}</button>
                <button class="popup-btn confirm">${confirmText}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    
    requestAnimationFrame(() => {
        overlay.classList.add('show');
        popup.classList.add('show');
    });
    
    const confirmBtn = popup.querySelector('.popup-btn.confirm');
    const cancelBtn = popup.querySelector('.popup-btn.cancel');
    
    function closePopup() {
        overlay.classList.remove('show');
        popup.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(overlay);
            document.body.removeChild(popup);
        }, 200);
    }
    
    confirmBtn.addEventListener('click', () => {
        onConfirm();
        closePopup();
    });
    
    cancelBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', closePopup);
}

// Update the updateManageSection function
function updateManageSection(userId) {
    const manageSection = document.getElementById('manage-section');
    if (manageSection && manageSection.classList.contains('active')) {
        loadSavedAirdrops(userId);
    }
}

// Toast notification function
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }, 100);
}

// Update the handleSaveClick function
function handleSaveClick(airdropData) {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        if (isInTelegram()) {
            handleTelegramConnect();
        } else {
            showCustomPopup(
                'Open in Telegram',
                'Please open this app in Telegram to save airdrops',
                'Open Telegram',
                'Cancel',
                () => {
                    window.open('https://t.me/NexDrop_bot', '_blank');
                }
            );
        }
        return;
    }
    
    toggleSaveAirdrop(airdropData, currentUser.id);
}

// Add this function to update all save buttons
function updateSaveButtonStates(userId) {
    const savedAirdrops = getSavedAirdrops(userId);
    document.querySelectorAll('.save-btn').forEach(btn => {
        const airdropId = parseInt(btn.dataset.id);
        const isSaved = savedAirdrops.some(saved => saved.id === airdropId);
        
        btn.classList.toggle('saved', isSaved);
        btn.querySelector('i').className = `fas ${isSaved ? 'fa-check' : 'fa-bookmark'}`;
    });
}

// Update the filterSavedAirdrops function
function filterSavedAirdrops(searchTerm) {
    const savedAirdrops = getSavedAirdrops(currentUser.id);
    const filteredAirdrops = savedAirdrops.filter(airdrop => {
        const title = airdrop.title.toLowerCase();
        const brief = airdrop.brief.toLowerCase();
        return title.includes(searchTerm) || brief.includes(searchTerm);
    });
    
    const container = document.querySelector('.saved-airdrops-container');
    container.innerHTML = filteredAirdrops
        .map(airdrop => renderSavedCard(airdrop, currentUser.id))
        .join('');
}

// Update the showLoginPrompt function
function showLoginPrompt() {
    const container = document.querySelector('.saved-airdrops-container');
    if (container) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fab fa-telegram"></i>
                <h3>Connect with Telegram</h3>
                <p>${isInTelegram() ? 
                    'Click connect to manage your saved airdrops' : 
                    'Please open this app in Telegram to manage your saved airdrops'}</p>
                ${isInTelegram() ? `
                    <button class="connect-btn" onclick="handleTelegramConnect()">
                        <i class="fab fa-telegram"></i>
                        Connect
                    </button>
                ` : `
                    <button class="connect-btn" onclick="window.open('https://t.me/NexDrop_bot', '_blank')">
                        <i class="fab fa-telegram"></i>
                        Open in Telegram
                    </button>
                `}
            </div>
        `;
    }
}

// Add function to handle Telegram connection
function handleTelegramConnect() {
    if (!window.Telegram?.WebApp) {
        // If not in Telegram WebApp, show a toast and redirect
        showToast('Please open this app in Telegram');
        setTimeout(() => {
            window.open('https://t.me/NexDrop_bot', '_blank');
        }, 1000);
        return;
    }

    // If in Telegram WebApp
    window.Telegram.WebApp.expand();
    
    const userData = window.Telegram.WebApp.initDataUnsafe?.user;
    if (userData) {
        const user = {
            id: userData.id.toString(),
            username: userData.username,
            firstName: userData.first_name,
            lastName: userData.last_name
        };
        
        localStorage.setItem('userData', JSON.stringify(user));
        updateUIForLoggedInUser(user);
        showToast('Successfully connected with Telegram');
    } else {
        showToast('Please open this app in Telegram');
    }
}

// Add this function to check if we're in Telegram
function isInTelegram() {
    return !!window.Telegram?.WebApp;
} 
