import { Container } from '@/shared/ui/Container'
import { Headline } from '@/shared/ui/Headline'
import React from 'react'
import "./Advantages.scss"

const Advantages = () => {
    const data=[{id:1},{id:2},{id:3},{id:4},{id:5},{id:6}]
  return (
    <Container className='AdvantagesWrapper'>
        <Headline text='Наши преимущества'/>
        <div className='Advantages__Blocks'>
            {data.map(dat => (
                <div key={dat.id} className='Advatages_box'></div>
            ))}
        </div>
    </Container>
  )
}

export default Advantages