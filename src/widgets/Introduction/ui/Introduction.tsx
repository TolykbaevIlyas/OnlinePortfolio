import React from 'react'
import "./Intro.scss"
import { Container } from '@/shared/ui/Container'
import { Button } from '@/shared/ui/Button'

const Introduction = () => {
  return (
    <div className='IntroBlock'>
        <Container className='Intro__container'>
            <div className='Intro__wrapper'>
                <h1 className='headline'>
                    Сайт онлайн портфолио
                </h1>
                <p className='Intoduction_desc'>
                    Хотите создать портфолио и найти себе новую работу или показать работодателям что из себя стоите. Тогда вам нужен этот сайт, который поможет в этом 
                </p>
                <div className='Introduction_btns'>
                    <Button type="Bg" text='Создать портфолио'/>
                    <Button type="Transparent" text="Найти портфолио"/>
                </div>
            </div>
            <div className='Intro_humanImg'>
                <img src="/assets/Images/MainPage/Introduction/sitting-2.png
                " alt="Human" />
            </div>
        </Container>
    </div>
  )
}

export default Introduction