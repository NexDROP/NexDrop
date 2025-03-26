const API_BASE_URL = 'https://nexdrop.pythonanywhere.com'; // You'll replace this with your actual backend URL

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

// Add this function to render airdrop cards
function renderAirdropCard(airdrop) {
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

                <div class="card-actions">
                    <a href="${airdrop.joinLink}" target="_blank" class="join-btn">
                        JOIN AIRDROP
                    </a>
                    <button class="save-btn icon-only" onclick="handleSaveAirdrop(${airdrop.id}, event)" aria-label="${airdrop.id in (JSON.parse(localStorage.getItem('savedAirdrops') || '[]')) ? 'Unsave airdrop' : 'Save airdrop'}">
                        <i class="${airdrop.id in (JSON.parse(localStorage.getItem('savedAirdrops') || '[]')) ? 'fas' : 'far'} fa-bookmark"></i>
                    </button>
                </div>

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

    // Update saved buttons state based on localStorage
    const savedAirdropIds = JSON.parse(localStorage.getItem('savedAirdrops') || '[]');
    savedAirdropIds.forEach(id => {
        const saveBtn = document.querySelector(`.airdrop-card[data-id="${id}"] .save-btn`);
        if (saveBtn) {
            saveBtn.classList.add('saved');
            saveBtn.querySelector('i').className = 'fas fa-bookmark';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
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

    // Initialize the manage section HTML
    document.getElementById('manage-section').innerHTML = `
        <div class="header">
            <div class="header-content">
                <h1>Saved Airdrops</h1>
                <div class="search-bar">
                    <i class="fas fa-search"></i>
                    <input type="text" id="savedSearchInput" placeholder="Search saved airdrops...">
                    <button class="clear-search" style="display: none;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="manage-header-flex">
            <div class="welcome-minimal">
                <div class="welcome-content">
                    <div class="wave-emoji">📌</div>
                    <div class="welcome-text">
                        <h2>Your Favorites</h2>
                        <p>Access saved airdrops anytime</p>
                    </div>
                </div>
            </div>
            
            <div class="saved-stats">
                <div class="stat-card">
                    <div class="stat-value" id="savedCount">0</div>
                    <div class="stat-label">Saved Airdrops</div>
                </div>
            </div>
        </div>
        
        <div class="saved-airdrops-container">
            <div class="saved-airdrops">
                <!-- Saved airdrops will be rendered here -->
            </div>
            
            <div class="no-saved-airdrops" style="display: none;">
                <i class="far fa-bookmark"></i>
                <p>No saved airdrops</p>
                <a href="#" class="minimal-btn" onclick="switchToAirdrops()">
                    Explore
                </a>
            </div>
        </div>
    `;
    
    // Remove any "coming soon" content if it exists
    const comingSoonContent = document.querySelector('.coming-soon-container');
    if (comingSoonContent) {
        comingSoonContent.remove();
    }
    
    // Initialize user ID if not already set
    if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', 'user_' + Math.random().toString(36).substring(2, 15));
    }
    
    // Update saved buttons state based on localStorage
    const savedAirdropIds = JSON.parse(localStorage.getItem('savedAirdrops') || '[]');
    savedAirdropIds.forEach(id => {
        const saveBtn = document.querySelector(`.airdrop-card[data-id="${id}"] .save-btn`);
        if (saveBtn) {
            saveBtn.classList.add('saved');
            saveBtn.querySelector('i').className = 'fas fa-bookmark';
        }
    });
    
    // Initialize manage section
    updateManageSectionWithLocalData();

    // Remove the old modal if it exists
    const oldModal = document.getElementById('confirmationModal');
    if (oldModal) {
        oldModal.remove();
    }

    // Create a new confirmation modal
    const newModal = document.createElement('div');
    newModal.id = 'confirmationModal';
    newModal.className = 'confirmation-modal';
    newModal.innerHTML = `
        <div class="confirmation-content">
            <p id="confirmationMessage">Are you sure you want to remove this airdrop?</p>
            <div class="confirmation-buttons">
                <button id="cancelButton" class="cancel-btn">Cancel</button>
                <button id="confirmButton" class="confirm-btn">Remove</button>
            </div>
        </div>
    `;
    document.body.appendChild(newModal);

    // Also ensure the saved count is correctly displayed initially
    updateSavedCountDisplay();

    // Specifically target and remove any lock icons from the manage tab
    const manageTab = document.querySelector('.nav-item[data-section="manage"]');
    if (manageTab) {
        // Replace all icon elements in the manage tab with a bookmark icon
        const icons = manageTab.querySelectorAll('i');
        icons.forEach(icon => {
            // Replace with bookmark icon regardless of current class
            icon.className = 'fas fa-bookmark';
        });
        
        // Also handle any ::after pseudo-elements that might be showing a lock
        // Add a style tag to override any pseudo-elements
        const style = document.createElement('style');
        style.textContent = `
            .nav-item[data-section="manage"]::after,
            .nav-item[data-section="manage"] *::after {
                content: none !important;
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Track user visit immediately when page loads
    trackUserVisit();

    // Initialize the user first
    initializeTelegramUser();
    
    // Then initialize saved buttons
    initializeSavedButtons();
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

// Update the renderSavedAirdropCard function
function renderSavedAirdropCard(airdrop) {
    return `
        <div class="saved-airdrop-card" data-id="${airdrop.id}">
            <div class="saved-card-content">
                <div class="saved-card-header">
                    <h3>${airdrop.title}</h3>
                    <div class="reward-tag">${airdrop.expectedReward}</div>
                </div>
                
                <p class="saved-brief">${airdrop.brief.substring(0, 100)}${airdrop.brief.length > 100 ? '...' : ''}</p>
                
                <div class="saved-card-footer">
                    <div class="saved-card-actions">
                        <a href="${airdrop.joinLink}" target="_blank" class="compact-join-btn">
                            VISIT
                        </a>
                        <button class="remove-btn" onclick="handleRemoveAirdrop(${airdrop.id}, event)">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <div class="saved-meta">
                        <span class="saved-tag">
                            <i class="fas fa-bookmark"></i>
                            Saved
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Replace the existing showConfirmationModal function with this improved version
function showConfirmationModal(message, onConfirm) {
    const modal = document.getElementById('confirmationModal');
    const msgEl = document.getElementById('confirmationMessage');
    const confirmBtn = document.getElementById('confirmButton');
    const cancelBtn = document.getElementById('cancelButton');
    
    // Set the message
    msgEl.textContent = message;
    
    // Remove any existing event listeners to prevent duplicates
    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    
    // Add new event listeners
    newConfirmBtn.addEventListener('click', function() {
        onConfirm();
        modal.style.display = 'none';
    });
    
    newCancelBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Show the modal
    modal.style.display = 'flex';
}

// Add this helper function for user-specific localStorage
function getUserStorage() {
    const userId = localStorage.getItem('userId') || 'anonymous';
    
    // Create a user-specific storage wrapper
    return {
        getItem: function(key) {
            return localStorage.getItem(`${userId}_${key}`);
        },
        setItem: function(key, value) {
            return localStorage.setItem(`${userId}_${key}`, value);
        },
        removeItem: function(key) {
            return localStorage.removeItem(`${userId}_${key}`);
        },
        // Get a raw key for direct operations
        getKey: function(key) {
            return `${userId}_${key}`;
        }
    };
}

// Now replace all localStorage operations with userStorage
// For example:

function handleSaveAirdrop(airdropId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Get user-specific storage
    const userStorage = getUserStorage();
    
    // Get current saved airdrops
    let savedAirdrops = JSON.parse(userStorage.getItem('savedAirdrops') || '[]');
    const isAlreadySaved = savedAirdrops.includes(airdropId);
    
    const saveBtn = document.querySelector(`.airdrop-card[data-id="${airdropId}"] .save-btn`);
    
    if (isAlreadySaved) {
        // Show confirmation dialog for unsaving
        showConfirmationModal(
            'Are you sure you want to unsave this airdrop?', 
            function() {
                // Remove from saved
                savedAirdrops = savedAirdrops.filter(id => id !== airdropId);
                userStorage.setItem('savedAirdrops', JSON.stringify(savedAirdrops));
                
                // Update button
                if (saveBtn) {
                    saveBtn.classList.remove('saved');
                    saveBtn.querySelector('i').className = 'far fa-bookmark';
                }
                
                // Update manage section
                updateManageSectionWithLocalData();
            }
        );
    } else {
        // Add to saved
        savedAirdrops.push(airdropId);
        userStorage.setItem('savedAirdrops', JSON.stringify(savedAirdrops));
        
        // Update button
        if (saveBtn) {
            saveBtn.classList.add('saved');
            saveBtn.querySelector('i').className = 'fas fa-bookmark';
        }
        
        // Update manage section
        updateManageSectionWithLocalData();
    }
}

// Fix handleRemoveAirdrop function
function handleRemoveAirdrop(airdropId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Convert airdropId to number if it's a string
    airdropId = typeof airdropId === 'string' ? parseInt(airdropId) : airdropId;
    
    console.log('Remove button clicked for airdrop:', airdropId);
    
    // Show confirmation for removal
    showConfirmationModal(
        'Are you sure you want to remove this saved airdrop?',
        function() {
            // Remove from localStorage
            let savedAirdrops = JSON.parse(localStorage.getItem(getUserStorage().getKey('savedAirdrops')) || '[]')
                .map(id => typeof id === 'string' ? parseInt(id) : id);
                
            savedAirdrops = savedAirdrops.filter(id => id !== airdropId);
            localStorage.setItem(getUserStorage().getKey('savedAirdrops'), JSON.stringify(savedAirdrops));
            
            // Update any visible save buttons
            const saveBtn = document.querySelector(`.airdrop-card[data-id="${airdropId}"] .save-btn`);
            if (saveBtn) {
                saveBtn.classList.remove('saved');
                saveBtn.querySelector('i').className = 'far fa-bookmark';
            }
            
            // Remove the card with animation
            const card = document.querySelector(`.saved-airdrop-card[data-id="${airdropId}"]`);
            if (card) {
                card.classList.add('removing');
                setTimeout(() => {
                    card.remove();
                    checkEmptySavedSection();
                }, 300);
            }
            
            // Update saved count
            updateSavedCountDisplay();
        }
    );
}

// Helper function to check if saved section is empty
function checkEmptySavedSection() {
    const savedCards = document.querySelectorAll('.saved-airdrop-card');
    if (savedCards.length === 0) {
        document.querySelector('.saved-airdrops').style.display = 'none';
        document.querySelector('.no-saved-airdrops').style.display = 'flex';
    }
}

// Add a helper function to update the saved count display
function updateSavedCountDisplay() {
    const savedAirdropIds = JSON.parse(localStorage.getItem(getUserStorage().getKey('savedAirdrops')) || '[]');
    
    // Update the count in the stats card
    const savedCountElement = document.getElementById('savedCount');
    if (savedCountElement) {
        savedCountElement.textContent = savedAirdropIds.length;
    }
    
    // Update badge on manage tab
    const manageBadge = document.querySelector('.nav-item[data-section="manage"] .saved-count');
    if (manageBadge) {
        manageBadge.textContent = savedAirdropIds.length;
        manageBadge.style.display = savedAirdropIds.length > 0 ? 'flex' : 'none';
    }
}

// Add this to your tab switching code
function switchToAirdrops() {
    document.querySelector('.nav-item[data-section="airdrops"]').click();
}

// Replace the existing Telegram-specific code
function initializeTelegramUser() {
    // Check if running in Telegram Web App
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe.user) {
        // Get Telegram user ID
        const telegramId = window.Telegram.WebApp.initDataUnsafe.user.id;
        const telegramUsername = window.Telegram.WebApp.initDataUnsafe.user.username;
        
        // Set as userId
        localStorage.setItem('userId', 'telegram_' + telegramId);
        localStorage.setItem('username', telegramUsername || 'telegram_user');
        
        console.log('Telegram user initialized:', telegramId);
        return 'telegram_' + telegramId;
    }
    
    // Return existing or new ID for non-Telegram users
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'web_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('userId', userId);
    }
    
    return userId;
}

// Update this function to work cross-platform
async function handleSaveAirdrop(airdropId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    console.log('Save button clicked for airdrop:', airdropId);
    
    // Generate a user ID if not already exists
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('userId', userId);
    }

    const saveBtn = document.querySelector(`.airdrop-card[data-id="${airdropId}"] .save-btn`);
    if (!saveBtn) {
        console.error('Save button not found for airdrop:', airdropId);
        return;
    }
    
    // Get current saved airdrops
    let savedAirdrops = JSON.parse(localStorage.getItem(getUserStorage().getKey('savedAirdrops')) || '[]');
    
    // Check if already saved
    const isAlreadySaved = savedAirdrops.includes(airdropId);
    
    if (isAlreadySaved) {
        // Show confirmation dialog for unsaving
        const confirmModal = document.getElementById('confirmationModal');
        const confirmMessage = document.getElementById('confirmationMessage');
        const confirmButton = document.getElementById('confirmButton');
        const cancelButton = document.getElementById('cancelButton');
        
        confirmMessage.textContent = 'Are you sure you want to unsave this airdrop?';
        confirmModal.style.display = 'flex';
        
        // Handle confirmation
        const handleConfirm = () => {
            // UNSAVE - Remove from localStorage
            savedAirdrops = savedAirdrops.filter(id => id !== airdropId);
            localStorage.setItem(getUserStorage().getKey('savedAirdrops'), JSON.stringify(savedAirdrops));
            
            // Update button appearance
            saveBtn.classList.remove('saved');
            saveBtn.querySelector('i').className = 'far fa-bookmark';
            
            // If we're on server, remove from server too
            fetch(`${API_BASE_URL}/api/remove-airdrop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    airdropId,
                    userId
                })
            }).catch(error => {
                console.error('Error removing from server:', error);
            });
            
            // Update the manage section immediately
            updateManageSectionWithLocalData();
            
            // Hide modal
            confirmModal.style.display = 'none';
            
            // Remove event listeners
            confirmButton.removeEventListener('click', handleConfirm);
            cancelButton.removeEventListener('click', handleCancel);
        };
        
        // Handle cancel
        const handleCancel = () => {
            confirmModal.style.display = 'none';
            confirmButton.removeEventListener('click', handleConfirm);
            cancelButton.removeEventListener('click', handleCancel);
        };
        
        // Add event listeners
        confirmButton.addEventListener('click', handleConfirm);
        cancelButton.addEventListener('click', handleCancel);
    } else {
        // SAVE - Add to localStorage without confirmation
        savedAirdrops.push(airdropId);
        localStorage.setItem(getUserStorage().getKey('savedAirdrops'), JSON.stringify(savedAirdrops));
        
        // Update button appearance
        saveBtn.classList.add('saved');
        saveBtn.querySelector('i').className = 'fas fa-bookmark';
        
        // If we're on server, save to server too
        fetch(`${API_BASE_URL}/api/save-airdrop`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                airdropId,
                userId,
                username: localStorage.getItem('username') || 'web_user'
            })
        }).catch(error => {
            console.error('Error saving to server:', error);
        });
        
        // Update the manage section immediately
        updateManageSectionWithLocalData();
    }
    
    return false; // Prevent default action
}

// Function to update saved count badge
function updateSavedCount() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    fetch(`${API_BASE_URL}/api/saved-airdrops?userId=${userId}`)
        .then(response => response.json())
        .then(savedAirdrops => {
            const savedCountBadge = document.querySelector('.nav-item[data-section="manage"] .saved-count');
            if (savedCountBadge) {
                savedCountBadge.textContent = savedAirdrops.length;
                savedCountBadge.style.display = savedAirdrops.length > 0 ? 'flex' : 'none';
            }
        });
}

// Update the updateManageSectionWithLocalData function to correctly process saved airdrops
function updateManageSectionWithLocalData() {
    const userStorage = getUserStorage();
    
    const savedAirdropsContainer = document.querySelector('.saved-airdrops');
    const noSavedMessage = document.querySelector('.no-saved-airdrops');
    const savedCountElement = document.getElementById('savedCount');
    
    if (!savedAirdropsContainer || !noSavedMessage || !savedCountElement) {
        console.error('Required DOM elements not found for manage section');
        return;
    }

    // Use user-specific storage
    const savedAirdropIds = JSON.parse(userStorage.getItem('savedAirdrops') || '[]')
        .map(id => typeof id === 'string' ? parseInt(id) : id);
    
    // Find the matching airdrops from the data
    const savedAirdrops = airdropsData.filter(airdrop => 
        savedAirdropIds.includes(airdrop.id)
    );
    
    // Update the counter
    savedCountElement.textContent = savedAirdrops.length;
    
    // Update display
    if (savedAirdrops.length === 0) {
        savedAirdropsContainer.style.display = 'none';
        noSavedMessage.style.display = 'flex';
    } else {
        savedAirdropsContainer.style.display = 'flex';
        noSavedMessage.style.display = 'none';
        savedAirdropsContainer.innerHTML = savedAirdrops
            .map(airdrop => renderSavedAirdropCard(airdrop))
            .join('');
    }
    
    // Update badge on manage tab
    updateSavedCountDisplay();
    
    // Initialize search
    initializeSavedAirdropsSearch();
}

// Add this function to initialize search functionality for manage section
function initializeSavedAirdropsSearch() {
    const searchInput = document.getElementById('savedSearchInput');
    const clearButton = document.querySelector('#manage-section .clear-search');
    
    if (!searchInput || !clearButton) return;
    
    // Search input handler
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        clearButton.style.display = searchTerm ? 'flex' : 'none';
        
        // Get the saved airdrops
        const savedAirdropIds = JSON.parse(localStorage.getItem(getUserStorage().getKey('savedAirdrops')) || '[]')
            .map(id => typeof id === 'string' ? parseInt(id) : id);
        const savedAirdrops = airdropsData.filter(airdrop => 
            savedAirdropIds.includes(airdrop.id)
        );
        
        // Filter by search term
        const filteredAirdrops = savedAirdrops.filter(airdrop => 
            airdrop.title.toLowerCase().includes(searchTerm) || 
            airdrop.brief.toLowerCase().includes(searchTerm)
        );
        
        // Update the display
        const savedAirdropsContainer = document.querySelector('.saved-airdrops');
        const noSavedMessage = document.querySelector('.no-saved-airdrops');
        
        if (filteredAirdrops.length === 0) {
            savedAirdropsContainer.style.display = 'none';
            noSavedMessage.style.display = 'flex';
            noSavedMessage.querySelector('p').textContent = searchTerm ? 
                'No saved airdrops match your search' : 'No saved airdrops';
        } else {
            savedAirdropsContainer.style.display = 'flex';
            noSavedMessage.style.display = 'none';
            savedAirdropsContainer.innerHTML = filteredAirdrops
                .map(airdrop => renderSavedAirdropCard(airdrop))
                .join('');
        }
    });
    
    // Clear search button
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        clearButton.style.display = 'none';
        updateManageSectionWithLocalData();
        searchInput.focus();
    });
}

// Add this function to your script.js
function trackUserVisit() {
    let userId = localStorage.getItem('userId');
    const platform = window.Telegram && window.Telegram.WebApp ? 'telegram' : 'web';
    let username = localStorage.getItem('username');
    
    // Generate new ID if not exists
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('userId', userId);
    }
    
    // If in Telegram, get username
    if (platform === 'telegram' && window.Telegram.WebApp.initDataUnsafe.user) {
        username = window.Telegram.WebApp.initDataUnsafe.user.username || 
                  `telegram_user_${window.Telegram.WebApp.initDataUnsafe.user.id}`;
        localStorage.setItem('username', username);
    }
    
    // Track visit via API
    fetch(`${API_BASE_URL}/api/user-visit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId,
            platform,
            username
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('User visit tracked:', data);
    })
    .catch(error => {
        console.error('Error tracking user visit:', error);
    });
    
    return userId;
}

// Initialize saved buttons state
function initializeSavedButtons() {
    const userStorage = getUserStorage();
    const savedAirdropIds = JSON.parse(userStorage.getItem('savedAirdrops') || '[]');
    
    savedAirdropIds.forEach(id => {
        const saveBtn = document.querySelector(`.airdrop-card[data-id="${id}"] .save-btn`);
        if (saveBtn) {
            saveBtn.classList.add('saved');
            saveBtn.querySelector('i').className = 'fas fa-bookmark';
        }
    });
} 
