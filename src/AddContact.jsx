import React, { useEffect, useState,useRef } from "react";
import axios from "axios";
import UpdatePopUp from "./UpdatePopUp";
function AddContact() {
  const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contacts, setContacts] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');
  const [image, setImage] = useState(null);
 const [prevData, setPrevData] = useState(null) 

  const handleAdd = (e) => {
    e.preventDefault();
    // Clear the file input value
    fileInputRef.current.value = '';
   // Create a new FormData instance and append data
    const formData = new FormData();
    // console.log(image);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('image', image);
    
    
    axios.post("http://localhost:8000/create-contact", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((result) => {
          
      // Update contacts state here if needed
      updatedData();
      setName("");
      setPhone("");
      setImage(null);
    })
    .catch((err) => {
      console.log(err);
    });
  };

  // get data from database
  useEffect(() => {
    updatedData();
  }, []);

  // function for getting the updated data
  const updatedData = () => {
    axios.get("http://localhost:8000/get")
      .then((result) => {
        setContacts(result.data);
        // console.log(result.data);
      })
      .catch((err) => {
        console.log("error in getting latest data", err);
      });
  };

  // delete contact handle
  const deleteContact = (id) => {
    axios.delete(`http://localhost:8000/delete/${id}`)
      .then((result) => {
        updatedData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="contactForm">
        <form onSubmit={handleAdd}>
          <input
            type="text"
             pattern="[A-Za-z ]+"
             title="Please enter only letters and spaces." 
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Enter Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input 
            type="file"
            placeholder="Upload pic"
            ref={fileInputRef}
             className="file-input"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
          <button type="submit">Add</button>
        </form>
      </div>
      <div className="contactData">
        {contacts.length === 0 ? (
          <h1>No Record</h1>
        ) : (
          contacts.map((contact, index) => (
            <div className="contactList" key={index}>
              <span>Name: {contact.name}</span>
              <span>Phone: {contact.phone}</span>
              <span>
                <button
                  onClick={() => {
                    deleteContact(contact._id);
                  }}
                >
                  Delete
                </button>
              </span>
              <span>
                <button
                  onClick={() => {
                    setOpen(true);
                    setId(contact._id);
                    setPrevData(contact)
                  }}
                >
                  Update
                </button>
              </span>
              <div className="image">
                {console.log(contact,"contact")}
                 <img src={`http://localhost:8000/public/${contact.imagePath}`} alt={contact.name} />
              </div>
            </div>
          ))
        )}
      </div>
      <UpdatePopUp show={open} handleClose={() => setOpen(false)} id={id} prevData={prevData} updatedData={updatedData} />
    </>
  );
}

export default AddContact;
