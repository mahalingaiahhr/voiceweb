var AppCommands = ["play","stop","previous","pause","next","home","game","feedback","audio","video","suggestion","up","down","left","right","start","submit"];
window.voiceDuration = 250;
var suggestionText = "";
var audioPlayer = {
  audioData: {
    currentSong: -1,
    songs: []
  },
  // UI
  load: function() {
    this.data = data.songs;
     $("#audioPanel").empty();
    data.songs.forEach(function(val, i) {
      $("#audioPanel").append(
        "<li class='list-group-item'>" + val.singer + " - " + val.songName
      );
    })
    
    /*var commands = ["Play","Stop","Pause","Next","Previous"];
   for(var i=0;i<commands.length;i++) {
    $("#testrun").append("<p>"+commands[i]+"</p>");
    }*/
  },
  changeCurrentSongEffect: function(options) {
    if (options.play) {
      $("#audioPanel .list-group-item")
        .removeClass("list-group-item-success").find("span").remove();
      $("#audioPanel .list-group-item")
        .eq(this.audioData.currentSong)
        .addClass("list-group-item-success")
        .removeClass("list-group-item-danger")
        .append("<span class='glyphicon glyphicon-headphones'>");
    }
    if (options.end) {
      $("#audioPanel .list-group-item")
      .eq(this.audioData.currentSong)
      .removeClass("list-group-item-success glyphicon-headphones")
      .addClass("list-group-item-danger");
    }
  },
  playSong: function(audio) {
    this.changeCurrentSongEffect({
      play: 1
    });
    audio.onended = function() {
      audioPlayer.changeCurrentSongEffect({
        end: 1
      });
      audioPlayer.changeStatusCode("Finished listening to", true);
    }
    this.changeStatusCode("Playing", true, audio);
  },
  changeStatusCode: function(statusMessage, addSongName, scope) {
    if (addSongName) {
      statusMessage += " " + $("#audioPanel .list-group-item").eq(this.audioData.currentSong).text();
    }
    this.speak(statusMessage, scope);
    $(".status")
    .fadeOut("slow")
    .html(statusMessage)
    .fadeIn("slow");
  },
  changeLastCommand: function(cmd) {
	  if(AppCommands.indexOf(cmd) !== -1){
		  $(".l-command").css("color","green");
	  }else{
		  $(".l-command").css("color","red");
	  }
    $(".l-command").fadeOut("slow")
    .text(cmd)
    .fadeIn("slow");
  },
  toggleSpinner: function(show) {
    (show || false) ? $("#spinner").fadeIn(900) : $("#spinner").fadeOut(1200);
  },

  // Audio Player
  play: function() {
	  if(this.checkAudioOrVideo() == "video"){
		  this.videoActions("play");
	  }else{
		var currentSong = this.audioData.currentSong;
		if (currentSong === -1) {
		  this.audioData.currentSong = ++currentSong;
		  this.audioData.songs[this.audioData.currentSong] = new Audio(
			this.data[0].fileName);
		  this.playSong(this.audioData.songs[currentSong]);

		} else {
		  this.playSong(this.audioData.songs[currentSong]);
		}
	  }
  },
  checkAudioOrVideo:function(){
	  if($("#videoPanel").css("display") === "block"){
		  return "video";
	  }else{
		  return "audio";
	  }
  },
  videoActions:function(action){
	  var video = document.getElementById("videoTag");
	  switch (action){
		 case "play":
		 video.play();
			break;
		case "pause":
		video.pause();
			break;
		case "stop":
		video.currentTime = 0;
		video.pause();
			break;
      default:
        this.speak("Your command was invalid!", false);
    }
  },
  pauseSong: function(audio, stopPlayback) {
	  if(this.checkAudioOrVideo() == "video"){
		  this.videoActions("pause");
	  }else{
			if (audio.paused) {
			  return;
			}
			audio.pause();
			if (stopPlayback) {
			  this.changeStatusCode("Stopped", true);
			  audio.currentTime = 0;
			  return;
			}
			this.changeStatusCode("Paused", true);
	  }
  },
  stop: function(stopPlayback) {
	  if(this.checkAudioOrVideo() == "video"){
		  this.videoActions("stop");
	  }else{
		this.pauseSong(this.audioData.songs[this.audioData.currentSong], stopPlayback || false);
		if (stopPlayback) {
		  this.audioData.songs[this.audioData.currentSong].currentTime = 0;
		}
	  }
  },
  prev: function() {
    var currentSong = this.audioData.currentSong;
    if (typeof this.audioData.songs[currentSong - 1] !== 'undefined') {
      this.pauseSong(this.audioData.songs[currentSong]);
      this.audioData.currentSong = --currentSong;
      this.playSong(this.audioData.songs[currentSong]);

    } else if (currentSong > 0) {
      this.pauseSong(this.audioData.songs[currentSong]);
      this.audioData.currentSong = currentSong = --currentSong;
      this.audioData.songs[this.audioData.currentSong] = new Audio(
        this.data[currentSong].fileName);
      this.playSong(this.audioData.songs[currentSong]);
    } else {
      this.changeStatusCode("There are no previous songs.");
    }
  },
  next: function() {
    var currentSong = this.audioData.currentSong;
    if (currentSong > -1) {
      this.pauseSong(this.audioData.songs[currentSong]);
    }
    if (typeof this.data[currentSong + 1] !== 'undefined') {
      currentSong = ++this.audioData.currentSong;
      this.audioData.songs[this.audioData.currentSong] = new Audio(this.data[currentSong].fileName);
      this.playSong(this.audioData.songs[currentSong]);
    } else {
      this.changeStatusCode("You have reached the final song.");
    }
  },
  switchingTabs:function(cmd) {
	  window.voiceDuration = 250;
	  window.game_over = false;
	   $(".toggle").hide();
	   this.videoActions("pause");
	  if(cmd === "audio"){
	  $("#audioPanel").show();
	  }
	  else if(cmd === "home"){
		 this.switchigToNonaudio();
	    $("#homePanel").show();
	  }
	  else if(cmd === "video"){
		 this.switchigToNonaudio();
	    $("#videoPanel").show();
	  }
	  else if(cmd === "feedback"){
		  window.voiceDuration = 250;
		 this.switchigToNonaudio();
		$("#contactusPanel").show();
	  }
	  else if(cmd === "game" || cmd === "start"){
		  if(cmd == "start" && !$("#myCanvas").is(":visible")){
			  return;
		  }
		this.switchigToNonaudio();
		$("#gamePanel").show();
		create_snake();
		create_food();
		window.game_over = false;
	    window.the_date = new Date();
		window.test1 = window.the_date.getTime();
		window.stamp = window.the_date.getTime() + 500;
		setTimeout(function(){
			animate();
		},1000)
	  } 
  },
  switchigToNonaudio:function(){
	  if(this.audioData.currentSong !== -1){
	var currentSong = this.audioData.currentSong;
	this.pauseSong(this.audioData.songs[currentSong]);
	  }else{
		  return
	  }
  },
  searchSpecificSong: function(keyword) {
    try {
      this.data.forEach(function(val, i) {
        if (val.songName.trim().toLowerCase().indexOf(keyword) !== -1 ||
            val.singer.trim().toLowerCase().indexOf(keyword) !== -1) {
          if (typeof this.audioData.songs[i] !== 'undefined') {
            //if the song is already cached
            if (this.audioData.currentSong > -1) {
              this.pauseSong(this.audioData.songs[this.audioData.currentSong]);
            }
            this.audioData.currentSong = i;
            audioPlayer.playSong(audioPlayer.audioData.songs[i]);
            throw LoopBreakException;
          } else {
            //add the song and play it
            if (this.audioData.currentSong > -1) {
              this.pauseSong(this.audioData.songs[this.audioData.currentSong]);
            }
            this.audioData.currentSong = i;
            this.audioData.songs[i] = new Audio(this.data[i].fileName);
            this.playSong(this.audioData.songs[i]);
            throw LoopBreakException;
          }
        }
      }, audioPlayer);
    } catch (e) {
      return e;
    }
  },

  // Speech API
  speak: function(text, scope) {
    /*var message = new SpeechSynthesisUtterance(text.replace("-", " "));
    message.rate = 1;
    window.speechSynthesis.speak(message);*/
    if (scope) {
		scope.play();
      /*message.onend = function() {
        
      }*/
    }
  },
  rating : function(value){
    $('#feedback-rating').rating('update', value);
  },
  suggestion : function(value){
	  suggestionText = suggestionText+" "+value;
    $('#contactusPanel textarea').val(suggestionText);
  },
  resetRating : function(){
    if($("#contactusPanel").is(":visible")){
      $(".clear-rating").click();
    }
  },
  feedbackSubmit: function(){
    if($("#contactusPanel").is(":visible")){
		var that = this;
      db.transaction(function (tx) {
        var ratingVal = $('#feedback-rating').val(),
            descriptionVal = $('#contactusPanel textarea').val();
            if(ratingVal){
              tx.executeSql('INSERT INTO feedback (rating, description) VALUES (?, ?)',[ratingVal,descriptionVal]);
              $("#feedback-table tbody").prepend("<tr><td>"+ratingVal+"</td><td>"+descriptionVal+"</td></tr>");
            }
         $('#contactusPanel textarea').val("");
		 that.resetRating();
		 speak("thanks for you feed back");
           // msg = '<p>Log message created and row inserted.</p>';
           // document.querySelector('#status').innerHTML =  msg;
         });
    }
  },
  processCommands: function(cmd) {
    this.changeLastCommand(cmd);
	if($(".form-control").is(":focus")){
		if(cmd === "submit"){
			suggestionText = "";
			$(".form-control").blur();
		}else{
			this.suggestion(cmd);
			return;
		}
	}
    var playSpecific = cmd.match(/play\s*(.+)$/);
    if (playSpecific) {
      this.searchSpecificSong(playSpecific[1]);
      return;
    }
    if($("#contactusPanel").is(":visible")){
      //var ratingSpecific = cmd.match(/^\d*(.+)$/),
	  var ratingSpecific = cmd.split(" "),
          suggestionSpecific = cmd.match(/suggestion\s*(.+)$/);
      if (ratingSpecific && (ratingSpecific[1] === "star")) {
        this.rating(ratingSpecific[0]);
        return;
      }
	  if(cmd == "suggestion"){
		  $(".form-control").focus();
	  }
      if (suggestionSpecific) {
        this.suggestion(suggestionSpecific[1]);
        return;
      }
    }
    
	/*var cmds = cmd.split(" ");
	if(cmds[1] == "playlist"){
		cmd = cmds[0];
	}*/
    switch (cmd) {
      case "play":
        this.play();
        break;
      case 'pause':
        this.stop();
        break;
      case "stop":
        this.stop(true);
        break;
      case "next":
        this.next();
        break;
      case "previous":
        this.prev();
        break;
  	  case "audio":
  		this.switchingTabs("audio");
  		break;
  	  case "home":
  		this.switchingTabs("home");
  		break;
  	  case "video":
  		this.switchingTabs("video");
  		break;
  	  case "feedback":
  		this.switchingTabs("feedback");
  		break;
	  case "game":
  		this.switchingTabs("game");
  		break;
	  case "start":
  		this.switchingTabs("start");
  		break;
      case "reset":
		this.resetRating();
		 break;
      case "submit":
        this.feedbackSubmit();
        break;
	  case "up":
	    moveVoiceSnake("up");
		break;
	  case "down":
	    moveVoiceSnake("down");
		break;
	  case "left":
	    moveVoiceSnake("left");
		break;
	  case "right":
	    moveVoiceSnake("right");
		break;
      default:
        //this.speak("Your command was invalid!", false);
    }
  },
}
