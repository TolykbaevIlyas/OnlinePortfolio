'use client'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import React from 'react'
import "./Header.scss"

const Header = () => {
  return (
    <header>
        <Container className="header">
            <h1 className='Logo'>OnlinePort</h1>
            <Button text="Войти"/>
        </Container>
    </header>
  )
}

export default Header