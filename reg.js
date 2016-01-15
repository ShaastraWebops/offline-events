var onSpotReg = angular.module('onSpotReg', ['LocalStorageModule']);

onSpotReg.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('onSpotReg')
    .setStorageType('sessionStorage')
    .setNotify(true, true)
});

onSpotReg.controller('Ctrl', function($scope,$http,localStorageService) {
    
    var shaastraUrl = "http://localhost:8001/";
    var count = 0;
    localStorageService.clearAll();

	$scope.events = $http.get(shaastraUrl + "api/events/onSpotReg").then(function(response){
			console.log(response.data);
			return response.data;
	});

	function search(nameKey, myArray){
		//console.log(myArray);

		for (var i = 0; i < myArray.$$state.value.length; i++) {
			console.log(myArray.$$state.value[i]);
			if(myArray.$$state.value[i].name == nameKey)
				return myArray.$$state.value[i]._id;
		    return "NULL";
		};
	}
	
	$scope.register =function(){
	
		var eventId = search($scope.eventname,$scope.events);
		console.log(eventId);
		if(eventId != "NULL"){
			localStorageService.set(count,eventId + " " + $scope.teamId);
			count++;
			console.log("Saved in local storage")
			$scope.eventname=""
			$scope.teamId=""
		}
		else{
			console.log("Not Found")
		}
	};

	$scope.checkConnectionAndSync = function(){
		return $http.get(shaastraUrl + "api/test/").then(function(res){
			//console.log(res);
			if(res.data == "Active"){
				console.log("Connection Active. Syncing Now!");
				var keys = localStorageService.keys();

				for(key in keys){
					
					var curr = localStorageService.get(key).split(" ");
					// console.log(localStorageService.get(key));
					var currReg = {
						eventRegistered: curr[0],
						team: curr[1]
					}
					
					console.log(currReg);
					$http.post(shaastraUrl + "api/registrations/on",currReg).then(function(res){
						console.log(res);
						localStorageService.remove(key);
					});
				}		
			}
		});
	};

	/*function syncReg(){
		console.log(checkConnection());
		if(checkConnection() == 1){
			console.log("Preparing to Sync");
			var keys = localStorageService.keys();

			for(key in keys){
				var currReg = localStorageService.get(key);
				$http.post(shaastraUrl + "api/registrations/",currReg).then(function(res){
					console.log(res);
					localStorageService.remove(key);
				});
			}
		}
	};*/


});