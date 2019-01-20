import React, { Component } from 'react';
import { Typography,Grid,Card,CardContent, withStyles, Paper, Divider } from '@material-ui/core';
import axios from 'axios'
import Loader from '../Loader';

const PROD = true
if (PROD) axios.defaults.baseURL = 'http://104.42.50.12'

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
  const { title, text, classes, isBad } = props

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" style={isBad === undefined ? {} : { color: isBad ? 'red' : '#006564' }} gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" component="h2" style={isBad === undefined ? {} : { color: isBad ? 'red' : '#006564' }}>
          {text}
        </Typography>
      </CardContent>
    </Card>
  )
}

const StyledCard = withStyles(styles)(DataCard)

const paperStyles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

function PaperSheet(props) {
  const { classes } = props;

  return (
    <div>
      <Paper className={classes.root} elevation={1}>
        <Typography component="p">
          {props.text}
        </Typography>
      </Paper>
    </div>
  );
}

const StyledPaper = withStyles(paperStyles)(PaperSheet)

class OneResult extends Component {
  state = { 
    loading: true,
    error: false,
    data: undefined
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
        this.setState({ loading: false, data: data })
      }).catch(error => {
        console.error(error)
        this.setState({ loading: false, error: true })
      })

  }

  render() { 
    const { loading, error, data } = this.state
    // const transcript = "I think that my experience with technology and, in particular, my ability to maintain and update websites, make me a good match for this position. In my most recent position, I was responsible for maintaining our department web page. This required updating student and faculty profiles, and posting information about upcoming events. In my free time, I learned to code in JavaScript and Swift. I then used my coding skills to revamp our homepage and received praise from our department head and the Dean of Students for my initiative. I would love to bring my coding skills and my general passion for learning new technologies to this position."
    return (
      <>
      {
        loading && <Loader text="Analysing your interview in the cloud... This will take a few minutes..."/>
      }
      {
        !loading && !error && 
        <Grid container spacing={32}>
          <Grid item xs={6}>
            <Grid container direction="column" spacing={16}>
              <Grid item>
                <Typography variant="h3" style={{textAlign: 'center'}}>Overall Result</Typography>
                <video width="480" height="320" controls>
                    <source src="video.mp4" type="video/mp4"></source>
                </video>
              </Grid>
              <Grid item>
                <Typography variant="h4">Speech Transcript</Typography>
                <StyledPaper text={data.transcript} />
              </Grid>
            </Grid>
          </Grid>
       
         <Grid item xs={6} style={{textAlign: 'center'}}>
          <Typography variant="h4">By The Numbers</Typography>
          
          <br/>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              <StyledCard title="Clarity Score" text={data.clarity_score} />
            </Grid>
            <Grid item xs={6}>
              <StyledCard title="Sentiment Score" text={data.sentiment_score} />
            </Grid>
            <Grid item xs={6}>
              <StyledCard title="Average speed" text={data.average_speed} />
            </Grid>
            <Grid item xs={6}>
              <StyledCard title="Total delay time" text={data.time_delay} />
            </Grid>
          </Grid>

          <Divider />

          <Typography style={{marginTop: '40px'}} variant="h4">Insights</Typography>

          <Grid container spacing={16}>
            {
              data.improvement_on_sentiment &&
              <Grid item xs={6}>
                <StyledCard text="Improvement to Sentiment" title="Point of Improvement" />
              </Grid>
            }
            {
              data.speak_too_fast &&
              <Grid item xs={6}>
                <StyledCard text="Speaking too fast" title="Point of Improvement" />
              </Grid>
            }
            {
              data.speak_too_slow && 
              <Grid item xs={6}>
                <StyledCard text="Speaking too slow" title="Point of Improvement" />
              </Grid>
            }
            {
              data.long_delay &&
              <Grid item xs={6}>
                <StyledCard text="Delay Time Longer Than Average" title="Point of Improvement" />
              </Grid>
            }
            <Grid item xs={6}>
              <StyledCard isBad={data.sentiment_decision} text={data.sentiment_decision ? "You should show more enthusiasm" : "Good interaction!"} title="Sentiment Decision" />
            </Grid>
            <Grid item xs={6}>
              <StyledCard isBad={data.clarity_decision} text={data.clarity_decision ? "You should focus more on your speaking clarity." : "Your clarity is good."} title="Clarity Decision" />
            </Grid>
            <Grid item xs={6}>
              <StyledCard isBad={data.delay_time_decision} text={data.delay_time_decision ? "You should try to speak more." : "Good time usage."} title="Delay Time Decision" />
            </Grid>
          </Grid>

          <br/>

          <Divider />

          <Typography style={{marginTop: '40px'}} variant="h4">Most Frequent Words</Typography>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              <StyledCard title="1st Most Frequent" text={data.first_word} />
            </Grid>
            <Grid item xs={6}>
              <StyledCard title="2nd Most Frequent" text={data.second_word} />
            </Grid>
            <Grid item xs={6}>
              <StyledCard title="3rd Most Frequent" text={data.third_word} />
            </Grid>
          </Grid>
        </Grid>
         
        </Grid>

      }
      </>
    );
  }
}
 
export default OneResult;