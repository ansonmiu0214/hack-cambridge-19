import React, { Component } from 'react';
import NavBar from './NavBar';
import StartView from './Selection/StartView';
import { Grid } from '@material-ui/core';
import RecordView from './Record/RecordView';
import GroupView from './Group/GroupView';

class MainApp extends Component {
  constructor(props) {
    super(props)
    this.startNextHandler = this.startNextHandler.bind(this)
    this.groupBtn = this.groupBtn.bind(this)
  }

  state = {
    stage: 1
  }

  startNextHandler = () => this.setState({ stage: 2 })

  groupBtn = () => this.setState({ stage: 4 })

  render() {
    const { stage } = this.state
    return (
      <>
      <NavBar groupBtn={this.groupBtn} />
      <Grid style={{marginTop: '30px'}} container justify='center'>
        <Grid item xs={10}>
          {
            (stage === 1) && <StartView nextBtn={this.startNextHandler}/>
          }
          {
            (stage === 2) && <RecordView />
          }
          {
            (stage === 4) && <GroupView />
          }
        </Grid>
      </Grid>
      </>
    )
  }
}

export default MainApp