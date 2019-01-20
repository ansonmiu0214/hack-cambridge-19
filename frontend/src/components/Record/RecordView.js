import React, { Component } from 'react';
import { Grid, Typography } from '@material-ui/core';
import axios from 'axios';
import RecordRTC from 'recordrtc';

class RecordView extends Component {
  
  state = {
    videoSupport: true,
    questionTitle: null
  }
  
  componentDidMount() {
    const video = document.getElementById('video')
    console.log(video)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(async function (stream) {
          try {
            video.srcObject = stream
            let recorder = RecordRTC(stream, {
              type: 'video'
          });
          // video.play()
          recorder.startRecording();

          setTimeout(()=> recorder.stopRecording(function() {
            invokeSaveAsDialog(recorder.getBlob());
          }),2000);
          
        }catch (error) {
          video.src = window.URL.createObjectURL(stream)
        }
    })} else {
      this.setState({ videoSupport: false })
    }

    const that = this
    
    axios.get('/getQuestion').then(function ({ data }){
      var rand = data[Math.floor(Math.random() * data.length)];
      console.log(rand.Questions)
      that.setState({ questionTitle: rand.Questions})
      // parseResponse(data);
    }).catch(function(e){
      console.log(e)});
      
    var time = 2*60 ,
    display = document.querySelector('#time');
    startTimer(time, display);
  }

  
  render() { 
    const { videoSupport, questionTitle } = this.state
    return ( 
      <Grid container spacing={16}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h3">Q1 of 6</Typography>
          <Typography variant="h5">
          {questionTitle}
          </Typography>

         </Grid>
         <Grid item xs={12} sm={6}>
         <Typography variant="h4"> Time Left: <span id="time">
         </span></Typography>
        
       

        {
          videoSupport 
            ?
            <Grid item xs={12} sm={6}>
              <video id="video" width="640" height="480" autoPlay></video>
            </Grid>
            :
            <Typography variant="h5">Video Blocked By Browser</Typography>
        }
         <div id="webcamcontrols">
          <button class="recordbutton" >RECORD</button>
        </div>
        </Grid>
      </Grid>
    );
  }
}

function startTimer(duration, display) {
  var timer = duration, minutes, seconds;
  setInterval(function () {
      minutes = parseInt(timer / 60, 10)
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
          timer = duration;
          
      }
  }, 1000);
}

function invokeSaveAsDialog(file, fileName) {
  if (!file) {
      throw 'Blob object is required.';
  }
  if (!file.type) {
      try {
          file.type = 'video/webm';
      } catch (e) {}
  }
  var fileExtension = (file.type || 'video/mp4').split('/')[1];
  if (fileName && fileName.indexOf('.') !== -1) {
      var splitted = fileName.split('.');
      fileName = splitted[0];
      fileExtension = splitted[1];
  }
  var fileFullName = (fileName || (Math.round(Math.random() * 9999999999) + 888888888)) + '.' + fileExtension;
  if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
      return navigator.msSaveOrOpenBlob(file, fileFullName);
  } else if (typeof navigator.msSaveBlob !== 'undefined') {
      return navigator.msSaveBlob(file, fileFullName);
  }
  var hyperlink = document.createElement('a');
  hyperlink.href = URL.createObjectURL(file);
  hyperlink.download = fileFullName;
  hyperlink.style = 'display:none;opacity:0;color:transparent;';
  (document.body || document.documentElement).appendChild(hyperlink);
  if (typeof hyperlink.click === 'function') {
      hyperlink.click();
  } else {
      hyperlink.target = '_blank';
      hyperlink.dispatchEvent(new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
      }));
  }
  URL.revokeObjectURL(hyperlink.href);
}

export default RecordView;