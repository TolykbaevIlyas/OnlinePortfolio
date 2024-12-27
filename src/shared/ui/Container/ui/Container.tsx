'use client'
import React from 'react'
import { IContainer } from '../types/types'
import "./Container.scss"

const Container = ({children, className}: IContainer) => {
  return (
    <div className={`container ${className}`}>{children}</div>
  )
}

export default Container