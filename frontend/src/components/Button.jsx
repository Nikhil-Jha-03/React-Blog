import React from 'react'

const Button = ({ type,text, isLogin, onclick, classNametext }) => {
  return (
    <button
      type={type}
      onClick={onclick}
      className={`${classNametext} px-8 font-bold py-2.5 w-full m-1 rounded-2xl cursor-pointer hover:scale-100 transition hover:shadow-2xl ease-in ${isLogin && isLogin ? "bg-black text-white" : ' text-black bg-zinc-200'} `}>{text}</button>
  )
}

export default React.memo(Button)