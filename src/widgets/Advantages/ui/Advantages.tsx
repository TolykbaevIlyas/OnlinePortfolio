'use client';
import { Container } from '@/shared/ui/Container';
import { Headline } from '@/shared/ui/Headline';
import React from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Advantages.scss';
import { SliderSwiper } from '@/shared/ui/SliderSwiper';

const Advantages = () => {
 
  const img = [
    { src: "/assets/Images/Profile/profileImg.png", alt: "Первое изображение Тольятти" },
    { src: "/assets/Images/Profile/Mars.jpg", alt: "Первое изображение Тольятти" },
    { src: "/assets/Images/Profile/Baisa.jpg", alt: "Первое изображение Тольятти" },
    { src: "/assets/Images/Profile/Said.jpg", alt: "Первое изображение Тольятти" },
    { src: "/assets/Images/Profile/Zhanik.jpg", alt: "Первое изображение Тольятти" }
  ]
  

  return (
    <>
    <Container className="AdvantagesWrapper">
      <Headline text="Наша Команда" />
    </Container>
    <SliderSwiper images={img}/>
    </>
    
  );
};

export default Advantages;
