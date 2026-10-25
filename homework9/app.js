// Everything in here is inside $(document).ready(). That just means my code
// waits until the whole page is loaded before it tries to grab anything, so
// nothing breaks if an element isn't there yet.
$(document).ready(function () {

    // Quick check from a few assignments ago that this file is connected.
    console.log('Hello World!');


    // ===== Variables =====
    // name is my name, which I use in the greeting.
    // hasDownloadedResume makes sure the resume alert only shows once.
    // downloadCount keeps track of how many times the resume was downloaded.
    const name = 'Christian Braun';
    let hasDownloadedResume = false;
    let downloadCount = 0;


    // ===== Greeting (from an earlier assignment) =====
    function showGreeting(personName) {
        return 'Hello, my name is ' + personName + '! Welcome to my portfolio!';
    }

    $('#dynamic-greeting').text(showGreeting(name));


    // ===== Days until a deadline (from an earlier assignment) =====
    // This takes a Date and figures out how many days away it is. I make a
    // copy of the date first so I don't accidentally change the original.
    function daysUntilDeadline(deadlineDate) {
        const deadline = new Date(deadlineDate);
        const today = new Date();

        // Zeroing out the hours, minutes, and seconds so I'm only comparing
        // the actual day and not what time it is right now.
        deadline.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        // JavaScript gives the difference in milliseconds, so I divide by
        // how many milliseconds are in one day.
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        return Math.round((deadline - today) / millisecondsPerDay);
    }


    // ===== Step 2: Navigation menu built from an array =====
    // Each menu item has the words that show up on the button (label) and
    // the id of the section it should scroll to (target).
    const navItems = [
        { label: 'Summary', target: '#about' },
        { label: 'Education', target: '#education' },
        { label: 'Skills', target: '#skills' },
        { label: 'Projects', target: '#projects' },
        { label: 'Contact Information', target: '#contact' }
    ];

    // This loop goes through the array and builds one link for each item,
    // using the same Bootstrap classes I had when I typed them out by hand.
    for (let i = 0; i < navItems.length; i++) {
        const $link = $('<a></a>')
            .addClass('nav-link text-center flex-grow-1 d-flex align-items-center justify-content-center')
            .attr('href', navItems[i].target)
            .text(navItems[i].label);

        const $listItem = $('<li></li>')
            .addClass('nav-item flex-fill d-flex')
            .append($link);

        $('#nav-list').append($listItem);
    }

    // This scrolls the page down to a section smoothly using animate().
    function scrollToSection(target) {
        let scrollPosition;

        if (target === '#contact') {
            // My footer is fixed to the bottom of the screen, so there's
            // nothing to scroll to. I scroll to the bottom of the page
            // instead and make the footer blink so it's obvious.
            scrollPosition = $(document).height() - $(window).height();
            $('#contact').fadeTo(200, 0.4).fadeTo(200, 1);
        } else {
            // I subtract the height of my fixed header so the section title
            // doesn't end up hidden behind it.
            scrollPosition = $(target).offset().top - $('.site-header').outerHeight() - 15;
        }

        $('html, body').animate({ scrollTop: scrollPosition }, 700);
    }

    // When a nav link is clicked, I stop the normal instant jump (that's
    // what preventDefault does) and do my smooth scroll instead. I'm
    // listening on the whole list since the links get added by jQuery.
    $('#nav-list').on('click', 'a', function (event) {
        event.preventDefault();
        scrollToSection($(this).attr('href'));
    });


    // ===== Step 1: Skills array, form, and validation =====
    // This array holds all of my skills. Whenever I add, rename, or delete
    // one, I update this array too, so it always matches what's on the page.
    let skills = [
        'C',
        'C++',
        'HTML',
        'Troubleshooting',
        'Networking',
        'Problem-solving',
        'Understanding computer systems',
        'Creating webpages',
        'Cybersecurity concepts'
    ];

    function showSkillMessage(message) {
        $('#skill-message').text(message);
    }

    // This checks if a skill is okay to use. It takes two callbacks, which
    // are just functions I hand to this function so it can run one of them
    // later. onValid runs if the skill is fine and onInvalid runs (with an
    // error message) if it's not. currentName is the skill being renamed, so
    // a skill doesn't get flagged as a duplicate of itself.
    function validateSkill(skillName, currentName, onValid, onInvalid) {
        if (skillName === '') {
            onInvalid('Please type a skill first.');
            return;
        }

        // some() goes through the array and checks every skill using the
        // function I gave it. I lowercase both so "html" and "HTML" count
        // as the same skill.
        const alreadyExists = skills.some(function (existingSkill) {
            return existingSkill.toLowerCase() === skillName.toLowerCase() && existingSkill !== currentName;
        });

        if (alreadyExists) {
            onInvalid('"' + skillName + '" is already in my skills list.');
            return;
        }

        onValid(skillName);
    }

    // This builds one skill card (the name plus a delete button) with jQuery.
    // I use text() so whatever gets typed in shows up as plain text and can't
    // mess with my page.
    function createSkillCard(skillName) {
        const $column = $('<div></div>')
            .addClass('col-6 col-sm-4 col-md-3 skill-item')
            .attr('data-skill', skillName);

        const $card = $('<div></div>').addClass('card h-100 text-center skill-card');
        const $body = $('<div></div>').addClass('card-body py-2');

        const $skillText = $('<p></p>')
            .addClass('card-text mb-2 skill-name')
            .attr('title', 'Click to rename')
            .css('cursor', 'pointer')
            .text(skillName);

        const $deleteButton = $('<button></button>')
            .attr({ type: 'button', 'aria-label': 'Delete ' + skillName })
            .addClass('btn btn-sm btn-outline-danger delete-skill-btn')
            .text('Delete');

        $body.append($skillText, $deleteButton);
        $card.append($body);
        $column.append($card);
        return $column;
    }

    // When the page loads, I draw a card for every skill in the array.
    // forEach runs my function once for each skill.
    skills.forEach(function (skill) {
        $('#skills-list').append(createSkillCard(skill));
    });

    // Add Skill: reads the box, checks it, adds it to the array, and fades
    // the new card in.
    function addSkill() {
        const skillName = $('#skill-input').val().trim();

        validateSkill(skillName, null, function (validName) {
            skills.push(validName);
            showSkillMessage('');

            // I hide the card first and then fadeIn() it so it appears
            // smoothly instead of just popping in.
            const $newCard = createSkillCard(validName).hide();
            $('#skills-list').append($newCard);
            $newCard.fadeIn(400);

            $('#skill-input').val('').focus();
        }, function (message) {
            showSkillMessage(message);
        });
    }

    // Edit Skill: clicking a skill name swaps it for a little text box. Enter
    // saves the change, Escape cancels it, and clicking away saves it too.
    function startEditing($skillText) {
        const $item = $skillText.closest('.skill-item');
        const oldName = $item.attr('data-skill');

        const $editInput = $('<input type="text">')
            .addClass('form-control form-control-sm text-center mb-2')
            .attr('maxlength', 30)
            .val(oldName);

        // This flag makes sure the edit only gets finished one time, since
        // pressing Enter also makes the box lose focus right after.
        let finished = false;

        function finishEditing(shouldSave) {
            if (finished) {
                return;
            }
            finished = true;

            const newName = $editInput.val().trim();
            $editInput.remove();
            $skillText.show();

            if (!shouldSave || newName === oldName) {
                return;
            }

            validateSkill(newName, oldName, function (validName) {
                // map() builds a new array where the old name is swapped for
                // the new one and everything else stays the same.
                skills = skills.map(function (skill) {
                    return skill === oldName ? validName : skill;
                });

                $item.attr('data-skill', validName);
                $item.find('.delete-skill-btn').attr('aria-label', 'Delete ' + validName);
                $skillText.text(validName).hide().fadeIn(300);
                showSkillMessage('');
            }, function (message) {
                showSkillMessage(message);
            });
        }

        $editInput.on('keydown', function (event) {
            if (event.key === 'Enter') {
                finishEditing(true);
            } else if (event.key === 'Escape') {
                finishEditing(false);
            }
        });

        $editInput.on('blur', function () {
            finishEditing(true);
        });

        $skillText.hide().after($editInput);
        $editInput.focus().select();
    }

    $('#skills-list').on('click', '.skill-name', function () {
        startEditing($(this));
    });

    // Remove Skill: filter() builds a new array with every skill except the
    // one I'm deleting. Then slideUp() hides the card smoothly and remove()
    // takes it off the page once the animation is done.
    $('#skills-list').on('click', '.delete-skill-btn', function () {
        const $item = $(this).closest('.skill-item');
        const skillName = $item.attr('data-skill');

        skills = skills.filter(function (skill) {
            return skill !== skillName;
        });

        $item.slideUp(300, function () {
            $(this).remove();
        });

        showSkillMessage('');
    });


    // ===== Step 4: Keyboard events =====
    // Escape clears every input box in the form. I use this in the keydown
    // handler below.
    function clearSkillForm() {
        $('#skill-form input').val('');
        showSkillMessage('');
    }

    // keydown runs as soon as a key is pressed while I'm typing in the skill
    // box. Enter adds the skill and Escape clears the box. I call
    // preventDefault on Enter so the form doesn't also submit by itself and
    // add the skill twice.
    $('#skill-input').on('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addSkill();
        } else if (event.key === 'Escape') {
            clearSkillForm();
        }
    });

    // This is for clicking the Add Skill button with the mouse.
    $('#skill-form').on('submit', function (event) {
        event.preventDefault();
        addSkill();
    });


    // ===== Step 3: Projects array, cards, and sorting =====
    // Each project is an object with a title, description, deadline, and an
    // image. Some of these deadlines are just made up dates.
    const projects = [
        {
            title: 'Personal Portfolio Website',
            description: 'I built this portfolio site using HTML, CSS, Bootstrap, and JavaScript.',
            deadline: new Date('10/05/2026'),
            imageURL: 'portfolio_screenshot.png'
        },
        {
            title: 'C / C++ Programming Exercises',
            description: 'Practice programs in C and C++ to work on my problem-solving skills.',
            deadline: new Date('09/30/2026'),
            imageURL: 'cpp_source_code.png'
        },
        {
            title: 'Full Portfolio Redesign',
            description: 'A sample project where I rebuild this whole site from scratch with a new design system.',
            deadline: new Date('12/15/2026'),
            imageURL: 'skills_section.png'
        }
    ];

    // This draws every project card. It clears out the old cards first, so I
    // can call it again any time the order changes.
    function renderProjects() {
        const $list = $('#project-listings');
        $list.stop(true, true).empty();

        // A for loop goes through the array, and projects[i] is the project
        // I'm on right now.
        for (let i = 0; i < projects.length; i++) {

            // Ongoing or Completed, based on how many days are left.
            // Bigger than 0 means the deadline is still coming, smaller
            // than 0 means it already passed, and exactly 0 means today.
            const daysLeft = daysUntilDeadline(projects[i].deadline);
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

            // Turning the deadline into a nicer date like "December 15, 2026".
            const deadlineText = projects[i].deadline.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // I set the same height on every image so the cards line up even
            // though my screenshots are all different sizes.
            const $image = $('<img>')
                .addClass('card-img-top')
                .attr({ src: projects[i].imageURL, alt: 'Image for ' + projects[i].title })
                .css({ height: '180px', 'object-fit': 'cover' });

            const $title = $('<h5></h5>').addClass('card-title fs-6').text(projects[i].title);
            const $description = $('<p></p>').addClass('card-text small text-muted mb-2').text(projects[i].description);
            const $deadline = $('<p></p>').addClass('card-text small mb-2').text('Deadline: ' + deadlineText);
            const $statusBadge = $('<span></span>').addClass('badge ' + statusClass).text(status);

            const $body = $('<div></div>')
                .addClass('card-body')
                .append($title, $description, $deadline, $statusBadge);

            const $card = $('<div></div>')
                .addClass('card h-100 shadow-sm project-card')
                .append($image, $body);

            const $column = $('<div></div>')
                .addClass('col-12 col-md-6 col-lg-4')
                .append($card);

            $list.append($column);
        }

        // Fading the whole list in makes it obvious when the order changes.
        $list.hide().fadeIn(300);
    }

    // This sorts the projects array by deadline using sort() with a
    // comparator function. The comparator gets two projects at a time and
    // returns a number. If it's negative, the first project goes first, and
    // if it's positive, the second one does. Subtracting two dates gives a
    // number, so a.deadline - b.deadline sorts earliest to latest.
    function sortProjects(order) {
        projects.sort(function (a, b) {
            if (order === 'earliest') {
                return a.deadline - b.deadline;
            }
            return b.deadline - a.deadline;
        });

        // Highlight whichever sort button is the one currently being used.
        $('#sort-earliest').toggleClass('active', order === 'earliest');
        $('#sort-latest').toggleClass('active', order === 'latest');

        renderProjects();
    }

    $('#sort-earliest').on('click', function () {
        sortProjects('earliest');
    });

    $('#sort-latest').on('click', function () {
        sortProjects('latest');
    });

    // Draw the projects once when the page first loads.
    renderProjects();


    // ===== Resume download tracker (from an earlier assignment) =====
    // This adds 1 to downloadCount and updates the number on the page.
    function incrementDownloadCount() {
        downloadCount = downloadCount + 1;
        $('#download-count').text(downloadCount);
    }

    // Every click on the resume button bumps the count. The alert only shows
    // the first time because of the hasDownloadedResume check.
    $('#resume-download-btn').on('click', function () {
        incrementDownloadCount();

        if (!hasDownloadedResume) {
            alert('Your resume is downloaded successfully!');
            hasDownloadedResume = true;
        }
    });


    // ===== Education and experience tables (from an earlier assignment) =====
    // This builds a whole table from a list of headers and a list of rows,
    // and I use it for both tables so I don't repeat the same code.
    function buildTable(headers, rows) {
        const $table = $('<table></table>')
            .addClass('table table-striped table-hover table-bordered align-middle');

        const $headerRow = $('<tr></tr>');
        headers.forEach(function (header) {
            $headerRow.append($('<th></th>').text(header));
        });
        $table.append($('<thead></thead>').addClass('table-dark').append($headerRow));

        const $tableBody = $('<tbody></tbody>');
        rows.forEach(function (row) {
            const $tableRow = $('<tr></tr>');
            row.forEach(function (cell) {
                $tableRow.append($('<td></td>').text(cell));
            });
            $tableBody.append($tableRow);
        });
        $table.append($tableBody);

        return $table;
    }

    const educationHeaders = ['Degree', 'School', 'Dates'];
    const educationRows = [
        ['B.S. in Cybersecurity (in progress)', 'Northern Arizona University, Flagstaff, AZ', '2026 to Present'],
        ['High School Diploma', 'Steinmetz College Prep, Chicago, IL', '2015 to 2019']
    ];

    const experienceHeaders = ['Job Title', 'Company', 'Dates'];
    const experienceRows = [
        ['Support Representative', 'Customer Service / Technical Support', 'June 2024 to February 2025']
    ];

    $('#education-table-container').append(buildTable(educationHeaders, educationRows));
    $('#experience-table-container').append(buildTable(experienceHeaders, experienceRows));

});
