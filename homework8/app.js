// Just a quick check from last assignment that this file is connected to my
// HTML. If I see this in the browser console, I know the script tag works.
console.log('Hello World!');


// ===== Variables =====
// name is my name, and I use it in the greeting down below.
// hasDownloadedResume is true or false, and it makes sure the resume alert
// only shows up the very first time the button gets clicked.
// downloadCount keeps track of how many times the resume was downloaded.
const name = 'Christian Braun';
let hasDownloadedResume = false;
let downloadCount = 0;


// ===== Greeting (from last assignment) =====
// This function takes a name and gives back a greeting with that name in it.
function showGreeting(personName) {
    return 'Hello, my name is ' + personName + '! Welcome to my portfolio!';
}

// Grabs the empty paragraph in my About section and fills it with the greeting.
const greetingElement = document.getElementById('dynamic-greeting');
greetingElement.textContent = showGreeting(name);


// ===== Days until a deadline (from last assignment) =====
// This function takes a date and figures out how many days away it is.
// I use it for my projects below to tell if they're still ongoing.
function daysUntilDeadline(deadlineDateString) {
    // I add T00:00:00 to the end of the date on purpose. Without it,
    // JavaScript reads the date in a different time zone and the number of
    // days can end up off by one.
    const deadlineDate = new Date(deadlineDateString + 'T00:00:00');
    const today = new Date();

    // Zeroing out the hours, minutes, and seconds so I'm only comparing the
    // actual day and not what time it is right now.
    deadlineDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // JavaScript gives the difference in milliseconds, so I divide by how
    // many milliseconds are in one day to get the number of days.
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    return Math.round((deadlineDate - today) / millisecondsPerDay);
}


// ===== Step 1: Adding skills from the form =====
// I grab the form, the text box, the message line, and the empty row where
// the new skill cards will go.
const skillForm = document.getElementById('skill-form');
const skillInput = document.getElementById('skill-input');
const skillMessage = document.getElementById('skill-message');
const addedSkillsRow = document.getElementById('added-skills');

// This function reads what was typed in and adds it to the page as a card.
function addSkill() {
    // trim() cuts off any extra spaces at the start and end.
    const skill = skillInput.value.trim();

    // If the box is empty, I show a message and stop so no empty card gets added.
    if (skill === '') {
        skillMessage.textContent = 'Please type a skill first.';
        return;
    }

    skillMessage.textContent = '';

    // Building the same kind of skill card I have in my HTML, just with
    // JavaScript. I use textContent so whatever gets typed in shows up as
    // plain text and can't mess with my page.
    const column = document.createElement('div');
    column.className = 'col-6 col-sm-4 col-md-3';

    const card = document.createElement('div');
    card.className = 'card h-100 text-center skill-card';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body py-2';

    const cardText = document.createElement('p');
    cardText.className = 'card-text mb-0';
    cardText.textContent = skill;

    cardBody.appendChild(cardText);
    card.appendChild(cardBody);
    column.appendChild(card);
    addedSkillsRow.appendChild(column);

    // Clear the text box so it's ready for the next skill.
    skillInput.value = '';
}

// When the form is submitted, I stop the page from refreshing (that's what
// preventDefault does) and then call addSkill().
skillForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addSkill();
});


// ===== Step 2: Project listings with a for loop =====
// Three separate arrays, one for the titles, one for the descriptions, and
// one for the deadlines. The first project in each array lines up with the
// others by position (index 0 goes together, index 1 goes together, etc).
// Some of these deadlines are just made up dates.
const projectTitles = [
    'Personal Portfolio Website',
    'C / C++ Programming Exercises',
    'Full Portfolio Redesign'
];

const projectDescriptions = [
    'I built this portfolio site using HTML, CSS, Bootstrap, and JavaScript.',
    'Practice programs in C and C++ to work on my problem-solving skills.',
    'A sample project where I rebuild this whole site from scratch with a new design system.'
];

const projectDeadlines = [
    '2026-10-05',
    '2026-09-30',
    '2026-12-15'
];

const projectListings = document.getElementById('project-listings');

