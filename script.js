document.addEventListener("DOMContentLoaded", function() {
    fetch("https://api.github.com/users/sameer-at-git/repos")
        .then(response => response.json())
        .then(data => {
            const repoList = document.getElementById("repo-list");
            data.forEach(repo => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
                repoList.appendChild(listItem);
            });
        })
        .catch(error => console.error("Error fetching repositories:", error));
});

document.getElementById("theme-toggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

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

fetchRepositories();
