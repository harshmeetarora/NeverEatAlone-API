// calendar js
let model = require('./Database/db.js');


var checkAvailability = function(data, callback){
    
    var availabilityPromise = checkCalendar(friends, date, timeStart, timeEnd);

    availabilityPromise.then(
        function(data){
            //remove all not available ones returned from friends
            // remove all that are not within distance
            callback();
        }
    );
}

var checkDistanceRecursive = function(friends, radius, index, results){
    var inRangePromise = checkInRange(friends[index], radius);
    inRangePromise.then(function(data){
        if (data){ //has event TODO 

        }
    });
}

var findAvailableFriends = function(id, time){
    var friendsPromise = model.getFriends(id);
    friendsPromise.then(
        function(data){
            checkAvailability(data, time);
        }, function(){
            //nothing as of now TODO
        }
    );
}

