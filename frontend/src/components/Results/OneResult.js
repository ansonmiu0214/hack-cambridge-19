import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import axios from 'axios'
import Loader from '../Loader';

class OneResult extends Component {
  state = { 
    loading: true,
    error: false
  }

  componentDidMount() {
    this.checkProgress(this.props.videoId)
  }

  checkProgress(videoId) {
    const that = this
    console.log(videoId)
    axios.get(`/progress?videoId=${videoId}`)
      .then(({ data }) => {
        console.log(data)

        if (data === 'Processed') that.getAnalysis(videoId)
        else setTimeout(() => that.checkProgress(videoId), 3000)
      })
      .catch(error => console.error(error))
  }

  getAnalysis(videoId) {
    axios.get(`/analysis?videoId=${videoId}`)
      .then(({ data }) => {
        console.log(data)
        this.setState({ loading: false })
      }).catch(error => {
        console.error(error)
        this.setState({ loading: false, error: true })
      })

  }

  render() { 
    const { loading, error } = this.state
    return (
      <>
      {
        loading && <Loader />
      }
      {
        !loading && !error && 
        <Typography variant="h3">Results</Typography>
      }
      </>
    );
  }
}
 
export default OneResult;