const airdropsData = [
    {
        id: 1,
        title: "MONAD TESTNET",
        brief: "A new ecosystem for the future",
        datePosted: "2025-03-22 11:30",
        expectedReward: "$100-$1000",
        expectedTGE: "Q2 2024",
        investmentRequired: false, // free airdrop
        investmentAmount: null,
        tasks: [
            "Follow & RT on Twitter",
            "Join Discord Community",
            "Complete Testnet Activities",
            "Create a detailed thread about your experience with the protocol",
            "Participate in community discussions for at least 2 weeks",
            "Complete all quests in the testnet dashboard",
            "aja tujhe chand par le cahlu",
            "Follow & RT on Twitter",
            "Join Discord Community",
            "Complete Testnet Activities",
            "Create a detailed thread about your experience with the protocol",
            "Participate in community discussions for at least 2 weeks",
            "Complete all quests in the testnet dashboard",
            "aja tujhe chand par le cahlu"
        ],
        joinLink: "https://youtube.com"
    },
    {
        id: 2,
        title: "Celestia",
        brief: "Modular blockchain network",
        datePosted: "2025-03-21 18:45",
        expectedReward: "$500-$2000",
        expectedTGE: "Q3 2024",
        investmentRequired: false, // paid airdrop
        investmentAmount: null,
        tasks: [
            "Bridge minimum 1 ETH",
            "Participate in testnet",
            "Create 3 unique transactions",
            "Maintain validator node for 2 weeks"
        ],
        joinLink: "https://youtube.com"
    }

].sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted)); // Sort by newest first

// Add this updates data structure
const updatesData = [
    {
        id: 1,
        projectName: "MONAD TESTNET",
        type: "important",
        timestamp: "2024-03-22 15:30",
        content: "🚨 Important: Testnet participation deadline extended to March 30th. Complete all tasks before the deadline to be eligible for rewards.",
        telegramLink: "https://t.me/your_group"
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
    
    return `
        <div class="airdrop-card" data-date="${airdrop.datePosted}">
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
                        <div class="investment-badge ${airdrop.investmentRequired ? 'paid' : 'free'}">
                            ${airdrop.investmentRequired ? 
                                `<i class="fas fa-coins"></i> Required: ${airdrop.investmentAmount}` : 
                                '<i class="fas fa-gift"></i> Free to Join'}
                        </div>
                        <p class="project-brief">${airdrop.brief}</p>
                        <span class="time-posted">${timeAgo(airdrop.datePosted)}</span>
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

                <a href="${airdrop.joinLink}" target="_blank" class="join-btn">
                    JOIN AIRDROP
                </a>
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
            // Remove active class from all nav items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = `${this.dataset.section}-section`;
            const targetSection = document.getElementById(sectionId);
            targetSection.classList.add('active');

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

// Example of how to add a new airdrop
function addNewAirdrop(airdropData) {
    const now = new Date();
    const datePosted = now.getFullYear() + '-' + 
                      String(now.getMonth() + 1).padStart(2, '0') + '-' +
                      String(now.getDate()).padStart(2, '0') + ' ' +
                      String(now.getHours()).padStart(2, '0') + ':' +
                      String(now.getMinutes()).padStart(2, '0');

    const newAirdrop = {
        id: airdropsData.length + 1,
        datePosted: datePosted,
        ...airdropData
    };

    // Add to beginning of array instead of pushing to end
    airdropsData.unshift(newAirdrop);
    renderAirdrops();
}

// Example usage:
// addNewAirdrop({
//     title: "New Airdrop",
//     brief: "Description here",
//     expectedReward: "$100-$500",
//     expectedTGE: "Q2 2024",
//     tasks: ["Task 1", "Task 2"],
//     joinLink: "https://youtube.com"
// });

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
                MORE DETAILS
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