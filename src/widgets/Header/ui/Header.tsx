'use client'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import React from 'react'
import "./Header.scss"

const Header = () => {
  return (
    <header>
        <Container className="header">
            <a href="/" className='Logo'>OnlinePort</a>
            <nav className='navBar'>
              <li>Поиск</li>
              <li></li>
              <li></li>
              <li></li>
              <a href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Button text="Войти"/>
              </a>
            </nav>
            
        </Container>
    </header>
  )
}

export default Header