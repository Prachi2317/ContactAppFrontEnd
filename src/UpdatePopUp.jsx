import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import React, { useEffect, useState } from "react";
import axios from "axios";
// import './UpdatePopup.css';
function UpdatePopUp({ show, handleClose, id, updatedData, prevData }) {
  console.log(prevData);
  const [form, setFormData] = useState({
    name: "",
    phone: "",
    imagePath: "",
  });
  const updateData = (e) => {
    const formData = new FormData();
    console.log(form,"form data");
    // console.log(name);
    formData.append("name", form.name);
    formData.append("phone", form.phone);
    // formData.append("image", form.imagePath);
    if (form.image) {
      formData.append("image", form.image);
    }
    console.log(formData);
    axios
      .put(`http://localhost:8000/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
         console.log(result);
       
        updatedData();
        // Update contacts state here if needed
        setFormData(null);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log(prevData);
    setFormData(prevData);
  },[prevData]);
  console.log(form);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Contact Update</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={updateData}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              pattern="[A-Za-z ]+"
             title="Please enter only letters and spaces." 
              value={form?.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="Add your phone"
              value={form?.phone}
              onChange={(e) =>{
               console.log(e.target,"even")
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              
              }
              required
            />
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              // value={form?.imagePath}
              placeholder={form?.imagePath}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, imagePath: e.target.files[0]}))
              }
              required
            />

          </Form.Group>
          <Button variant="primary" type="submit" onClick={updateData}>
            Save
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdatePopUp;
