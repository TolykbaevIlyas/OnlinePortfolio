import React from 'react'

const FeedbackForm = () => {
  return (
    <form className=''>
      <label>
        Имя:
        <input type="text" name="name" />
      </label>
      <label>
        Номер телефона:
        <input type="email" name="email" />
      </label>
      <label>
        Почта:
        <textarea name="message"/>
      </label>
      <input type="submit" value="Submit" />
    </form>
  )
}

export default FeedbackForm