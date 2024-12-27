import React from 'react'
import "./Profile.scss"
import { Button } from '@/shared/ui/Button'

const ProfileInfo = () => {
  return (
    <div className='ProfileBlock'>
      <div className='ProfileInfo'>
          <img src="/assets/Images/Profile/profileImg.png" alt="" />
          <div className='Profile_info_block'>
            <div>
              <h2 className='profile_name'>Толыкбаев Ильяс</h2>
              <h4 className='profile_role'>@Frontend developer</h4>
            </div>
            <p className='about_me'>Обо мне</p>
            <p className='profile_desc'>Открыл свою онлайн школу, захватил пол галактики используя инновационные средства по типу лазерных пушек, космических объектов в виде солнца и планет. Успешно установил связь со вселенским разумом и создал своих клонов для вечного правления на планете “Земля”. Изобрел элексир молодости.</p>
          </div>
          <div>
            <Button text='Редактировать'/>
          </div>
      </div>
      <div className='ProfilePortfolio'>
        <div className='Profile_info'>
          <h4 className='Profile_info_main'>Информация</h4>
          <ul className='Profile_info_list'>
            <li>Локация: Алматы</li>
            <li>Возраст: 20</li>
            <li>Стаж: 3 года</li>
          </ul>
        </div>
        <div className='Portfolio'>
          <h4 className='Profile_info_main'>Портфолио</h4>
          <div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileInfo