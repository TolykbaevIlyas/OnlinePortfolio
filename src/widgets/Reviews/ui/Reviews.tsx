import { Container } from '@/shared/ui/Container'
import { Headline } from '@/shared/ui/Headline'
import React from 'react'
import "./Rewiews.scss"

const Reviews = () => {
    const data = [
        {
            id:1, 
            name: "Толыкбаев Ильяс", 
            desc: "Данный сайт помог мне в поиске работы и дал возможность сравнить свои навыки на рынке. Я смог занять более правильную позицию на рынке и полностью удовлетворил потребности работодателя"
        }, 
        {
            id:2,
            name: "Толыкбаев Ильяс", 
            desc: "Данный сайт помог мне в поиске работы и дал возможность сравнить свои навыки на рынке. Я смог занять более правильную позицию на рынке и полностью удовлетворил потребности работодателя"
        }
    ]
  return (
    <Container>
        <Headline text="Отзывы"/>
        <div className='ReviewsBlock'>
            {data.map(dat => 
                <div key={dat.id} className='rewiews_box'>
                    <img src="/assets/Images/MainPage/Rewiews/human.png" alt="" />
                    <div className='rewiew_text_box'>
                        <h3 className='rewiew_name'>{dat.name}</h3>
                        <p className='rewiew_desc'>{dat.desc}</p>
                        <img src="/assets/Images/MainPage/Rewiews/Starts.png" alt="" className='rewiew_start'/>
                    </div>
                    
                </div>
            )}
        </div>
    </Container>
  )
}

export default Reviews