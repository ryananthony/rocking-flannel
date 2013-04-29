function voteSort(songArray) {
  var sortedSongs = []
  for (var song in songArray) 
  {
    var songRecord = new Object()
        songRecord.unique_id = songArray[song].unique_id
        songRecord.artist = songArray[song].artist
        songRecord.album = songArray[song].album
        songRecord.title = songArray[song].title
        songRecord.link = songArray[song].link
        songRecord.comfort = songArray[song].comfort
        songRecord.votes = songArray[song].votes
    if (sortedSongs.length === 0) // if empty, add the first record
    {
      sortedSongs.push(songRecord)
      continue
    } 
    for (var record in sortedSongs) 
    {
      var thisIndex = record
      var thisVote = sortedSongs[record].votes

      if (songRecord.votes >= thisVote) { //add at last position
        sortedSongs.splice(thisIndex, 0, songRecord);
        break
      }
      else if (songRecord.votes == thisVote /*|| songRecord.votes == 1*/) { // they should be equal so add at this position
        sortedSongs.splice(record, 0, songRecord);
        break
      }
    } // end sorting THIS song
  } // end sorting all songs
  //console.log(sortedSongs)
  return sortedSongs
}


exports.index = function(req, res){
  global.couch.get('song', function (err, doc) {
    if (err) {
      console.log('fail')
    }
    else
    {
      sortedSongs = voteSort(doc.cover)
      res.render('home', {
        songs: sortedSongs
      });
    }
  });

};


exports.add_song = function(req, res){

  if (res.locals.submission.artist != '' && 
      res.locals.submission.title != '' && 
      res.locals.submission.email != '' )
  {
    global.couch.get('song', function (err, doc) {
      if (err) {
        console.log('failed to fetch document')
      } else {
        //res.send('nothing')
        var songId = res.locals.submission.artist.replace(/\W/g, '').toLowerCase() + '_' + res.locals.submission.title.replace(/\W/g, '').toLowerCase()
        
        var songExistsFlag = 0
        for (var song in doc.cover) 
        {
          //console.log(doc.cover[song].unique_id)
          if (doc.cover[song].unique_id == songId) 
          {
            songExistsFlag = 1
          }
        }
          
        if (songExistsFlag == 0)
          {
                var songSubmission = new Object()
                songSubmission.unique_id = songId
                songSubmission.artist = res.locals.submission.artist
                songSubmission.title = res.locals.submission.title
                songSubmission.email = res.locals.submission.email
                if (res.locals.submission.album) {
                  songSubmission.album = res.locals.submission.album
                }
                if (res.locals.submission.link != '') {
                  songSubmission.link = res.locals.submission.link
                }
                if (res.locals.submission.name != '') {
                  songSubmission.user = res.locals.submission.user
                }

                songSubmission.votes = 1
                songSubmission.comfort = 0

                doc.cover.push(songSubmission)

                global.couch.save('song', doc, function (err, newDoc) {
                  if (err) {
                    console.log('failed to save document')
                  }
                  else
                  {
                    global.couch.get('song', function (err, doc) {
                      if (err) {
                        console.log('fail')
                      }
                      else
                      {
                        sortedSongs = voteSort(doc.cover)
                        console.log('Song added.')
                        res.render('vote', {
                          songs: sortedSongs,
                          addError: 'Song added successfully, thanks!'
                        });
                      }
                    }); 
                  } //doc saved, ok
                }); //saving doc back to couch
        
        } 
        else 
        {
          sortedSongs = voteSort(doc.cover)
          console.log('ID exists')
          res.render('vote', {
            songs: sortedSongs,
            voteError: 'Does the song already exist?'
          });
        }// ID already exist


      } //db connection successful
    }); //couch request

  } else { // missing a required field, pass error
    global.couch.get('song', function (err, doc) {
      if (err) {
        console.log('fail')
      }
      else
      {
        sortedSongs = voteSort(doc.cover)
        console.log('User missed a required field.')
        res.render('vote', {
          songs: sortedSongs,
          addError: 'You missed a required field!'
        });
      }
    }); 
  }

}; //outer