// This loop goes through the arrays one project at a time and builds a card
// for each one.
for (let i = 0; i < projectTitles.length; i++) {

    // ===== Step 3: Ongoing or Completed =====
    // daysLeft is how many days until the deadline. If it's more than 0 the
    // deadline is still coming up, if it's less than 0 it already passed,
    // and if it's exactly 0 the deadline is today.
    const daysLeft = daysUntilDeadline(projectDeadlines[i]);
    let status;
    let statusClass;

    if (daysLeft > 0) {
        status = 'Ongoing (' + daysLeft + ' days left)';
        statusClass = 'bg-warning text-dark';
    } else if (daysLeft === 0) {
        status = 'Ongoing (due today)';
        statusClass = 'bg-warning text-dark';
    } else {
        status = 'Completed';
        statusClass = 'bg-success';
    }

    // Turning the deadline into a nicer looking date like "December 15, 2026".
    const deadlineText = new Date(projectDeadlines[i] + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Building the card with Bootstrap classes, same idea as the skill cards.
    const column = document.createElement('div');
    column.className = 'col-12 col-md-6 col-lg-4';

    const card = document.createElement('div');
    card.className = 'card h-100 shadow-sm project-card';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const title = document.createElement('h5');
    title.className = 'card-title fs-6';
    title.textContent = projectTitles[i];

    const description = document.createElement('p');
    description.className = 'card-text small text-muted mb-2';
    description.textContent = projectDescriptions[i];

    const deadline = document.createElement('p');
    deadline.className = 'card-text small mb-2';
    deadline.textContent = 'Deadline: ' + deadlineText;

    // The status shows up as a little colored badge.
    const statusBadge = document.createElement('span');
    statusBadge.className = 'badge ' + statusClass;
    statusBadge.textContent = status;

    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(deadline);
    cardBody.appendChild(statusBadge);
    card.appendChild(cardBody);
    column.appendChild(card);
    projectListings.appendChild(column);
}


// ===== Step 4: Resume download tracker =====
// This function adds 1 to downloadCount and then updates the number on the page.
const downloadCountElement = document.getElementById('download-count');

function incrementDownloadCount() {
    downloadCount = downloadCount + 1;
    downloadCountElement.textContent = downloadCount;
}

// Every click on the resume button bumps the count. The alert from last
// assignment is still here too, but it only shows the first time because of
// the hasDownloadedResume check.
const resumeButton = document.getElementById('resume-download-btn');

resumeButton.addEventListener('click', function () {
    incrementDownloadCount();

    if (!hasDownloadedResume) {
        alert('Your resume is downloaded successfully!');
        hasDownloadedResume = true;
    }
});


// ===== Step 5: Building the education and experience tables =====
// This function builds a whole table out of a list of headers and a list of
// rows. I wrote it once and use it for both tables so I don't have to repeat
// all the same code twice.
function buildTable(headers, rows) {
    const table = document.createElement('table');
    // Same Bootstrap classes I had on my old table.
    table.className = 'table table-striped table-hover table-bordered align-middle';

    // The top part of the table with the column names.
    const thead = document.createElement('thead');
    thead.className = 'table-dark';
    const headerRow = document.createElement('tr');

    for (let i = 0; i < headers.length; i++) {
        const th = document.createElement('th');
        th.textContent = headers[i];
        headerRow.appendChild(th);
    }

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // The body of the table. The outer loop makes one row for each entry,
    // and the inner loop makes one cell for each piece of info in that row.
    const tbody = document.createElement('tbody');

    for (let i = 0; i < rows.length; i++) {
        const tr = document.createElement('tr');

        for (let j = 0; j < rows[i].length; j++) {
            const td = document.createElement('td');
            td.textContent = rows[i][j];
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    return table;
}

// The info for my education table. Each row is one school.
const educationHeaders = ['Degree', 'School', 'Dates'];
const educationRows = [
    ['B.S. in Cybersecurity (in progress)', 'Northern Arizona University, Flagstaff, AZ', '2026 to Present'],
    ['High School Diploma', 'Steinmetz College Prep, Chicago, IL', '2015 to 2019']
];

// The info for my experience table. Each row is one job.
const experienceHeaders = ['Job Title', 'Company', 'Dates'];
const experienceRows = [
    ['Support Representative', 'Customer Service / Technical Support', 'June 2024 to February 2025']
];

// Building both tables and putting them into the empty divs in my HTML.
document.getElementById('education-table-container').appendChild(buildTable(educationHeaders, educationRows));
document.getElementById('experience-table-container').appendChild(buildTable(experienceHeaders, experienceRows));
