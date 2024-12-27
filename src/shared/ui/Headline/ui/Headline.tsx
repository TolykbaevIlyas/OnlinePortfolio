import React from 'react'
import { IHeadline } from '../types/types'
import "./Headline.scss"

const Headline = ({text,className = "none"}:IHeadline) => {
  return (
    <div className={`headlineText ${className}`}>{text}</div>
  )
}

export default Headline