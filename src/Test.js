import React, {useState, useEffect, useContext} from 'react';
import getUserInfo from './utilities/decodeJwt';
import Alert from 'react-bootstrap/Alert';
import Stack from 'react-bootstrap/Stack';
import { UserContext } from './App';


//  test change

const Test = () => {
    // const [user, setUser] = useState(null)
    const value = useContext(UserContext)

    // useEffect(() => {
      
    // const obj = getUserInfo()
    // setUser(obj)
     
    // }, [])
    console.log(value)
  return (
    <Stack direction="verticle" gap={2}>
      <div className="mx-2">
        <h4>Authenticated User</h4>
      </div>
      <Alert variant='primary' className="mx-2">
        {JSON.stringify(value, null, 2)}
      </Alert>
    </Stack>
  )
}

export default Test