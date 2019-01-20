import React, { Component } from 'react';
import { Typography, Grid, Button } from '@material-ui/core';

import io from 'socket.io-client'

const PROD = false
const WS_URL = PROD ? 'http://104.42.50.12:5050' : 'http://localhost:5050'

const servers = { 'iceServers': [{ 'urls': 'stun:stun.services.mozilla.com' }, { 'urls': 'stun:stun.l.google.com:19302' }, { 'urls': 'turn:numb.viagenie.ca', 'credential': 'webrtc', 'username': 'websitebeaver@mail.com' }] };
const pc = new RTCPeerConnection(servers);

// database.on('child_added', readMessage);

class GroupView extends Component {

  constructor(props) {
    super(props)
    this.showFriendsFace = this.showFriendsFace.bind(this)
  }

  state = {
    socket: undefined,
    id: undefined,
    others: [undefined, undefined, undefined]
  }

  componentDidMount() {
    const video = document.getElementById('me')
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
          this.showMyFace(stream)
        })
    }

    const socket = io(WS_URL, { autoConnect: true })
    this.initSockets()

    socket.on('child_added', data => this.readMessage(this, data))
    socket.on('ack', ({ id } )=> {
      this.setState({ socket: socket, id: id })
    })
    
  }

  initSockets() {
    const friendsVideo = document.getElementById('you')

    pc.onicecandidate = (event => event.candidate ? this.sendMessage(null, ({ 'ice': event.candidate })) : console.log("Sent All Ice"));
    pc.onaddstream = (event => {
      console.log(event)
      alert('adding friend stream!')
      friendsVideo.srcObject = event.stream
    });
  }

  sendMessage(senderId = null, data) {
    this.state.socket.emit('send', data)
  
    // var msg = database.push({ sender: senderId, message: data });
    // msg.remove();
  }

  readMessage(that, payload) {
    console.log(payload)
    const { sender, data } = payload

    // const data = JSON.parse(jsonString)
    // console.log(data)
    if (sender == that.state.id) return
    if (data.ice != undefined)
      pc.addIceCandidate(new RTCIceCandidate(data.ice));
    else if (data.sdp.type == "offer")
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
        .then(() => pc.createAnswer())
        .then(answer => pc.setLocalDescription(answer))
        .then(() => that.sendMessage(null, ({ 'sdp': pc.localDescription })));
    else if (data.sdp.type == "answer")
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
  };

  showMyFace(stream) {
    pc.addStream(stream);
  }
  
  showFriendsFace() {
    const that = this
    console.log(this)
    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .then(() => that.sendMessage(null, ({ 'sdp': pc.localDescription })));
  }

  render() {
    const { others } = this.state
    return (
      <>
        <Typography variant="h3">Group Interview</Typography>
        <Grid container spacing={8}>
          <Grid item xs={6}>
            <video id="me" width="640" height="480" autoPlay />
          </Grid>

          <Grid item xs={6}>
            <video id="you" width="640" height="480" autoPlay />
          </Grid>

          {/* {
            others.map((socket, id) => {
              return (
                <Grid item key={id} xs={6}>
                  {socket === undefined && <p>No one here...</p>}
                </Grid>
              )
            })
          } */}
        </Grid>
        <Button onClick={this.showFriendsFace}>Show Friends</Button>

      </>
    );
  }
}

export default GroupView
