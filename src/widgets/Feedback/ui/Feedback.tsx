import { Container } from '@/shared/ui/Container'
import { Headline } from '@/shared/ui/Headline'
import React from 'react'
import "./Feedback.scss"
import { FeedbackForm } from '@/features/FeedbackForm'

const Feedback = () => {
  return (
    <Container>
        <Headline text="Обратная связь"/>
        <div className='Feedback_block'>
            <img src="/assets/Images/MainPage/Feedback/human.png" alt="human" />
            <FeedbackForm/>
        </div>
    </Container>
  )
}

export default Feedback