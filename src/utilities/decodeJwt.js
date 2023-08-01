import jwt_decode from 'jwt-decode'

const getUserInfo = () => {
    const accessToken = localStorage.getItem("accessToken")
    if(!accessToken) return undefined
    return jwt_decode(accessToken)
}

export default getUserInfo