import React from 'react'

function Loading() {
  return (
        <div className=' loading d-flex align-items-center justify-content-center' >
        <img src={process.env.PUBLIC_URL + '/loading.gif'} alt="My Image" className='m-auto d-block ' wiidth="200" height="200"  />
        </div>
  )
}

export default Loading