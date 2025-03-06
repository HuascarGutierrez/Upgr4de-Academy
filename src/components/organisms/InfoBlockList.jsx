import React from 'react'
import InfoBlock from '../molecules/InfoBlock'

function InfoBlockList({nosotros}) {
  return (
    <div>
        {nosotros.map((item,index) => (
            <InfoBlock key={index} info = {item}/>
        ))}
    </div>
  )
}

export default InfoBlockList