$(function() {
	'use strict';
	
	var currentUri = null;
	var socketUrl = window.location.protocol + '//' + window.location.host;
	var socket;
	
	$('#connectForm').submit(function(e) {
		e.preventDefault();
		if(currentUri) {
			socket.removeAllListeners(currentUri);
		}	
		socket = io.connect(socketUrl);		
		socket.on('connection', function (data) {
			$('#log-list').append('<li class="list-group-item">Connected to server</li>');
			console.log(data);
		});
		
		var uri = $('#webhookUri').val().trim();				
		
		var currentUri = uri === '*' ? 'webhookEvent:all' : 'webhookEvent:' + uri;
		var webhookUrl = socketUrl + '/webhook/' + uri;

		$('#log-list').prepend($('<li></li>').attr('class', 'list-group-item').html('Connected to: <a target="_blank" href="' + webhookUrl + '">' + webhookUrl + '</a>'));
		
		socket.on(currentUri , function(event, data) {
			addLog(event);
			console.log(currentUri, event, data);
		});
				
	});

	window.toggleListItem = function(item) {
		$(item).next('.list-group-item-body').toggle();
	};
	
	function addLog(log) {
		$('#logItemTemplate').tmpl(log).prependTo('#log-list')			
	}
	
});