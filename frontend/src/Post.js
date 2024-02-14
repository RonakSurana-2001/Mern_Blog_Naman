import React from 'react'

const Post = () => {
    return (
        <div className="post">
            <div className="image">
                <img src="https://akm-img-a-in.tosshub.com/indiatoday/images/bodyeditor/201912/jaipur_cold_fog_winter-1200x3204.jpg?KCV5eMHJB2.BH1thlRmOBIyUU_fJq5JC" alt="Cold wave in Jaipur" />
            </div>
            <div className="texts">
                <h2>Cold wave continues to tighten grip on Jaipur</h2>
                <p className="info">
                    <a className="author">Naman Surana</a>
                    <time className="">2023-01-06 16:45</time>
                </p>
                <p className="summary">Jaipur: Jaipur reeled under cloudy and foggy conditions for the fifth consecutive day on Friday. Fog was witnessed from late Thursday night which continued till Friday afternoon. Dense fog continued to play a spoilsport for road traffic in and around the city. Also, flight delays created panic among air travellers at Jaipur airport.</p>
            </div>
        </div>
    )
}

export default Post