var api = (function () {
	var experimentId = 0;
	var resultsLocation = '';
	var configuration = {};
	var baseurl = 'http://janamargaret.com/hack/api/moleculyze-api/public/experiment';

	var Config = function(){

		$.ajax({
			type: 'GET',
			url: baseurl + '/config',
			dataType: 'json',
			crossDomain: true,
			success: function(data, status, xhr) {
				if (data.status == 200) {
					$('#fiber-starch-ratio-slider').slider({
						min: 0,
						max: 100,
						value: 50
					});
					$('.vslider').slider({ orientation: 'vertical', reversed: true});
					$('.rate-slider').slider({
						min: data.config.rate_low,
						max: data.config.rate_high
					});

					$('#enzyme-1-temp-slider').slider({
						min: data.config.enzyme1_temp_low,
						max: data.config.enzyme1_temp_high
					});
					$('#enzyme-2-temp-slider').slider({
						min: data.config.enzyme2_temp_low,
						max: data.config.enzyme2_temp_high
					});
					$('#enzyme-3-temp-slider').slider({
						min: data.config.enzyme3_temp_low,
						max: data.config.enzyme3_temp_high
					});
					$('#enzyme-4-temp-slider').slider({
						min: data.config.enzyme4_temp_low,
						max: data.config.enzyme4_temp_high
					});
				} else {
					api.showError('could not get configuration');
				}
			}
		});
	};

	var startExperiment = function(){
		$.ajax({
			type: "GET",
			url: baseurl + '/start',
			dataType : 'json',
			crossDomain:true,
			success: function(data, status, xhr) {
				var res;
				if(data.status == 200){
					res = data.result;
					experimentId = res.id;
					$('#fiber-starch-ratio-slider').slider({value: res.fiber_percentage});
					$('#enzyme-1-temp-slider').slider({value: res.enzyme1_temp}).val(res.enzyme1_temp);
					$('#enzyme-1-rate-slider').slider({value: res.enzyme1_rate}).val(res.enzyme1_rate);
					$('#enzyme-2-temp-slider').slider({value: res.enzyme2_temp}).val(res.enzyme2_temp);
					$('#enzyme-2-rate-slider').slider({value: res.enzyme2_rate}).val(res.enzyme2_rate);
					$('#enzyme-3-temp-slider').slider({value: res.enzyme3_temp}).val(res.enzyme3_temp);
					$('#enzyme-3-rate-slider').slider({value: res.enzyme3_rate}).val(res.enzyme3_rate);
					$('#enzyme-4-temp-slider').slider({value: res.enzyme4_temp}).val(res.enzyme4_temp);
					$('#enzyme-4-rate-slider').slider({value: res.enzyme4_rate}).val(res.enzyme4_rate);
				} else {
					api.showError('could not start experiment');
				}
			}
		});
	};

	var runExperiment = function(data){
		var dataString;
		dataString = 'fiber_percentage=' + data.fiber_percentage +
			'&enzyme1_rate=' + data.enzyme1_rate +
			'&enzyme1_temp=' + data.enzyme1_temp +
			'&enzyme2_rate=' + data.enzyme2_rate +
			'&enzyme2_temp=' + data.enzyme2_temp +
			'&enzyme3_rate=' + data.enzyme3_rate +
			'&enzyme3_temp=' + data.enzyme3_temp +
			'&enzyme4_rate=' + data.enzyme4_rate +
			'&enzyme4_temp=' + data.enzyme4_temp;
		if(experimentId != 0){
			$.ajax({
				type: "POST",
				url: baseurl + '/run/' + experimentId,
				data: dataString,
				dataType: 'json',
				crossDomain: true,
				success: function(data, status, xhr) {
					if(data.status == 400){
						var message = '';
						message = _.values(data.messages).join(' - ' );

						//{
						//	message
						//})
						//for(var i=0; i< data.messages.length; i++){
						//	message += '-'+data.messages[i]+'<br/>';
						//}
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
				url: baseurl + '/results/' + experimentId,
				dataType : 'json',
				crossDomain:true,
				success: function(data, status, xhr) {
					if(data.status == 200){
						var res = data.result;
						$('#result-yield').html(res.yield_amount);
						//$('#result-co2').html(res.co2_amount);
						$('#result-energy').html(res.energy_cost);
						//$('#result-score').html(res.score);
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
		$('main').prepend($('<div class="alert alert-danger">'+message+'</div>').delay(3000).slideUp('slow',function() { $(this).remove(); }));
	};

	return {
		Config: Config,
		startExperiment: startExperiment,
		runExperiment: runExperiment,
		getResults: getResults,
		showError: showError
	};
}());
