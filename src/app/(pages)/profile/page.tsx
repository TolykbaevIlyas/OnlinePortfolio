'use client'
import { Container } from '@/shared/ui/Container'
import ProfileInfo from '@/widgets/ProfileInfo/ui/ProfileInfo'
import React from 'react'

const page = () => {
  return (
    <div className='Profile'>
        <Container>
            <ProfileInfo/>
        </Container>
    </div>
  )
}

export default page