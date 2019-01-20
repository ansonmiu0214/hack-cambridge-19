import React, { Component } from 'react';
import { Typography,Grid,Card,CardContent, withStyles } from '@material-ui/core';
import axios from 'axios'
import Loader from '../Loader';

const styles = {
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

function DataCard(props) {
  const { title, text, classes } = props

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" component="h2">
          {text}
        </Typography>
      </CardContent>
    </Card>
  )
}

const StyledCard = withStyles(styles)(DataCard)

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
        <Grid container spacing={8}>
        <Grid item xs={12}></Grid>

        <Grid item xs={6} sm={6}>
          <Typography variant="h3">Overall Result</Typography>
         <video width="480" height="320" controls>
             <source src="video.mp4" type="video/mp4"></source>
         </video>
         <Typography variant="h4">  Speech Transcript:</Typography>
         <Typography variant="body">I think that my experience with technology and, in particular, my ability to maintain and update websites, make me a good match for this position. In my most recent position, I was responsible for maintaining our department web page. This required updating student and faculty profiles, and posting information about upcoming events. In my free time, I learned to code in JavaScript and Swift. I then used my coding skills to revamp our homepage and received praise from our department head and the Dean of Students for my initiative. I would love to bring my coding skills and my general passion for learning new technologies to this position.
         </Typography>
         </Grid>
       
         <Grid item xs={6} sm={6}>
         <Typography variant="h3">Insights</Typography>
         
         <br/>
         <StyledCard title="Clarity Score" text="3" />
         {/* <Card>
         <Typography variant="h5">Clarity Score</Typography>
         <Typography variant="h5">3</Typography>
          </Card> */}
          <br/>
          <StyledCard title="Sentiment Score" text="3" />
         {/* <Card>
          <Typography variant="h5">Sentiment Score</Typography>
         <Typography variant="h5">3</Typography> */}
         
         <br/>
         <StyledCard title="Improvement to Sentiment" text="3" />
         {/* <Card>
         <Typography variant="h5">Improvement on Sentiment</Typography>
         <Typography variant="h5">3</Typography>
         </Card> */}
         <br/>

         <StyledCard title="Average speed" text="4" />

         {/* <Card>
         <Typography variant="h5">Average speed</Typography>
         <Typography variant="h5">4</Typography> */}
         <br/>

         <StyledCard title="Speaking too fast" text="T" />
         {/* <Typography variant="h5">Speaking too fast</Typography>
         <Typography variant="h5">T</Typography> */}
         <br/>

         <StyledCard title="Speaking too slow" text="T" />
         {/* <Typography variant="h5">Speaking too slow</Typography>
         <Typography variant="h5">F</Typography>
         </Card> */}
         <br/>
         
         <StyledCard title="Total delay time" text="T" />
         {/* <Card>
         <Typography variant="h5">Total Delay time</Typography>
         <Typography variant="h5">3</Typography> */}

         <StyledCard title="Delay Time Longer Than Average" text="T" />
         {/* <Typography variant="h5">Delay Time Longer Than Average</Typography>
         <Typography variant="h5">T</Typography> */}
         {/* </Card> */}
         <br/>

         <StyledCard title="Top three most used words" text="Superised, HELOO, ?_?" />
         <Typography variant="h5">Top three most used words</Typography>
         <Typography variant="h5">Surprised, HELOO, ?_?</Typography>
         {/* </Card> */}
        </Grid>
         
         </Grid>

      }
      </>
    );
  }
}
 
export default OneResult;