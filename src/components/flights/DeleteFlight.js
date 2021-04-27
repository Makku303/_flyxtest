import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withFirebase } from '../../firebase'
import { createMuiTheme, Dialog, Box, Button, CircularProgress } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles';
import { COLORS } from '../../constants'

const customPostTheme = createMuiTheme({
  palette: {
    delete:{
        main: COLORS.secondary
    },
  },
})

const styles = {
  container: {
    height: 75,
    width: 300,
    padding: 20,
  },
  collapsedContainer: {
    height: 470,
    width: 700,
    padding: 20,
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}

class DeleteFlight extends Component { 
    state = {
        loading: false
    }

  render() {
    const { open, postId } = this.props
    const { loading} = this.state

    return (
      <Dialog
        open={open}
        onClose={this.handleClose.bind(this)}
        maxWidth={false}
      >
        <Box
          style={styles.container}
        >
          <div>{"Delete flight post?"}</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', margin: '20px 0px' }}>
            <ThemeProvider theme={customPostTheme}>
              <Button
                variant={"contained"}
                style={{backgroundColor: "#f44336", color: "white"}}
                onClick={() => this.deleteFlight(postId)}
              >
                {'Delete'}
                {loading && <CircularProgress size={24} style={styles.buttonProgress} />}
              </Button>
            </ThemeProvider>
          </div>
        </Box>
      </Dialog>
    )
  }

  async deleteFlight(postId) {
    const flightsRef = this.props.firebase.flights()
    const flightRef = await flightsRef.doc(postId)

    await flightRef.delete()
    await this.props.firebase.removePost(this.props.userId, postId)
  }

  handleClose() {
    this.setState({ })
    this.props.onClose()
  }
}

const mapStateToProps = (state) => ({
  userId: state.auth.user.uid
})

export default connect(
  mapStateToProps
)(withFirebase(DeleteFlight))