import jwt_decode from 'jwt-decode'

// should be updated to check if the access token is valid or not. If not valid, should log the user out. Too late in the semester for me to do it and test. 
// Might also be a better idea to implement a way for the whole app to tell if the token is valid or not, and if not valid, log the user out. -T
const getUserInfo = () => {
    const accessToken = localStorage.getItem("accessToken")
    if(!accessToken) return undefined

    const { exp } = jwt_decode(accessToken)
    if(exp > (new Date().getTime() + 1) / 1000){
        return(jwt_decode(accessToken))
    }
}

export default getUserInfo