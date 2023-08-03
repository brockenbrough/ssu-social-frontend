import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';

// const deleteContributor = async (contributor) => {
//   axios.delete(`${process.env.REACT_APP_BACKEND_SERVER_URI}/project_notes/contributor/${contributor._id}`)
//       .then(response => {
//           alert('Contributor deleted.')
//       })
//       .catch(error => alert('Error deleting contributor'))
// }

const Contributor = ({name, position, _id, deleteFunction}) => {
 
    return(
      <Card body outline  color="success" className="mx-1 my-2" style={{ width: '30rem' }}>
        <Card.Body> 
            <Stack> 
              <div><h4>{name}</h4></div>
              <div>{position}</div>
              <div>
                <Button variant="primary" className="mx-1 my-1" href={`/project-notes/editContributor/${_id}`} >Edit</Button>
              </div>
              <div>
                <Button variant="primary" className="mx-1 my-1" onClick={() => deleteFunction(_id)}>Delete</Button>
              </div>
            </Stack>
        </Card.Body>
      </Card>
    )
};

export default Contributor;