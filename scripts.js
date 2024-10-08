document.getElementById('add-skill').addEventListener('click', () => {
    const skillName = document.getElementById('skill-name').value;
    const skillLevel = document.getElementById('skill-level').value;

    fetch('add_skill.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skillName, skillLevel })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            addSkillToDOM(skillName, skillLevel);
            document.getElementById('skill-name').value = '';
            document.getElementById('skill-level').value = 0;
        } else {
            console.error('Error adding skill:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

function addSkillToDOM(skillName, skillLevel) {
    const skillsContainer = document.getElementById('skills-container');
    const skillItem = document.createElement('div');
    skillItem.className = 'skill-item';
    const color = getSkillColor(skillLevel);
    skillItem.innerHTML = `
        <h3 class="skill-title">${skillName}</h3>
        <div class="skill-bar">
            <div class="skill-level" style="width: ${skillLevel}%; background-color: ${color};"></div>
        </div>
    `;
    skillsContainer.appendChild(skillItem);
}

function getSkillColor(level) {
    if (level >= 80) {
        return 'green'; // High skill level
    } else if (level >= 50) {
        return 'orange'; // Medium skill level
    } else {
        return 'red'; // Low skill level
    }
}


