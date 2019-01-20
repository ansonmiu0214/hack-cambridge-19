import React, { Component } from 'react';
import { Grid, Typography } from '@material-ui/core';

class RecordView extends Component {
  
  state = {
    videoSupport: true
  }

  componentDidMount() {
    const video = document.getElementById('video')
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          try {
            video.srcObject = stream
          } catch (error) {
            console.error(error)
            video.src = window.URL.createObjectURL(stream)
          }
          video.play()
        })
    } else {
      this.setState({ videoSupport: false })
    }
  }

  render() { 
    const { videoSupport } = this.state
    return ( 
      <Grid container spacing={16}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h3">Q1 of 6</Typography>
        </Grid>
        {
          videoSupport 
            ?
            <Grid item xs={12} sm={6}>
              <video id="video" width="640" height="480" autoPlay></video>
            </Grid>
            :
            <Typography variant="h5">Video Blocked By Browser</Typography>
        }
      </Grid>
    );
  }
}
 
export default RecordView;