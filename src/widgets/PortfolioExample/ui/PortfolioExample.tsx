import { Container } from '@/shared/ui/Container'
import { Headline } from '@/shared/ui/Headline'
import React from 'react'
import "./PortfolioExample.scss"
import { Button } from '@/shared/ui/Button'

const PortfolioExample = () => {
    const data = [{id:1, name: "Толыкбаев Ильяс", role: "Frontend developer"},{id:2, name: "Толыкбаев Ильяс", role: "Frontend developer"}]
  return (
    <Container>
        <Headline text="Примеры портфолио"/>
        <div className='PortfolioBlock'>
            {data.map(dat => 
                <div key={dat.id} className='PortfolioBox'>
                    <div className='ProfileBlock'>
                        <img className='Profile_img' src="/assets/Images/MainPage/PortfolioExample/humanImg.png" alt="" />
                        <div className='profile_info'>
                            <h4 className='profile_name'>{dat.name}</h4>
                            <p className='profile_role'>@{dat.role}</p>
                        </div>
                    </div>
                    <div className='PortfolioImg'>
                        <img src="/assets/Images/MainPage/PortfolioExample/portfolioImg.png" alt="" />
                        <img src="/assets/Images/MainPage/PortfolioExample/portfolioImg.png" alt="" />
                    </div>
                    <Button text='Перейти'/>
                </div>
            )}
        </div>
    </Container>
  )
}

export default PortfolioExample