// Step 1: Just a quick check that this file is actually connected to my
// HTML. If I open the browser console and see this message, I know the
// script tag is wired up right.
console.log('Hello World!');


// Step 3: Variables for my user data.
// name is a string holding my name, I'm using it down in Step 4.
// hasDownloadedResume is a boolean that starts out false, and I flip it to
// true the first time someone clicks the resume button, so the alert only
// ever shows once instead of popping up every single click.
const name = 'Christian Braun';
let hasDownloadedResume = false;


// Step 4: Personalized greeting.
// This function just takes a name and gives back a greeting string with
// that name plugged into it. I kept it as its own separate function since
// the assignment wanted it that way, and it's basically just doing the
// string part, not actually touching the page yet.
function showGreeting(personName) {
    return 'Hello, my name is ' + personName + '! Welcome to my portfolio!';
}

// As soon as this script runs, I grab my greeting paragraph and fill it in
// with the message from showGreeting(). Since my script tag sits at the
// very bottom of the page, the paragraph already exists by the time this
// line runs.
const greetingElement = document.getElementById('dynamic-greeting');
greetingElement.textContent = showGreeting(name);


// Step 5: Figuring out how many days are left until my project deadline.
// This function takes a date and turns it into an actual Date object, then
// subtracts today's date from it. JavaScript gives you that difference in
// milliseconds for some reason, so I divide by the number of milliseconds
// in a day to turn it into an actual number of days.
function daysUntilDeadline(deadlineDateString) {
    const deadlineDate = new Date(deadlineDateString);
    const today = new Date();

    // I zero out the hours, minutes, seconds, and milliseconds on both
    // dates here. If I don't do this, the number can end up off by a day
    // depending on what time it happens to be right now.
    deadlineDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const differenceInDays = Math.round((deadlineDate - today) / millisecondsPerDay);

    return differenceInDays;
}

// My ongoing project's deadline, this matches what I put in the HTML for
// the Portfolio Redesign project.
const projectDeadline = '2026-12-15';
const daysLeft = daysUntilDeadline(projectDeadline);

// Logging it to the console so I can double check the math, and also
// dropping the number right into the page next to the project's deadline.
console.log(daysLeft + ' days left until the portfolio redesign deadline');

const daysRemainingElement = document.getElementById('days-remaining');
daysRemainingElement.textContent = daysLeft;


// Step 2: Alert when the resume gets downloaded.
// I grab the resume link by its id and listen for a click on it. If
// hasDownloadedResume is still false, I show the alert and flip the
// variable to true, so clicking it again later won't show the alert a
// second time.
const resumeButton = document.getElementById('resume-download-btn');

resumeButton.addEventListener('click', function () {
    if (!hasDownloadedResume) {
        alert('Your resume is downloaded successfully!');
        hasDownloadedResume = true;
    }
});
