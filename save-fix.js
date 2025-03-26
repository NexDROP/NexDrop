// Add this code to script.js to ensure save functionality works
// even if the server is down

// 1. Make sure the API_BASE_URL is correctly set to your PythonAnywhere URL
const API_BASE_URL = 'https://nexdrop.pythonanywhere.com'; // Update with your actual URL

// 2. Improve the initialization for Telegram users
document.addEventListener('DOMContentLoaded', function() {
    // Initialize user first (before anything else)
    initializeUserAndSavedAirdrops();
});

// 3. Create a centralized function to initialize user and sync with backend
async function initializeUserAndSavedAirdrops() {
    // Set up user ID (prioritize Telegram user ID)
    let userId = null;
    let platform = 'web';
    let username = null;
    
    // Check if user is in Telegram environment
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe.user) {
        const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
        userId = 'telegram_' + telegramUser.id;
        username = telegramUser.username || 'telegram_user';
        platform = 'telegram';
    } else {
        // Web user - use stored ID or generate new one
        userId = localStorage.getItem('userId');
        if (!userId) {
            userId = 'web_' + Math.random().toString(36).substring(2, 15);
        }
        username = localStorage.getItem('username') || 'web_user';
    }
    
    // Store user info
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('platform', platform);
    
    console.log(`Initialized user: ${username} (${userId}) on ${platform}`);
    
    // Sync with backend
    try {
        // 1. Track the visit
        const visitResponse = await fetch(`${API_BASE_URL}/api/user-visit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, username, platform })
        });
        
        // 2. Get saved airdrops from backend
        const savedResponse = await fetch(`${API_BASE_URL}/api/saved-airdrops?userId=${userId}`);
        
        if (savedResponse.ok) {
            const savedIds = await savedResponse.json();
            
            // Store in localStorage for local use
            const userStorage = getUserStorage();
            userStorage.setItem('savedAirdrops', JSON.stringify(savedIds));
            
            console.log(`Synced ${savedIds.length} saved airdrops from server`);
            
            // Update all save buttons
            updateAllSaveButtons();
            
            // Update manage section
            updateManageSectionWithLocalData();
        }
    } catch (error) {
        console.error('Error syncing with backend:', error);
        // Continue with local data only
        updateAllSaveButtons();
        updateManageSectionWithLocalData();
    }
}

// 4. Update save buttons based on storage
function updateAllSaveButtons() {
    const userStorage = getUserStorage();
    const savedAirdropIds = JSON.parse(userStorage.getItem('savedAirdrops') || '[]')
        .map(id => typeof id === 'string' ? parseInt(id) : id);
    
    // Update all save buttons
    document.querySelectorAll('.airdrop-card').forEach(card => {
        const cardId = parseInt(card.dataset.id);
        const saveBtn = card.querySelector('.save-btn');
        
        if (saveBtn) {
            if (savedAirdropIds.includes(cardId)) {
                saveBtn.classList.add('saved');
                saveBtn.querySelector('i').className = 'fas fa-bookmark';
            } else {
                saveBtn.classList.remove('saved');
                saveBtn.querySelector('i').className = 'far fa-bookmark';
            }
        }
    });
    
    // Update saved count display
    updateSavedCountDisplay();
}

// 5. Improve handleSaveAirdrop to properly sync with server
async function handleSaveAirdrop(airdropId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Convert to number if string
    airdropId = typeof airdropId === 'string' ? parseInt(airdropId) : airdropId;
    
    // Get user info
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username') || 'anonymous';
    
    if (!userId) {
        console.error('User ID not found. Please refresh the page.');
        return;
    }
    
    // Get user storage
    const userStorage = getUserStorage();
    let savedAirdrops = JSON.parse(userStorage.getItem('savedAirdrops') || '[]')
        .map(id => typeof id === 'string' ? parseInt(id) : id);
    
    const isAlreadySaved = savedAirdrops.includes(airdropId);
    const saveBtn = document.querySelector(`.airdrop-card[data-id="${airdropId}"] .save-btn`);
    
    if (isAlreadySaved) {
        // Show confirmation dialog for unsaving
        showConfirmationModal(
            'Are you sure you want to unsave this airdrop?', 
            async function() {
                try {
                    // Remove locally first for immediate feedback
                    savedAirdrops = savedAirdrops.filter(id => id !== airdropId);
                    userStorage.setItem('savedAirdrops', JSON.stringify(savedAirdrops));
                    
                    // Update button appearance
                    if (saveBtn) {
                        saveBtn.classList.remove('saved');
                        saveBtn.querySelector('i').className = 'far fa-bookmark';
                    }
                    
                    // Update manage section
                    updateManageSectionWithLocalData();
                    
                    // Sync with server
                    await fetch(`${API_BASE_URL}/api/remove-airdrop`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ airdropId, userId })
                    });
                    
                    console.log(`Airdrop ${airdropId} removed from server`);
                } catch (error) {
                    console.error('Error syncing removal with server:', error);
                }
            }
        );
    } else {
        try {
            // Add locally first for immediate feedback
            savedAirdrops.push(airdropId);
            userStorage.setItem('savedAirdrops', JSON.stringify(savedAirdrops));
            
            // Update button appearance
            if (saveBtn) {
                saveBtn.classList.add('saved');
                saveBtn.querySelector('i').className = 'fas fa-bookmark';
            }
            
            // Update manage section
            updateManageSectionWithLocalData();
            
            // Sync with server
            await fetch(`${API_BASE_URL}/api/save-airdrop`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ airdropId, userId, username })
            });
            
            console.log(`Airdrop ${airdropId} saved to server`);
        } catch (error) {
            console.error('Error syncing save with server:', error);
        }
    }
}

// 6. Improve renderAirdropCard to check saved status correctly
function renderAirdropCard(airdrop) {
    // Get saved status from user storage
    const userStorage = getUserStorage();
    const savedAirdrops = JSON.parse(userStorage.getItem('savedAirdrops') || '[]')
        .map(id => typeof id === 'string' ? parseInt(id) : id);
    
    const isAlreadySaved = savedAirdrops.includes(airdrop.id);
    
    // ... rest of existing function ...
    
    // Update the save button HTML to reflect correct saved state:
    return `
        <!-- ... existing HTML ... -->
        <div class="card-actions">
            <a href="${airdrop.joinLink}" target="_blank" class="join-btn">
                JOIN AIRDROP
            </a>
            <button class="save-btn icon-only" onclick="handleSaveAirdrop(${airdrop.id}, event)" aria-label="${isAlreadySaved ? 'Unsave airdrop' : 'Save airdrop'}">
                <i class="${isAlreadySaved ? 'fas' : 'far'} fa-bookmark"></i>
            </button>
        </div>
        <!-- ... existing HTML ... -->
    `;
}

// Function to update manage section with local data
function updateManageSectionWithLocalData() {
    const savedAirdropsContainer = document.querySelector('.saved-airdrops');
    const noSavedMessage = document.querySelector('.no-saved-airdrops');
    const savedCountElement = document.getElementById('savedCount');
    
    if (!savedAirdropsContainer || !noSavedMessage || !savedCountElement) {
        console.error('Required DOM elements not found for manage section');
        return;
    }

    // Get locally saved airdrop IDs
    const savedAirdropIds = JSON.parse(localStorage.getItem('savedAirdrops') || '[]');
    
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
        savedAirdropsContainer.style.display = 'grid';
        noSavedMessage.style.display = 'none';
        savedAirdropsContainer.innerHTML = savedAirdrops
            .map(airdrop => renderSavedAirdropCard(airdrop))
            .join('');
    }
    
    // Update badge on manage tab
    const manageBadge = document.querySelector('.nav-item[data-section="manage"] .saved-count');
    if (manageBadge) {
        manageBadge.textContent = savedAirdrops.length;
        manageBadge.style.display = savedAirdrops.length > 0 ? 'flex' : 'none';
    } else {
        // Create badge if it doesn't exist
        const manageTab = document.querySelector('.nav-item[data-section="manage"]');
        if (manageTab && savedAirdrops.length > 0) {
            const badge = document.createElement('span');
            badge.className = 'saved-count';
            badge.textContent = savedAirdrops.length;
            manageTab.appendChild(badge);
        }
    }
}

// Modify the existing updateManageSection function
function updateManageSection() {
    try {
        const userId = localStorage.getItem('userId');
        fetch(`/api/saved-airdrops?userId=${userId || ''}`)
            .then(response => {
                if (!response.ok) throw new Error('Server error');
                return response.json();
            })
            .then(savedAirdropIds => {
                // Filter airdrops based on IDs returned from server
                const savedAirdrops = airdropsData.filter(airdrop => 
                    savedAirdropIds.includes(airdrop.id)
                );
                
                // Store locally for offline access
                localStorage.setItem('savedAirdrops', JSON.stringify(savedAirdropIds));
                
                // Update the UI
                updateManageSectionWithLocalData();
            })
            .catch(error => {
                console.error('Error fetching from server, using local data:', error);
                updateManageSectionWithLocalData();
            });
    } catch (error) {
        console.error('Error in updateManageSection:', error);
        updateManageSectionWithLocalData();
    }
}

// Add badge to manage tab in navigation
document.addEventListener('DOMContentLoaded', function() {
    // Execute after a short delay to ensure the nav is loaded
    setTimeout(() => {
        const manageTab = document.querySelector('.nav-item[data-section="manage"]');
        if (manageTab) {
            const savedAirdropIds = JSON.parse(localStorage.getItem('savedAirdrops') || '[]');
            if (savedAirdropIds.length > 0) {
                // Add badge if there are saved airdrops
                const badge = document.createElement('span');
                badge.className = 'saved-count';
                badge.textContent = savedAirdropIds.length;
                manageTab.appendChild(badge);
            }
        }
        
        // Initialize the manage section
        updateManageSectionWithLocalData();
    }, 500);
}); 
