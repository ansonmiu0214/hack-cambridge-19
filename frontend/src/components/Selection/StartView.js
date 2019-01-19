import React, { Component } from 'react';
import { Typography, Button, withStyles } from '@material-ui/core';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

class StartView extends Component {
  constructor(props) {
    super(props);
  }

  render() { 
    const { classes, nextBtn } = this.props
    return ( 
      <div>
        <Typography variant="h3">
          Start Your Mock Interview!
        </Typography>

        <Button 
          style={{float: 'right'}} 
          variant="contained" 
          color="primary" 
          className={classes.button}
          size="large"
          onClick={nextBtn}
          >
          Go
        </Button>
      </div>
    );
  }
}
 
export default withStyles(styles)(StartView);