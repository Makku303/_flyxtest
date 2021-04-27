import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withAuthorization } from '../../session'
import { withFirebase } from '../../firebase'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { Icon } from '@mdi/react'
import { mdiPlus } from '@mdi/js'
import { Main } from '../'
import { FlightCard, AddFlight } from '.'
import { uiAction } from '../../actions';

class Flights extends Component {

  actions = [
    {
      icon: <Icon path={mdiPlus} size={1} />,
      onClick: () => this.setState({ openFlight: true })
    }
  ]

  state = {
    loading: false,
    flights: null,
    openFlight: false
  }

  componentDidMount() {
    this.setState({ loading: true })
    const flightsRef = this.props.firebase.flights().orderBy("current","desc")
    // flightsRef.onSnapshot(snapshot => this.setState({ flights: snapshot.docs, loading: false }))
    flightsRef.onSnapshot(snapshot =>{
      let data = snapshot.docs;

      let newState = [];
      data.forEach(val => {
        let data = val.data();
        newState.push({...data, id: val.id});
      });

      this.loadFlights(newState);

      this.setState(state=>{
        return {flights: this.props.flights}
      })
    })
  }

  render() {
    const { flights, openFlight } = this.state
    return (
      <Main actions={this.actions}>
        {this.renderFlightCards(this.props.flights)}
        <AddFlight open={openFlight} onClose={() => this.setState({ openFlight: false })} />
      </Main>
    )
  }

  renderFlightCards(flights) {
    if (flights) {
      return flights.map((flight) => {
        return <FlightCard details={flight} postId={flight.id}/>
      })
    }
  }

  loadFlights(val){
    this.props.loadFlights(val)
  }

}

const condition = authUser => !!authUser;

const mapStateToProps = (state) => {
  return {
      flights: state.ui.filteredFlights,
      user: state.auth.user
    }
}

const mapDispatchToProps = (dispatch) => {
  return ({
    loadFlights(val) {
      dispatch(uiAction.loadFlights(val))
    },
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(
  compose(
    withRouter,
    withFirebase,
    withAuthorization(condition),
  )(Flights))