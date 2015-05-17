var api = (function () {
	var experimentId = 0;
	var resultsLocation = '';

	var startExperiment = function(){
		$.ajax({
			type: "GET",
			url: 'http://janamargaret.com/hack/api/moleculyze-api/public/experiment/start',
			dataType : 'jsonp',
			crossDomain:true,
			success: function(data, status, xhr) {
				if(data.status == 200){
					experimentId = data.result.id;
				} else {
					api.showError('could not start experiment');
				}
			}
		});
	};

	var runExperiment = function(){
		if(experimentId != 0){
			var fiber_percentage = .8;
			var starch_percentage = .2;
			var enzyme1_temp = 50;
			var enzyme1_rate = 40;
			var enzyme2_temp = 80;
			var enzyme2_rate = 10;
			var enzyme3_temp = 140;
			var enzyme3_rate = 1;
			var enzyme4_temp = 100;
			var enzyme4_rate = 50;
			var yeast_temp = 80;
			var yeast_rate = 4;
			$.ajax({
				type: "POST",
				url: 'http://janamargaret.com/hack/api/moleculyze-api/public/experiment/' + api.experimentId,
				data: {
					fiber_percentage: fiber_percentage,
					starch_percentage: starch_percentage,
					enzyme1_temp: enzyme1_temp,
					enzyme1_rate: enzyme1_rate,
					enzyme2_temp: enzyme2_temp,
					enzyme2_rate: enzyme2_rate,
					enzyme3_temp: enzyme3_temp,
					enzyme3_rate: enzyme3_rate,
					enzyme4_temp: enzyme4_temp,
					enzyme4_rate: enzyme4_rate,
					yeast_temp: yeast_temp,
					yeast_rate: yeast_rate
				},
				dataType: 'jsonp',
				crossDomain: true,
				success: function(data, status, xhr) {
					if(data.status == 400){
						var message = '';
						for(var i=0; i< data.messages.length; i++){
							message += '-'+data.messages[i]+'<br/>';
						}
						api.showError(message);
					} else {
						resultsLocation = data.location;
					}
				}
			});
		} else {
			api.showError('There\'s no experiment to run!');
		}
	};

	var getResults = function(){
		if(resultsLocation != ''){
			$.ajax({
				type: "GET",
				url: 'http://janamargaret.com/hack/api/moleculyze-api/public' + resultsLocation,
				dataType : 'jsonp',
				crossDomain:true,
				success: function(data, status, xhr) {
					if(data.status == 200){
						alert(data.results);
					} else {
						api.showError(data.message);
					}
				}
			});
		} else {
			api.showError('The experiment hasn\'t been run yet!');
		}
	};

	var showError = function(message){
		$('.container-fluid').prepend($('<div class="alert alert-danger">'+message+'</div>').delay(3000).slideUp('slow',function() { $(this).remove(); }));
	};

	return {
		startExperiment: startExperiment,
		runExperiment: runExperiment,
		getResults: getResults,
		showError: showError
	};
}());
