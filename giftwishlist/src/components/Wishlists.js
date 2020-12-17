import React, { useState, useEffect } from 'react';
import WishlistCard from './WishlistCard';
import { NavLink } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL + 'api/';

export const WishlistActiveContext = React.createContext();

export default function Wishlists() {
	// const [wishlists, setWishlists] = useState([]);
	const [userWishlists, setUserWishlists] = useState([]);
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [dueDate, setDueDate] = useState('');
	// const [id, setId] = useState(0);
	// const [showInputs, setShowInputs] = useState(false);
	// const [editNameInput, setEditNameInput] = useState('');
	// const [editPasswordInput, setEditPasswordInput] = useState('');
	// const [editDateInput, setEditDateInput] = useState('');
	const [wishlistActive, setWishlistActive] = useState(true);

	const fetchUserWishlists = () => {
		const URL = `${BASE_URL}wishlist/owned`;
		fetch(URL, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${sessionStorage.getItem('bearer-token')}`,
				'Content-Type': 'application/json',
			},
		}) // this should be changed to 'wishlists' (plural)
			.then((response) => response.json())
			.then((data) => {
				if (data === undefined || data.status === 404) {
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
		fetch(BASE_URL + 'wishlist/', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${sessionStorage.getItem('bearer-token')}`,
				'Content-Type': 'application/json',
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
				setName('');
				setPassword('');
				setDueDate(''); // Clear input.
				fetchUserWishlists();
			})
			// Data not retrieved.
			.catch(function (error) {
				console.log(error);
			});
	};

	//Update Wishlist (PUT)
	const updateWishlist = (id, name, password, dueDate) => {
		fetch(BASE_URL + 'wishlist', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${sessionStorage.getItem('bearer-token')}`,
				'Content-Type': 'application/json',
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

	// const handleSubmit = () => {
	// 	updateWishlist(id, editNameInput, editPasswordInput, editDateInput);

	// 	console.log('Wishlist Updated');
	// };

	// Delete Wishlist (DELETE)
	// const deleteWishlist = (id) => {
	// 	fetch(BASE_URL + 'wishlist/' + id + '/', {
	// 		method: 'DELETE',
	// 		headers: {
	// 			Accept: 'application/json',
	// 			Authorization: `Bearer ${sessionStorage.getItem('bearer-token')}`,
	// 			'Content-Type': 'application/json',
	// 		},
	// 	})
	// 		.then((res) => res.json())
	// 		// Data retrieved.
	// 		.then((data) => {
	// 			console.log(JSON.stringify(data));
	// 			fetchUserWishlists();
	// 		})
	// 		// Data not retrieved.
	// 		.catch((e) => {
	// 			console.log(e);
	// 		});
	// };

	return (
		<div className="dashboard">
			<h1 className="dashboard__greeting">
				{"Hello, you're logged-in as "}
				<span className="dashboard__greeting__userEmail">
					{sessionStorage.getItem('loggedIn-email')}
				</span>
			</h1>

			{/* CREATE WISHLIST INPUTS */}
			<div
				id="createInputs"
				className="dashboard__create animate__animated animate__fadeInDown"
			>
				<input
					placeholder="Wishlist Name"
					type="text"
					value={name}
					onChange={handleNameChange}
					className="dashboard__create__input mx-1"
				/>
				<input
					placeholder="Password (Optional)"
					type="text"
					value={password}
					onChange={handlePasswordChange}
					className="dashboard__create__input mx-1"
				/>
				<input
					type="date"
					value={dueDate}
					onChange={handleDueDateChange}
					className="dashboard__create__input mx-1"
				/>
				<button className="dashboard__create__button" onClick={createWishlist}>
					Create Wishlist
				</button>
			</div>

			{/* WishLists */}

			<p className="dashboard__heading display-4 animate__animated animate__fadeInDown">
				Your Wishlists
			</p>
			{userWishlists.length === 0 ? (
				<p className="dashboard__noWishlists">
					Why no wishlists? Create One Above!
				</p>
			) : (
				// <div className="dashboard__wishlists container">
				<WishlistActiveContext.Provider value={wishlistActive}>
					<div className="dashboard__wishlists row">
						{userWishlists.map((wishlist, index) => {
							return (
								<div
									key={index}
									className="dashboard__wishlists__container col-sm-12 col-md-6 col-lg-4"
								>
									<div
										className={
											wishlistActive
												? 'dashboard__wishlists__container__cardOuter animate__animated animate__zoomIn'
												: 'animate__animated animate__bounceOut'
										}
									>
										<WishlistCard
											className="wishlistCardComponent"
											refresh={fetchUserWishlists}
											index={index}
											wishlist={wishlist}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</WishlistActiveContext.Provider>
				// </div>
			)}
		</div>
	);
}
