import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { docsList, demosList } from '../config'

function DocsList({ onClick }) {
  return (
    <List onClick={onClick}>
      {docsList.map(d => (
        <Link key={d.href} href={d.href}>
          <ListItem button>
            <ListItemText primary={d.name} secondary={d.tag} />
          </ListItem>
        </Link>
      ))}
    </List>
  )
}

DocsList.propTypes = {
  onClick: PropTypes.func.isRequired,
}

function DemosList({ onClick }) {
  return (
    <List onClick={onClick}>
      {demosList.map(d => (
        <Link key={d.href} href={d.href}>
          <ListItem style={{ paddingLeft: 10, paddingRight: 10 }} button>
            <ListItemText primary={d.name} secondary={d.tag} />
          </ListItem>
        </Link>
      ))}
    </List>
  )
}

DemosList.propTypes = {
  onClick: PropTypes.func.isRequired,
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit,
    backgroundColor: theme.palette.background.paper,
  },
})

class MainMenu extends Component {
  state = {
    value: 1,
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    const { classes, onClick } = this.props
    const { value } = this.state

    return (
      <div className={classes.root}>
        <Button
          style={{ width: '50%' }}
          size="small"
          variant="outlined"
          onClick={() => this.setState({ value: 0 })}
        >
          Docs
        </Button>
        <Button
          style={{ width: '50%' }}
          size="small"
          variant="outlined"
          onClick={() => this.setState({ value: 1 })}
        >
          Demos
        </Button>
        <Divider />
        <Typography variant="h6">{value === 0 ? 'Docs' : 'Demos'}</Typography>
        {value === 0 && <DocsList onClick={onClick} />}
        {value === 1 && <DemosList onClick={onClick} />}
      </div>
    )
  }
}

MainMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
}

MainMenu.defaultProps = {
  onClick: () => {},
}

export default withStyles(styles)(MainMenu)
