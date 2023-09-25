import jwt_decode from 'jwt-decode'


const getUserInfo = () => {
    const accessToken = localStorage.getItem("accessToken")
    if(!accessToken) return undefined

    const { exp } = jwt_decode(accessToken)
    if(exp > (new Date().getTime() + 1) / 1000){
        return(jwt_decode(accessToken))
    }
}

export default getUserInfo