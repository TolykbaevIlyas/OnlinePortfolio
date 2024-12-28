'use client'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import React from 'react'
import "./Header.scss"

const Header = () => {

  const userId = localStorage.getItem('userId');
  console.log(userId);

  return (
    <header>
        <Container className="header">
            <a href="/" className='Logo'>OnlinePort</a>
            <nav className='navBar'>
              <a href="/search">Поиск</a>
              <li></li>
              <li></li>
              {userId ? <a href={`/profile?id=${userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                Личный кабинет 
              </a> : <></>}
              {userId ?  <></> : <a href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Button text="Войти"/>
              </a> }
             
            </nav>
            
        </Container>
    </header>
  )
}

export default Header