exports.vote = function(req, res){
  var songId = res.locals.vote
  var ip = res.locals.ip
  var voteEnabled = 0

  var waitingPeriod = 1440 // for the time in minutes between votes
  var maxVotes = 3 // how many total votes before the wait

  console.log(ip + ' voted for ' + songId)

  if (typeof(songId) !== 'undefined') { 
  global.couch.get('user', function (err, doc) 
  {
    if (err) 
    {
      console.log('failed to fetch user list')
    }
    else // find the user object by IP Address
    {
      for (var userRecord in doc.votes) 
      {
        if (doc.votes[userRecord].ip == ip) 
        {
          var currentUser = doc.votes[userRecord]
          var previousIndex = userRecord
          console.log('vote record should have just spliced')
          break
        }
      }

      if (!currentUser) // create user object if not exists
      {
        var newUser = new Object()
        newUser.ip = ip
        newUser.stamp = []
        var currentUser = newUser 
        console.log('current user at new user: ' + currentUser)  //debug
              
      }

      //check number of timestamps
      if (currentUser.stamp.length < maxVotes) 
      {
        voteEnabled = 1
      }
      else // user exists and has voted 3 times, compare stamps
      {
        
        var now = new Date()
        for (var timeStamp in currentUser.stamp)
        {
          var voteTime = currentUser.stamp[timeStamp]
          //console.log(now)
          console.log(currentUser.stamp.length)
          console.log(voteTime)
          var minsBetween = (now.getTime() - voteTime) / (1000 * 60)
          console.log(minsBetween)

          if (minsBetween > waitingPeriod) 
          { 
            //mins in week 10080
            console.log('current user at minsBetween check: ' + currentUser)  //debug
            currentUser.stamp.splice(timeStamp, 1)
            voteEnabled = 1
          }
        }
      }

      //add the timestamp to the users vote record
      var now = new Date()
      //console.log(currentUser.stamp) 
      console.log('current user at vote enabled: ' + currentUser)  //debug
      if (currentUser.stamp.length < 3) {
        currentUser.stamp.push(now.getTime())
      }
      
      // drop old version of user
      if (previousIndex) {
        console.log('before: ' + doc.votes.length)
        doc.votes.splice(previousIndex, 1)
        console.log('after: ' + doc.votes.length)
      }

      doc.votes.push(currentUser)

      global.couch.save('user', doc, function (err, user) {
        if (err) {
          console.log('failed to save user doc for stamp increment')
        }
      });

      if (voteEnabled == 1) 
      {
        //update the vote
        global.couch.get('song', function (err, doc) 
        {
          if (err) {
            console.log('failed to fetch song list')
          }
          else
          {
            //find the matching song, then increment the vote count
            for (var song in doc.cover) 
            {
              //console.log(song)
              if (doc.cover[song].unique_id == songId) 
              {
               // console.log(doc.cover[song].votes)
                doc.cover[song].votes = parseInt(doc.cover[song].votes) + 1
              }
            }
            
            global.couch.save('song', doc, function (err, newDoc) 
            {
              if (err) 
              {
                console.log('failed to save document')
              }
            });

          sortedSongs = voteSort(doc.cover)
          console.log('Vote saved to database successfully.')
          res.render('vote', 
          {
            songs: sortedSongs,
            voteError: 'Thanks for voting!'
          });
          }
        });
      }
      else //user is out of votes
      {
        global.couch.get('song', function (err, doc) {
          if (err) {
            console.log('fail')
          }
          else
          {
            sortedSongs = voteSort(doc.cover)
            console.log('User out of votes.')
            res.render('vote', {
              songs: sortedSongs,
              voteError: 'Sorry, you have used all your votes!'
            });
          }
        }); 
      }
    }

  });

} else { //probably a GET requert, just render the list
  global.couch.get('song', function (err, doc) {
    if (err) {
      console.log('fail')
    }
    else 
    {
      console.log(doc.cover)
      sortedSongs = voteSort(doc.cover)

      res.render('vote', {
        songs: doc.cover
      });
    }
  });
}


};