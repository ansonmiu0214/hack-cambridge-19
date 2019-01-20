import React, { Component } from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import axios from 'axios';
import RecordRTC from 'recordrtc';

const TIME_MILLIS = 2 * 60 * 1000

const PROD = true
if (PROD) axios.defaults.baseURL = 'http://104.42.50.12'

class RecordView extends Component {

  constructor(props) {
    super(props)
    this.invokeSaveAsDialog = this.invokeSaveAsDialog.bind(this)
  }
  
  state = {
    videoSupport: true,
    questionTitle: null,
    recorder: undefined
  }
  
  componentDidMount() {
    const that = this
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

          that.setState({ recorder })
          // video.play()
          recorder.startRecording();

          setTimeout(()=> recorder.stopRecording(function() {
            that.invokeSaveAsDialog(recorder.getBlob());
          }), TIME_MILLIS);
          
        }catch (error) {
          video.src = window.URL.createObjectURL(stream)
        }
    })} else {
      this.setState({ videoSupport: false })
    }
    
    axios.get('/getQuestion').then(function ({ data }){
      var rand = data[Math.floor(Math.random() * data.length)];
      console.log(rand.Questions)
      that.setState({ questionTitle: rand.Questions})
      var time = TIME_MILLIS / 1000 ,
      display = document.querySelector('#time');
      that.startTimer(time, display);
      // parseResponse(data);
    }).catch(function(e){
      console.log(e)});
      
  }

  startTimer(duration, display) {
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

  stopRecording() {
    const recorder = this.state.recorder
    const that = this
    recorder.stopRecording(() => that.invokeSaveAsDialog(recorder.getBlob()))
  }

  invokeSaveAsDialog(file, fileName) {
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

    this.props.handleVideo(file, fileFullName)
  
    // if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
    //     return navigator.msSaveOrOpenBlob(file, fileFullName);
    // } else if (typeof navigator.msSaveBlob !== 'undefined') {
    //     return navigator.msSaveBlob(file, fileFullName);
    // }
    // var hyperlink = document.createElement('a');
    // hyperlink.href = URL.createObjectURL(file);
    // hyperlink.download = fileFullName;
    // hyperlink.style = 'display:none;opacity:0;color:transparent;';
    // (document.body || document.documentElement).appendChild(hyperlink);
    // if (typeof hyperlink.click === 'function') {
    //     hyperlink.click();
    // } else {
    //     hyperlink.target = '_blank';
    //     hyperlink.dispatchEvent(new MouseEvent('click', {
    //         view: window,
    //         bubbles: true,
    //         cancelable: true
    //     }));
    // }
    // URL.revokeObjectURL(hyperlink.href);
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
              <video id="video" width="720" height="540" autoPlay></video>
            </Grid>
            :
            <Typography variant="h5">Video Blocked By Browser</Typography>
        }
         <div id="webcamcontrols">
          <Button color="primary" variant="contained"  onClick={e => this.stopRecording()}>STOP</Button>
        </div>
        </Grid>
      </Grid>
    );
  }
}

// function startTimer(duration, display) {
//   var timer = duration, minutes, seconds;
//   setInterval(function () {
//       minutes = parseInt(timer / 60, 10)
//       seconds = parseInt(timer % 60, 10);

//       minutes = minutes < 10 ? "0" + minutes : minutes;
//       seconds = seconds < 10 ? "0" + seconds : seconds;

//       display.textContent = minutes + ":" + seconds;

//       if (--timer < 0) {
//           timer = duration;
          
//       }
//   }, 1000);
// }

// function invokeSaveAsDialog(file, fileName) {
//   if (!file) {
//       throw 'Blob object is required.';
//   }
//   if (!file.type) {
//       try {
//           file.type = 'video/webm';
//       } catch (e) {}
//   }
//   var fileExtension = (file.type || 'video/mp4').split('/')[1];
//   if (fileName && fileName.indexOf('.') !== -1) {
//       var splitted = fileName.split('.');
//       fileName = splitted[0];
//       fileExtension = splitted[1];
//   }
//   var fileFullName = (fileName || (Math.round(Math.random() * 9999999999) + 888888888)) + '.' + fileExtension;



//   if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
//       return navigator.msSaveOrOpenBlob(file, fileFullName);
//   } else if (typeof navigator.msSaveBlob !== 'undefined') {
//       return navigator.msSaveBlob(file, fileFullName);
//   }
//   var hyperlink = document.createElement('a');
//   hyperlink.href = URL.createObjectURL(file);
//   hyperlink.download = fileFullName;
//   hyperlink.style = 'display:none;opacity:0;color:transparent;';
//   (document.body || document.documentElement).appendChild(hyperlink);
//   if (typeof hyperlink.click === 'function') {
//       hyperlink.click();
//   } else {
//       hyperlink.target = '_blank';
//       hyperlink.dispatchEvent(new MouseEvent('click', {
//           view: window,
//           bubbles: true,
//           cancelable: true
//       }));
//   }
//   URL.revokeObjectURL(hyperlink.href);
// }

export default RecordView;