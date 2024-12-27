import React from 'react'
import { IBtn } from '../types/types'
import "./Button.scss"

const Button = ({text,type = "Bg",types = "button"}: IBtn) => {
  return (
    <button type={types} className={`Btn ${type == "Bg" ? "BgStyles" : "TransparentStyles"}`}>{text}</button>
  )
}

export default Button