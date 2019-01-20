import React, { Component } from 'react';
import NavBar from './NavBar';
import StartView from './Selection/StartView';
import { Grid } from '@material-ui/core';
import RecordView from './Record/RecordView';
import GroupView from './Group/GroupView';
import Loader from './Loader';
import axios from 'axios';
import OneResult from './Results/OneResult';

const POST_ENDPOINT = '/post'

class MainApp extends Component {
  constructor(props) {
    super(props)
    this.startNextHandler = this.startNextHandler.bind(this)
    this.homeHandler = this.homeHandler.bind(this)
    this.groupBtn = this.groupBtn.bind(this)
    this.handleVideo = this.handleVideo.bind(this)
    this.lastSubmitted = this.lastSubmitted.bind(this)
  }

  state = {
    stage: 1,
    loading: false,
    videoId: undefined
  }

  homeHandler = () => this.setState({ stage: 1 })

  startNextHandler = () => this.setState({ stage: 2 })

  groupBtn = () => this.setState({ stage: 4 })

  lastSubmitted = () => this.setState({ stage: 3, loading: false, videoId: 'eb5d366dde'})

  handleVideo = (file, fileName) => {
    this.setState({ loading: true })

    const formData = new FormData()
    formData.append('file', file)

    axios.post(POST_ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(({ data }) => {
      this.setState({ loading: false, stage: 3, videoId: data })
    }).catch(error => {
      this.setState({ loading: false, stage: 1})
      console.error(error)
    })
    
  }

  render() {
    const { stage, loading, videoId } = this.state
    return (
      <>
      <NavBar groupBtn={this.groupBtn} lastSubmitted={this.lastSubmitted} homeHandler={this.homeHandler} />
      <Grid style={{marginTop: '30px'}} container justify='center'>
        <Grid item xs={10}>
          { loading && <Loader />}
          {
            (!loading && stage === 1) && <StartView nextBtn={this.startNextHandler}/>
          }
          {
            (!loading && stage === 2) && <RecordView handleVideo={this.handleVideo} />
          }
          {
            ((!loading && stage === 3)) && <OneResult videoId={videoId} />
          }
          {
            (!loading && stage === 4) && <GroupView />
          }
        </Grid>
      </Grid>
      </>
    )
  }
}

export default MainApp