// Get elements from the page
var currentGradeInput = document.getElementById('current-grade')
var targetDateInput = document.getElementById('date-target')
var updateForm = document.getElementById('update-form')

var todayDateDisplay = document.getElementById('date-today')
var targetGradeDisplay = document.getElementById('target-grade')
var daysRemainingDisplay = document.getElementById('days-remaining')
var pointsNeededDisplay = document.getElementById('points-needed')
var pointsPerWeekDisplay = document.getElementById('points-per-week')
var pointsPerDayDisplay = document.getElementById('points-per-day')

var x09Projects = document.getElementById('.09-point')
var x19Projects = document.getElementById('.19-point')
var x28Projects = document.getElementById('.28-point')
var totalPointsDisplay = document.getElementById('total-points')
var pointsStillNeededDisplay = document.getElementById('points-still-needed')

var clearDataButton = document.getElementById('clear-data')

// Set some dates
var startDate = moment("2018-01-09")
var endDate = moment("2018-05-01")
var today = moment()
var todayFormatted = moment().format('YYYY-MM-DD')

// Other global variables
var pointsNeeded
var targetDate
var currentGrade

var loadSaved = function() {
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
      currentGradeInput.value = currentGrade
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

// Clear data
var clearData = function() {
  var confirm = window.confirm('Are you sure you want to remove your saved data?')
  if (confirm) {
    localStorage.clear()
    location.reload()
  }
}

// Set the target grade and other plan info
var getTargets = function() {
  // Get and save the target date
  targetDate = moment(targetDateInput.value)
  window.localStorage.setItem('storedTargetDate', targetDate)

  // Get and save the current grade
  currentGrade = currentGradeInput.value
  window.localStorage.setItem('storedGrade', currentGrade)

  // Calculate the number of days into the course for the target date
  var targetDayNumber = targetDate.diff(startDate, 'days')
  var todayNumber = today.diff(startDate, 'days')

  // Calculate and show the target grade
  var percentageThroughCourse = Math.abs(targetDayNumber / 112)
  var targetGrade = Math.round(percentageThroughCourse * 400) / 100
  targetGradeDisplay.innerHTML = targetGrade

  // Calculate and show days remaining
  var daysRemaining = Math.abs(targetDayNumber - todayNumber)
  todayDateDisplay.innerHTML = todayFormatted
  daysRemainingDisplay.innerHTML = daysRemaining

  // Calculate and show points needed
  pointsNeeded = Math.round ((targetGrade - currentGrade)*100) / 100
  pointsNeededDisplay.innerHTML = pointsNeeded

  // Calculate and show points needed per week
  var weeksRemaining = Math.floor(daysRemaining / 7)
  var pointsPerWeek = Math.round(pointsNeeded / weeksRemaining * 100) / 100
  pointsPerWeekDisplay.innerHTML = pointsPerWeek

  // Calculate and show points needed per day
  var pointsPerDay = Math.round(pointsNeeded / daysRemaining * 100) / 100
  pointsPerDayDisplay.innerHTML = pointsPerDay

  // and also update project math when this changes
  updateProjectMath()
}

var updateProjectMath = function() {
  var totalPoints = 0
  totalPoints = Math.round(
    ((x09Projects.value * .09) + (x19Projects.value * .19) + (x28Projects.value * .28))
    * 100)
    /100
  totalPointsDisplay.innerHTML = totalPoints
  pointsStillNeededDisplay.innerHTML = Math.round((pointsNeeded - totalPoints)*100)/100

  window.localStorage.setItem('stored09', x09Projects.value)
  window.localStorage.setItem('stored19', x19Projects.value)
  window.localStorage.setItem('stored28', x28Projects.value)
}

// Set dates when the page loads
window.onload = loadSaved()

// Update when things change
updateForm.addEventListener('click', getTargets)
x09Projects.addEventListener('change', updateProjectMath)
x19Projects.addEventListener('change', updateProjectMath)
x28Projects.addEventListener('change', updateProjectMath)
clearDataButton.addEventListener('click', clearData)
