document.addEventListener("DOMContentLoaded", function() {
    // Fetch repositories
    fetchRepositories();
    // Load learning entries
    loadEntries();
    
    // Add modal close handlers
    setupModalHandlers();
});

function setupModalHandlers() {
    const closeButton = document.querySelector('.close-modal');
    const modal = document.getElementById('journal-modal');

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Close when clicking outside the modal
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Dark mode styling
document.body.classList.add("dark-mode");

// Fetch GitHub repositories dynamically
async function fetchRepositories() {
    const username = "sameer-at-git";
    const repoList = document.getElementById("repo-list");
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await response.json();
        
        repos.forEach(repo => {
            let listItem = document.createElement("li");
            listItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
            repoList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching repositories: ", error);
    }
}

async function loadEntries() {
    try {
        const response = await fetch('entries.md');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        
        // Split the markdown into individual entries
        const entries = text.split('\n# ').filter(entry => entry.trim());
        
        const entriesHTML = entries.map((entry, index) => {
            const [title, ...content] = (entry.startsWith('#') ? entry.substring(1) : entry).split('\n');
            const [date, topic] = title.split(' - ');
            
            // Get first paragraph for preview
            const previewContent = content.join('\n').split('\n\n')[0];
            
            return `
                <div class="learning-entry" data-entry-id="${index}">
                    <div class="entry-header">
                        <h3>📅 Date: <span>${date}</span></h3>
                        <h4>🔖 Topic: <span>${topic}</span></h4>
                    </div>
                    <div class="entry-content">
                        ${marked.parse(previewContent)}
                        <span class="read-more">Read More...</span>
                    </div>
                </div>
            `;
        }).join('');
        
        const container = document.getElementById('entries-container');
        if (container) {
            container.innerHTML = entriesHTML;
            
            // Add click handlers to entries
            document.querySelectorAll('.learning-entry').forEach((entry, index) => {
                entry.addEventListener('click', () => {
                    const [title, ...content] = entries[index].split('\n');
                    const [date, topic] = title.split(' - ');
                    
                    const modalContent = `
                        <h2>${topic}</h2>
                        <h3>${date}</h3>
                        <div class="full-content">
                            ${marked.parse(content.join('\n'))}
                        </div>
                    `;
                    
                    document.getElementById('modal-content-container').innerHTML = modalContent;
                    document.getElementById('journal-modal').style.display = 'block';
                });
            });
        }
    } catch (error) {
        console.error('Error loading entries:', error);
        document.getElementById('entries-container').innerHTML = 
            '<p style="color: red;">Error loading entries. Please make sure entries.md exists.</p>';
    }
}

// Add marked.js library to your HTML file
// <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
