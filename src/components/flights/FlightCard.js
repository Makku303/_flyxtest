import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from '@mdi/react'
import airport from 'airport-codes'
import moment from 'moment'
import { mdiAirplane } from '@mdi/js'
import { Box, IconButton } from '@material-ui/core'
import { Overlay } from '.'
import { grey } from '@material-ui/core/colors'
import {Edit, Delete} from '@material-ui/icons'
import EditFlight from './EditFlight'
import DeleteFlight from './DeleteFlight'
import { withFirebase } from '../../firebase'
import { connect } from 'react-redux'

const cardHeight = 300
const cardWidth = 236

const styles = {
  overlay: {
    borderRadius: 10,
    background: 'rgba(0,0,0,0.1)',
    height: '100%',
  },
  overlayHidden: {
    transform: `scale(0.8) translateY(-${cardHeight * 1.2}px)`
  },
  overlayShown: {
    transform: `scale(1) translateY(-${cardHeight}px)`
  },
  card: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
    boxSizing: 'border-box',
    padding: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    height: cardHeight,
    width: cardWidth,
    position: 'relative',
  },
  airportCode: {
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'Anton',
    fontSize: 32
  },
  airportName: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: 12
  }
}

/**
* @augments {Component<{  item:object>}
*/
class FlightCard extends Component {

  state = {
    hovered: false,
    editFlight: false,
    deleteFlight: false
  }

  render() {
    const { details, postId } = this.props
    const { hovered } = this.state
    return (
      <div style={styles.container}
        onMouseOver={this.hover.bind(this)}
        onMouseLeave={this.unhover.bind(this)}
      >
        <Box style={styles.card}>
          {this.renderFlight(details, postId)}
        </Box>
        <Overlay show={hovered} style={styles.overlay} styleShown={styles.overlayShown} styleHidden={styles.overlayHidden} />
      </div>
    )
  }

  async openFlightDetails(details){
    this.setState({ editFlight: true, data: details})
  }

  async deleteFlightDetails(postId){
    this.setState({ deleteFlight: true, postId: postId})
  }

  async addVote(postId, post){
    this.props.firebase.addVote(postId, post)
  }

  renderFlight(details, postId) {   
    const { editFlight, deleteFlight } = this.state 
    return (
      <div style={{ height: '97%', width: '97%', borderRadius: 8, backgroundColor: grey[200] }}>
        <div style={{ height: '5%', right: 10, display: 'flex', zIndex:1, justifyContent: 'space-between', margin: '2px 0px' }}>
          <IconButton onClick={() => this.openFlightDetails(details)} style={{ zIndex:10, width: 10, height: 10 }}>
          {
            !!editFlight ? <EditFlight open={editFlight} data={details} postId={postId} onClose={() => this.setState({ editFlight: false })} />
            : null
          }
            <Edit />
          </IconButton>
          <IconButton  onClick={() => this.deleteFlightDetails(postId)} style={{ zIndex:10, width: 10, height: 10 }}>
            {
              !!deleteFlight ? <DeleteFlight open={deleteFlight} postId={postId} onClose={() => this.setState({ deleteFlight: false })} />
              : null
            }
            <Delete />
          </IconButton>
        </div>
        <div style={{ height: '55%', cursor: 'pointer', position: 'relative', zIndex:99}} onClick={()=>this.addVote(postId, details)}>
          <div style={{ fontFamily: 'Open Sans Condensed', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 120, zIndex:99 }}>
            {details.current}
          </div>
        </div>
        <div style={{ height: '10%', display: 'flex', justifyContent: 'center' }}>
          {moment(details.date).format("LL")}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ flex: 2 }}>
            <div style={styles.airportCode}>
              {details.origin}
            </div>
            <div style={styles.airportName}>
              {this.formatAirport(airport.findWhere({ iata: details.origin }).get('name'))}
            </div>
          </div>
          <Icon
            style={{ flex: 1 }}
            path={mdiAirplane}
            rotate={90}
            size={2}
          />
          <div style={{ flex: 2 }}>
            <div style={styles.airportCode}>
              {details.destination}
            </div>
            <div style={styles.airportName}>{
              this.formatAirport(airport.findWhere({ iata: details.destination }).get('name'))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  formatAirport(airport) {
    return airport.replace(/\b(\w*Intl\w*)\b/g, "")
      .replace(/\b(\w*Airport\w*)\b/g, "")

  }

  hover() {
    this.setState({ hovered: true })
  }

  unhover() {
    this.setState({ hovered: false })
  }
}

FlightCard.propTypes = {
  item: PropTypes.object
}

const mapStateToProps = (state) => ({
  userId: state.auth.user.uid
})

export default connect(
  mapStateToProps
)(withFirebase(FlightCard))