import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL + "api/";

export default function Wishlists() {
  // const [wishlists, setWishlists] = useState([]);
  const [userWishlists, setUserWishlists] = useState([]);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [id, setId] = useState(0);
  const [showInputs, setShowInputs] = useState(false);
  const [editNameInput, setEditNameInput] = useState("");
  const [editPasswordInput, setEditPasswordInput] = useState("");
  const [editDateInput, setEditDateInput] = useState("");

  const fetchUserWishlists = () => {
    const URL = `${BASE_URL}wishlist/owned`;
    fetch(URL, {
      method: "GET",
      headers: {
         Accept: "application/json",
         Authorization: `Bearer ${sessionStorage.getItem("bearer-token")}`,
         "Content-Type": "application/json",
      },

    }) // this should be changed to 'wishlists' (plural)
      .then((response) => response.json())
      .then((data) => {
        if (userWishlists === undefined) {
          setUserWishlists([]);
        } else {
          setUserWishlists(data);
        }
      })
      .catch((err) => {
        console.log(`An error has occurred: ${err}`);
      });
  };

  useEffect(() => {
    // re-fetch User's Wishlists
    fetchUserWishlists();
  }, []); // empty [] dependancy list to stop infinite loop

  //Create Wishlist (POST API)
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const createWishlist = () => {
    fetch(BASE_URL + "wishlist/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("bearer-token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: name,
        Password: password,
        DueDate: dueDate,
      }),
    })
      // Response received.
      .then((response) => {
        console.log(response);
      })
      // Data retrieved.
      .then((json) => {
        console.log(JSON.stringify(json));
        setName("");
        setPassword("");
        setDueDate(""); // Clear input.
        fetchUserWishlists();
      })
      // Data not retrieved.
      .catch(function (error) {
        console.log(error);
      });
  };

  //Update Wishlist (PUT)
  const updateWishlist = (id, name, password, dueDate) => {
    fetch(BASE_URL + "wishlist", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("bearer-token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Id: id,
        Name: name,
        Password: password,
        DueDate: dueDate,
      }),
    })
      .then((res) => res.json())
      // Data retrieved.
      .then((data) => {
        console.log(JSON.stringify(data));
        fetchUserWishlists();
      })
      // Data not retrieved.
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSubmit = () => {
    updateWishlist(id, editNameInput, editPasswordInput, editDateInput);

    console.log("Wishlist Updated");
  };

  const handleNameChangeEdit = (e) => {
    setEditNameInput(e.target.value);
  };

  const handlePasswordChangeEdit = (e) => {
    setEditPasswordInput(e.target.value);
  };

  const handleDueDateChangeEdit = (e) => {
    setEditDateInput(e.target.value);
  };

  const showEditInputs = (id, name, password, duedate) => {
    //Hide/show inputs
    showInputs ? setShowInputs(false) : setShowInputs(true);

    setId(id);
    console.log(id);

    //Set name input
    setEditNameInput(name);

    //Set password input
    if (password !== null) {
      setEditPasswordInput(password);
    } else {
      setEditPasswordInput("");
    }

    //Set date input
    if (duedate !== null) {
      setEditDateInput(duedate.split("T")[0].slice(0, 10));
    } else {
      setEditDateInput(new Date().toISOString().split("T")[0].slice(0, 10));
    }
  };

  // Delete Wishlist (DELETE)
  const deleteWishlist = (id) => {
    fetch(BASE_URL + "wishlist/" + id + "/", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("bearer-token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      // Data retrieved.
      .then((data) => {
        console.log(JSON.stringify(data));
        fetchUserWishlists();
      })
      // Data not retrieved.
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      <h1>
        {"Hello, you're logged-in as "}{" "}
        <span>{sessionStorage.getItem("loggedIn-email")}</span>
      </h1>
      <p className="display-4 my-3">Wishlists</p>

      {/* CREATE WISHLIST INPUTS */}
      <div id="createInputs">
        <input
          placeholder="Wishlist Name"
          type="text"
          value={name}
          onChange={handleNameChange}
        />
        <input
          placeholder="Wishlist Password"
          type="text"
          value={password}
          onChange={handlePasswordChange}
        />
        <input type="date" value={dueDate} onChange={handleDueDateChange} />
        <button className="button" onClick={createWishlist}>
          Create Wishlist
        </button>
      </div>

      {/* EDIT WISHLIST INPUTS */}
      <div id="editInputs" style={{ display: showInputs ? "block" : "none" }}>
        <p className="display-4 text-info">EDIT WISHLIST</p>
        <input
          id="editInputName"
          placeholder="Wishlist Name"
          type="text"
          onChange={handleNameChangeEdit}
          value={editNameInput}
        />
        <input
          id="editInputPassword"
          placeholder="Wishlist Password"
          type="text"
          onChange={handlePasswordChangeEdit}
          value={editPasswordInput}
        />
        <input
          id="editInputDate"
          type="date"
          value={editDateInput}
          onChange={handleDueDateChangeEdit}
        />
        <button className="button" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {/* WishLists */}
      {userWishlists.length == 0 ? (
        <p className="my-5">
          You do not have any wishslists. Create One Above!
        </p>
      ) : (
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>Owner</th>
              <th>Name</th>
              <th>Password</th>
              <th>DueDate</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {userWishlists.map((wishlist, index) => (
              <tr key={index}>
                <td>{wishlist.ownerId}</td>
                <td>
                  <NavLink
                    to={`/wishlist/${wishlist.id}/?password=${wishlist.password}`}
                    className="nav-link__wishlist"
                  >
                    {wishlist.name}
                  </NavLink>
                </td>
                <td>{wishlist.password}</td>
                <td>{wishlist.dueDate}</td>
                <td>
                  <button
                    className="button is-info is-light"
                    onClick={() =>
                      showEditInputs(
                        wishlist.id,
                        wishlist.name,
                        wishlist.password,
                        wishlist.dueDate
                      )
                    }
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="button is-danger is-light"
                    onClick={() => deleteWishlist(wishlist.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// const fetchWishlists = () => {
//   console.log("fetchWishlists called")
//   fetch(BASE_URL + "wishlist", {
//     method: "GET",
//     header: {
//       Authorization: `Bearer ${sessionStorage.getItem("bearer-token")}`,
//     },
//   }) // this should be changed to 'wishlists' (plural)
//     .then((response) => response.json())
//     .then((data) => {
//       if (wishlists == undefined) {
//         setWishlists([]);
//       } else {
//         setWishlists(data);
//       }
//     })
//     .catch((err) => {
//       console.log(`An error has occurred: ${err}`);
//     });
// };

