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
            <nav className='navBar'>
              <li>Поиск</li>
              <li></li>
              <li></li>
              <li></li>
              <Button text="Войти"/>
            </nav>
            
        </Container>
    </header>
  )
}

export default Header