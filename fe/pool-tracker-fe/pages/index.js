import Navbar from './navbar';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
export default function Home() {
  return (
    <>
    <Container>
    <Row><Navbar> </Navbar></Row>
    <Row className="p-2 m-2 border border-dark rounded " >
      <Container  className='p-2 bg-light'>
      <h1>Useful links</h1>
      <ul>
        <li><a href='https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmainnet.creditcoin.network#/explorer'>block explorer</a></li>
        <li><a href='https://telemetry.polkadot.io/#list/0xdd954cbf4000542ef1a15bca509cd89684330bee5e23766c527cdb0d7275e9c2'>telemetry</a></li>
      </ul>
      </Container>
    </Row>
    </Container>
    </>
  )
}