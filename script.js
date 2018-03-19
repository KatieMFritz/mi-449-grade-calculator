///////////////////////////////
/* Global Variables */
///////////////////////////////

// Get elements from the page
var currentGradeInput = document.getElementById('current-grade')
var targetDateInput = document.getElementById('date-target')
var updateForm = document.getElementById('update-form')
var clearDataButton = document.getElementById('clear-data')

var todayDateDisplay = document.getElementById('date-today')
var targetDateDisplay = document.getElementById('date-target-display')
var targetGradeDisplay = document.getElementById('target-grade')
var daysRemainingDisplay = document.getElementById('days-remaining')
var pointsNeededDisplay = document.getElementById('points-needed')
var pointsPerWeekDisplay = document.getElementById('points-per-week')
var pointsPerDayDisplay = document.getElementById('points-per-day')

var x09Projects = document.getElementById('.09-point')
var x19Projects = document.getElementById('.19-point')
var x28Projects = document.getElementById('.28-point')
var newGradeDisplay = document.getElementById('new-grade')
var pointsStillNeededDisplay = document.getElementById('points-still-needed')

// Set some dates
var startDate = moment("2018-01-09")
var endDate = moment("2018-05-01")
var today = moment()
var todayFormatted = moment().format('YYYY-MM-DD')

// rounding utility
var twoDecimals = function(unroundedValue) { return Math.round((unroundedValue)*100)/100 }
// Other global variables
var pointsNeeded
var targetDate
var currentGrade

////////////////////////////////////
/* Functions */
/////////////////////////////////////

var initalize = function() {
    // If stored target date exists, use it
    var storedTargetDate = window.localStorage.getItem('storedTargetDate')
    if (storedTargetDate !== null) {
      targetDate = storedTargetDate
      targetDateInput.value = moment(targetDate).format('YYYY-MM-DD')
    // Otherwise, use defaults
    } else {
      targetDateInput.value = todayFormatted
    }

    // If stored grade exists, use it
    var storedGrade = window.localStorage.getItem('storedGrade')
    if (storedGrade !== null) {
      currentGrade = storedGrade
      currentGradeInput.value = parseFloat(currentGrade)
    // Otherwise, use defaults
    } else {
      currentGradeInput.value = 0.0
    }

    // If stored projects data exists, use it
    var stored09 = window.localStorage.getItem('stored09')
    if (stored09 !== null) {
      x09Projects.value = stored09
    }
    var stored19 = window.localStorage.getItem('stored19')
    if (stored19 !== null) {
      x19Projects.value = stored19
    }
    var stored28 = window.localStorage.getItem('stored28')
    if (stored28 !== null) {
      x28Projects.value = stored28
    }

    // Run other display functions if there is stored data
    if ((storedGrade !== null) && (storedTargetDate !== null)) {
      getTargets()
      updateProjectMath()
    }
}

// Set the target grade and other plan info
var getTargets = function() {
  // Get and save the target date
  targetDate = moment(targetDateInput.value)
  window.localStorage.setItem('storedTargetDate', targetDate)

  // Get and save the current grade
  currentGrade = parseFloat(currentGradeInput.value)
  window.localStorage.setItem('storedGrade', currentGrade)

  // Calculate the number of days into the course for the target date
  var targetDayNumber = targetDate.diff(startDate, 'days')
  var todayNumber = today.diff(startDate, 'days')

  // Calculate and show the target grade
  var percentageThroughCourse = Math.abs(targetDayNumber / 112)
  var targetGrade = percentageThroughCourse * 4
  targetGradeDisplay.innerHTML = targetGrade.toFixed(2)

  // Calculate and show days remaining
  var daysRemaining = Math.abs(targetDayNumber - todayNumber)
  todayDateDisplay.innerHTML = todayFormatted
  targetDateDisplay.innerHTML = moment(targetDate).format('YYYY-MM-DD')
  daysRemainingDisplay.innerHTML = daysRemaining

  // Calculate and show points needed
  pointsNeeded = targetGrade - currentGrade
  pointsNeededDisplay.innerHTML = pointsNeeded.toFixed(2)

  // Calculate and show points needed per week
  var weeksRemaining = Math.floor(daysRemaining / 7)
  var pointsPerWeek = pointsNeeded / weeksRemaining
  pointsPerWeekDisplay.innerHTML = pointsPerWeek.toFixed(2)

  // Calculate and show points needed per day
  var pointsPerDay = pointsNeeded / daysRemaining
  pointsPerDayDisplay.innerHTML = pointsPerDay.toFixed(2)

  // and also update project math when this changes
  updateProjectMath()
}

var updateProjectMath = function() {
  var totalPoints = 0
  totalPoints = Math.round(
    ((x09Projects.value * .09) + (x19Projects.value * .19) + (x28Projects.value * .28))
    * 100)
    /100
  var newGrade = currentGrade + totalPoints
  if (newGrade > 4.0) {
    newGrade = 4.0
  }
  newGradeDisplay.innerHTML = newGrade.toFixed(2)
  pointsStillNeededDisplay.innerHTML = (pointsNeeded - totalPoints).toFixed(2)

  if (pointsNeeded > 0) {
    pointsStillNeededDisplay.className += ' text-danger'
  }

  window.localStorage.setItem('stored09', x09Projects.value)
  window.localStorage.setItem('stored19', x19Projects.value)
  window.localStorage.setItem('stored28', x28Projects.value)
}

// Clear data
var clearData = function() {
  var confirm = window.confirm('Are you sure you want to remove your saved data?')
  if (confirm) {
    localStorage.clear()
    location.reload()
  }
}

///////////////////////////
/* Event Listeners */
///////////////////////////

// Set initial values when the page loads
window.onload = initalize()

// Update when things change
updateForm.addEventListener('click', getTargets)
clearDataButton.addEventListener('click', clearData)
x09Projects.addEventListener('change', updateProjectMath)
x19Projects.addEventListener('change', updateProjectMath)
x28Projects.addEventListener('change', updateProjectMath)

