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
      if (i == 'total_hashes'){
        //
      } else {
        labels.push(i)
        graphData.push(data[i]['percentage'])
        items.push(<tr><td>{i}</td><td>{data[i]['num_hashes']}</td></tr>);
      }
    }
    //items.push(</tbody>
    //        </table>)
    const graph = {
      labels: labels,
      datasets: [{
        label: '% of total hashrate',
        data: graphData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
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
            <h1>Pool</h1>      
            <table className="table table-dark">
              <thead><tr><th>Username</th><th># of hashes</th></tr></thead>
              <tbody>
              {items}
              </tbody>
              <tfoot><tr><td>Total # of hashes</td><td>{data['total_hashes']}</td></tr></tfoot>
            </table>
            </div>
        </Container>
        </Row>
        <Row className="p-2 m-2 border border-dark rounded">
        <Container >
          <div>
            <h2>Percentage contributed to Total Hashes</h2>
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