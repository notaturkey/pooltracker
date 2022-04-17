import Navbar from './navbar'
import useSWR from 'swr'
import Container from 'react-bootstrap/container'
import Spinner from 'react-bootstrap/Spinner'
import Row from 'react-bootstrap/Row'
import {Bar, Line} from 'react-chartjs-2';
import Chart from 'chart.js/auto'
import config from './config'
const fetcher = (...args) => fetch(...args).then((res) => res.json())



export default function Profile() {
    const { data, error } = useSWR(config.backendUrl, fetcher)
    if (error) return <div>Failed to load</div>
    if (!data) return <Spinner animation="border" role="status"></Spinner>
    
    const items = []
    const labels = []
    const graphData = []
    for (var i in data){
        for (var j in data[i]['nodes']){
            var node = data[i]['nodes'][j]
            graphData.push(node.node_total)
            labels.push(node.name)
            items.push(<tr><td>{node.name}</td><td>{node.node_total}</td></tr>);
        }
    }
    
    const graph = {
      labels: labels,
      datasets: [{
        label: '# of hashes',
        data: graphData,
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)'
          ],
        borderWidth: 1
      }]
      
    }
    return (
      <>
        <Container>
        <Row><Navbar> </Navbar></Row>    
        <Row className="p-2 m-2 border border-dark rounded">
        <Container className="p-2 m-2 border border-dark rounded"> 
            <div className='p-2 bg-light'>
            <h1>Nodes</h1>      
            <table className="table table-dark">
              <thead><tr><th>Node</th><th>Node # of Hashes</th></tr></thead>
              <tbody>
              {items}
              </tbody>
            </table>
            </div>
        </Container>
        </Row>
        <Row className="p-2 m-2 border border-dark rounded">
        <Container >
          <div>
            <h2># of hashes per node</h2>
            <Bar
              data={graph}
              width={400}
              height={200}
              options={{
                maintainAspectRatio: true
              }}
            />
          </div>
        </Container>
        </Row>
        </Container>
      </>
    )
  }