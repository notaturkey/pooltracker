import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Spinner from 'react-bootstrap/Spinner'
export default function Navbar() {
  return (
    <>
    <Container className="p-2 m-2 border border-dark rounded"  >
        <Nav className="navbar navbar-expand-sm navbar-light bg-light rounded-pill">
            
            <ul className="nav nav-pills">
                <li className="nav-item">
                <a className='navbar-brand'><Spinner animation="grow" variant="dark" /></a>
                </li>
                <li className="nav-item">
                <Link  href="/"><a className="nav-link" height='200px'>CTC Tracker</a></Link>
                </li>
                <li className="nav-item">
                <Link  href="/pool"><a className="nav-link">Pool</a></Link>
                </li>
                <li className="nav-item">
                <Link  href="/stats"><a className="nav-link">Stats</a></Link>
                </li>
                
            </ul>
        </Nav>
    </Container>
    </>
  )
}

