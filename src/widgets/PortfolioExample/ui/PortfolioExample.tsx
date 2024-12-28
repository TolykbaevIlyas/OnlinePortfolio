import { Container } from '@/shared/ui/Container'
import { Headline } from '@/shared/ui/Headline'
import React from 'react'
import "./PortfolioExample.scss"
import { Button } from '@/shared/ui/Button'

const PortfolioExample = () => {
    const data = [{id:1, name: "Толыкбаев Ильяс", role: "Frontend developer", img:"/assets/Images/MainPage/PortfolioExample/humanImg.png", github: "https://github.com/TolykbaevIlyas"},{id:2, name: "Юнусов Байсангур", role: "Senior developer", img:"/assets/Images/Profile/Baisa.jpg", github: "https://github.com/Megabyte135"}]
  return (
    <Container>
        <Headline text="Примеры портфолио"/>
        <div className='PortfolioBlock'>
            {data.map(dat => 
                <div key={dat.id} className='PortfolioBox'>
                    <div className='ProfileBlock'>
                        <img className='Profile_img' src={dat.img} alt="" />
                        <div className='profile_info'>
                            <h4 className='profile_name'>{dat.name}</h4>
                            <p className='profile_role'>@{dat.role}</p>
                        </div>
                    </div>
                    <div className='PortfolioImg'>
                        <img src="/assets/Images/MainPage/PortfolioExample/portfolioImg.png" alt="" />
                        <img src="/assets/Images/MainPage/PortfolioExample/portfolioImg.png" alt="" />
                    </div>
                    <a href={dat.github}>
                        <Button text='Перейти'/>
                    </a>
                    
                </div>
            )}
        </div>
    </Container>
  )
}

export default PortfolioExample