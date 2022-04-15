import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then((res) => res.json())


export default function Profile() {
  const { data, error } = useSWR('http://localhost:50406/pool', fetcher)

  
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  console.log(data) 
  return (
    <div>
      <h1>Total Hashes </h1>
      <p> {data.total_hashes} </p>
      <p>tom: {data.tom.num_hashes} </p>
      <p>cmonoxide: {data.cmonoxide.num_hashes} </p>
      <p>bystander: {data.bystander.num_hashes} </p>
    </div>
  )
}

// export default function Home() {
//   return (
//    <div>Welcome to Next.js!</div>
//   )
// }
