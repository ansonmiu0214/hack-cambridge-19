import React, { Component } from 'react';
import { Typography, Button, withStyles, Grid, TextField, MenuItem } from '@material-ui/core';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

class StartView extends Component {
  state = {
    careerField: 'Software Engineer',
    interviewType: 'Individual'
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() { 
    const careerFields = ['Software Engineer', 'Data Scientist', 'UI/UX Designer']
    const interviewTypes = ['Individual', 'Group']

    const { classes, nextBtn } = this.props
    return ( 
      <div>
        <Typography variant="h3">
          Start Your Mock Interview!
        </Typography>

        <Grid container spacing={32}>
          <Grid item xs={6}>
            <TextField
              id="select-career"
              select
              label="Career Field"
              className={classes.textField}
              value={this.state.careerField}
              onChange={this.handleChange('careerField')}
              // SelectProps={{
              //   MenuProps: {
              //     className: classes.menu,
              //   },
              // }}
              helperText="Please select your career field"
              margin="normal"
              fullWidth
            >
              {careerFields.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
          <TextField
              id="select-type"
              select
              label="Interview Type"
              className={classes.textField}
              value={this.state.interviewType}
              onChange={this.handleChange('interviewType')}
              // SelectProps={{
              //   MenuProps: {
              //     className: classes.menu,
              //   },
              // }}
              helperText="Please select your interview type"
              margin="normal"
              fullWidth
            >
              {interviewTypes.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

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