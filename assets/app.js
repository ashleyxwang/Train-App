// Get a reference to the database service
var database = firebase.database();
var tFrequency = 3;

// Time is 3:30 AM
var firstTime = "03:30";

// First Time (pushed back 1 year to make sure it comes before current time)
var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
console.log(firstTimeConverted);

// Current Time
var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// Difference between the times
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
var tRemainder = diffTime % tFrequency;
console.log(tRemainder);

// Minute Until Train
var tMinutesTillTrain = tFrequency - tRemainder;
console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next Train
var nextTrain = moment().add(tMinutesTillTrain, "minutes");
console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

function writeNewTrain(trainName, destination, firstTime, frequency) {
    var trainData = {
      trainName: trainName,
      destination: destination,
      firstTime: firstTime,
      frequency: frequency,
    };
  
    // Get a key for a new train entry
    var newTrainKey = firebase.database().ref().child('trains').push().key;
  
    var updates = {};
    updates['/trains/' + newTrainKey] = trainData;

    firebase.database().ref().update(updates);
}

function loadTrains() {
    firebase.database().ref('trains').on('value', function(snap){
        snap.forEach(function(trainItem){
            console.log(trainItem.val().trainName);
            var existingNames = (trainItem.val().trainName);
            var existingDestination = (trainItem.val().destination);
            var existingFrequency = (trainItem.val().frequency);
            addToSchedule(existingNames, existingDestination, existingFrequency);
        })
        // console.log(snap.val());

    });
    // console.log(existingTrains);
}

function addToSchedule(trainName, destination, frequency) {
   var tName = $("<li>").addClass("list-group-item").append(trainName);
   var tDest = $("<li>").addClass("list-group-item").append(destination);
   var tFreq = $("<li>").addClass("list-group-item").append(frequency);

   $("#nameList").append(tName);
   $("#destList").append(tDest);
   $("#freqList").append(tFreq);

}

$(document).ready(function() {
    loadTrains();

    $("#submitButton").on("click", function() {
        var trainName = $("#trainName").val();
        var destination = $("#trainDestination").val();
        var firstTime = $("#initialTrainTime").val();
        var frequency = $("#trainFrequency").val();

        writeNewTrain(trainName, destination, firstTime, frequency);  
        addToSchedule(trainName, destination, frequency);
    });




});