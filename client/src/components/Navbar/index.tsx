import * as React from 'react'
import {Link} from 'react-router-dom'

const Navbar = (props: {address: string; firstName: string}) => (
  <header className="navbar">
    <section className="navbar-section">
      <Link to="/" className="btn btn-link">
        Write
      </Link>
      <Link to="/archive" className="btn btn-link">
        Archive
      </Link>
      <Link to="/settings" className="btn btn-link">
        Settings
      </Link>
    </section>

    <section className="navbar-center">Countdown TODO</section>

    <section className="navbar-section">
      <div className="popover popover-bottom">
        <div className="tile tile-centered">
          <div className="tile-icon">
            <div className="example-tile-icon">
              <i className="icon icon-people icon-2x centered" />
            </div>
          </div>
          <div className="tile-content">
            <div className="tile-title">Hello, {props.firstName}!</div>
            <div className="tile-subtitle text-gray subtext-code">
              {props.address.substr(0, 6)}
              ..
              {props.address.substr(props.address.length - 4, 4)}
            </div>
          </div>
        </div>

        <div className="popover-container account-info">
          <div className="card">
            <div className="card-body">
              Signed in as: <code>{props.address}</code>
            </div>
          </div>
        </div>
      </div>
    </section>
  </header>
)

export default Navbar
