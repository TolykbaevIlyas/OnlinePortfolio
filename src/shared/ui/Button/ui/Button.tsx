import React from 'react'
import { IBtn } from '../types/types'
import "./Button.scss"

const Button = ({text,type = "Bg"}: IBtn) => {
  return (
    <button className={`Btn ${type == "Bg" ? "BgStyles" : "TransparentStyles"}`}>{text}</button>
  )
}

export default Button