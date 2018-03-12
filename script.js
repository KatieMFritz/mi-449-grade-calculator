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


// Set some dates
var startDate = new Date(2018,00,09)
var endDate = new Date(2018,04,01)
var today = new Date()
var todayFormatted = moment(today).format('YYYY-MM-DD')

var pointsNeeded

// Set the target grade and other plan info
var getTargets = function() {
  // Calculate the number of days into the course
  var targetDate = new Date(targetDateInput.value)
  var oneDay = 24*60*60*1000 // hours*minutes*seconds*milliseconds
  var targetDayNumber = Math.round(Math.abs((startDate.getTime() - targetDate.getTime())/(oneDay)))
  var todayNumber = Math.round(Math.abs((startDate.getTime() - today.getTime())/(oneDay)))
  todayDateDisplay.innerHTML = todayFormatted

    // Calculate and show the target grade
  var percentageThroughCourse = Math.abs(targetDayNumber / 112)
  var targetGrade = Math.round(percentageThroughCourse * 400) / 100
  targetGradeDisplay.innerHTML = targetGrade

  // Calculate and show days remaining
  var daysRemaining = Math.abs(targetDayNumber - todayNumber)
  daysRemainingDisplay.innerHTML = daysRemaining

  // Calculate and show points needed
  var currentGrade = currentGradeInput.value
  pointsNeeded = Math.round ((targetGrade - currentGrade)*100) / 100
  pointsNeededDisplay.innerHTML = pointsNeeded

  // Calculate and show points needed per week
  var weeksRemaining = Math.floor(daysRemaining / 7)
  var pointsPerWeek = Math.round(pointsNeeded / weeksRemaining * 100) / 100
  pointsPerWeekDisplay.innerHTML = pointsPerWeek

  // Calculate and show points needed per day
  var pointsPerDay = Math.round(pointsNeeded / daysRemaining * 100) / 100
  pointsPerDayDisplay.innerHTML = pointsPerDay
}

var updateProjectMath = function() {
  var totalPoints = 0
  totalPoints = Math.round(
    ((x09Projects.value * .09) + (x19Projects.value * .19) + (x28Projects.value * .28))
    * 100)
    /100
  totalPointsDisplay.innerHTML = totalPoints
  pointsStillNeededDisplay.innerHTML = Math.round((pointsNeeded - totalPoints)*100)/100
}

// Set dates when the page loads
window.onload = function() {
  targetDateInput.value = todayFormatted
}

// Update when things change
updateForm.addEventListener('click', getTargets)
x09Projects.addEventListener('change', updateProjectMath)
x19Projects.addEventListener('change', updateProjectMath)
x28Projects.addEventListener('change', updateProjectMath)
