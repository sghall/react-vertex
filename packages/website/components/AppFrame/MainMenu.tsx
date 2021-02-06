import React, { Component } from 'react'
import Link from 'next/link'
import { withStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { docsList, demosList } from '../../config'

function DocsList({ onClick }: { onClick: () => void }) {
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

function DemosList({ onClick }: { onClick: () => void }) {
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

const styles = (theme: Theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(),
    backgroundColor: theme.palette.background.paper,
  },
})

const NOOP = () => {}

interface MainMenuProps {
  classes?: { [key: string]: string }
  onClick?: () => void
}

class MainMenu extends Component<MainMenuProps> {
  state = {
    value: 1,
  }

  handleChange = (_: Event, value: number) => {
    this.setState({ value })
  }

  render() {
    const { classes, onClick = NOOP } = this.props
    const { value } = this.state

    return (
      <div className={classes?.root}>
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

export default withStyles(styles)(MainMenu)
