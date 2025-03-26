// Add this code to script.js to ensure save functionality works
// even if the server is down

function handleSaveAirdrop(airdropId) {
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
    
    // Always store locally first for immediate feedback
    const savedAirdrops = JSON.parse(localStorage.getItem('savedAirdrops') || '[]');
    if (!savedAirdrops.includes(airdropId)) {
        savedAirdrops.push(airdropId);
        localStorage.setItem('savedAirdrops', JSON.stringify(savedAirdrops));
    }
    
    // Update button state
    saveBtn.classList.add('saved');
    saveBtn.innerHTML = `<i class="fas fa-bookmark"></i><span>Saved</span>`;
    
    try {
        // Show saving state
        saveBtn.innerHTML = `<i class="fas fa-bookmark"></i><span>Saved</span>`;
        
        fetch('/api/save-airdrop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                airdropId,
                userId,
                username: localStorage.getItem('username') || 'web_user'
            })
        }).then(response => {
            if (response.ok) {
                console.log('Successfully saved airdrop to server:', airdropId);
                updateManageSectionWithLocalData();
            }
        }).catch(error => {
            console.error('Error saving airdrop to server:', error);
        });
    } catch (error) {
        console.error('Error in save process:', error);
    }
    
    // Update the manage section after saving
    updateManageSectionWithLocalData();
    return false; // Prevent default action
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