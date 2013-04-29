$(document).ready(function() {

	$('.dropdown-toggle').dropdown()

	// $('#footer').click(function() {
	// 	$('#footer').append('You clicked');
	// });

	// validation for artist and title
	$("#submitSong").click(function(){
  		if ($("#songForm :input[type='text'][name='artist']").serialize() == 'artist=') {
  			$("#artistFeedback").empty();
  			$("#artistFeedback").html('Artist: <strong style="color:#FFA07A;"> Required</strong>')
  			return false;
  		} else if ($("#songForm :input[type='text'][name='title']").serialize() == 'title=') {
  			$("#titleFeedback").empty();
  			$("#titleFeedback").html('Title: <strong style="color:#FFA07A;"> Required</strong>')
  			return false;
  		} else if ($("#songForm :input[type='text'][name='email']").serialize() == 'email=') {
  			$("#emailFeedback").empty();
  			$("#emailFeedback").html('Email Address: <strong style="color:#FFA07A;"> Required</strong>')
  			return false;
  		}
  		// else {
  		// 	$.post('/add_song', $("#songForm").serialize())
  		// }
	});



	$('.voteShow > td > span').click(function() {
		$('#' + $(this).attr("value")).toggle('fast');
	});


	// send vote to server - TODO: make AJAX
	$(".voteSong > h4").click(function() 
	{
		// $("#voteForm").attr("value", $(this).attr('value')) 
		// $('#voteForm').submit();

		$.post('/vote', { vote: $(this).attr('value') }, function(data) {

			location.reload(true);
			//console.log(data)
		})
	})

	$(".voteSong > h4").hover(
		function() 
		{
			$(this).css( "background-color", "#00FF00" );
			$(this).css( "color", "#000" );
		},
		function() 
		{
			$(this).css( "background-color", "#0099cc" );
			$(this).css( "color", "#fff" );
		}
	)

	// $('#submitSong').click(function() {
		
	// 	if ($('input:checkbox:checked').val()) {
	// 		alert('No artist')
	// 		$('#formFeedback').append($('Artist required'));
	// 	} else {
	// 		alert('submitting now')
	// 		$.post('/', function(data) {
	// 			$('.result').html(data);
	// 			return false;
	// 		});			
	// 	}


	// });

});
