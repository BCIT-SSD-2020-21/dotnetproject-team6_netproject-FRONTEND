import React, { useState, useEffect, useContext } from 'react';
import Item from './item/Item';
import wishlistService from '../../services/wishlists.js';
import { NavLink } from 'react-router-dom';
import { UserAuthContext } from '../UserAuthContext';
import { AiOutlineArrowLeft } from 'react-icons/ai';

export default function Wishlist({ match }) {
	const [wishlist, setWishlist] = useState([]);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [image, setImage] = useState('');
	const [purchaseLink, setPurchaseLink] = useState('');
	const [price, setPrice] = useState('');
	const [showShareNotification, setShowShareNotification] = useState(false);

	// Taken from the url
	const wishlistId = match.params.id;
	const password = new URLSearchParams(window.location.search).get('password');
	const BASE_URL = process.env.REACT_APP_BASE_URL + 'api/';

	const { userAuthenticated } = useContext(UserAuthContext);

	const fetchWishlists = () => {
		wishlistService
			.getById(wishlistId, password)
			.then((response) => setWishlist(response))
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		fetchWishlists();
		// eslint-disable-next-line
	}, []); // empty [] dependancy list to stop infinite loop

	// Create Wishlist / Item
	const handleNameChange = (e) => {
		setName(e.target.value);
	};

	const handleDescChange = (e) => {
		setDescription(e.target.value);
	};

	const handleImageChange = (e) => {
		setImage(e.target.value);
	};

	const handlePurchaseLinkChange = (e) => {
		setPurchaseLink(e.target.value);
	};

	const handlePriceChange = (e) => {
		setPrice(e.target.value);
	};

	const createItem = (e) => {
		e.preventDefault();
		wishlistService
			.createItem(name, description, image, purchaseLink, price, wishlistId)
			.then((response) => {
				setName('');
				setDescription('');
				setImage('');
				setPurchaseLink('');
				setPrice('');
				fetchWishlists();
			})
			.catch((error) => console.log(error));
	};

	const deleteWishlist = () => {
		fetch(BASE_URL + 'wishlist/' + wishlist.id, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${sessionStorage.getItem('bearer-token')}`,
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			// Data retrieved.
			.then((data) => {
				//Could just update the state locally without another fetch
				window.location.href = '/wishlist/';
			})
			// Data not retrieved.
			.catch((e) => {
				console.log(e);
			});
	};
	const deleteItem = (wishlistId, itemId) => {
		fetch(BASE_URL + 'wishlist/' + wishlistId + '/item/' + itemId, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${sessionStorage.getItem('bearer-token')}`,
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			// Data retrieved.
			.then((data) => {
				//Unnecessary fetch
				fetchWishlists();
			})
			// Data not retrieved.
			.catch((e) => {
				console.log(e);
			});
	};

	const shareWishlist = () => {
		setShowShareNotification(!showShareNotification);
		const dummy = document.createElement('input'),
			text = window.location.href;

		document.body.appendChild(dummy);
		dummy.value = text;
		dummy.select();
		document.execCommand('copy');
		document.body.removeChild(dummy);
	};

	return (
		<div className="wishlist animate__animated animate__zoomIn">
			<div className="wishlist__return">
				<NavLink to="/wishlist" className="text-secondary">
					<AiOutlineArrowLeft /> Return to Wishlists
				</NavLink>
			</div>

			{/* Wishlist Info */}
			<div className="wishlist__heading">
				<div className="wishlist__heading__info1">
					<div className="wishlist__heading__info1__detail">
						<label className="wishlist__heading__info1__detail__label">
							{'Wishlist Name:  '}
						</label>
						<span className="wishlist__heading__info1__detail__span">
							{wishlist.name}
						</span>
					</div>
					<div className="wishlist__heading__detail">
						<label className="wishlist__heading__info1__detail__label">
							{'Created By:  '}
						</label>
						<span className="wishlist__heading__info1__detail__span">
							{wishlist.ownerId}
						</span>
					</div>
				</div>
				<div className="wishlist__heading__info2">
					{wishlist.dueDate ? (
						<div className="wishlist__heading__info1__detail">
							<label className="wishlist__heading__info1__detail__label">
								{'Due Date:  '}
							</label>{' '}
							<span className="wishlist__heading__info1__detail__span">
								{wishlist.dueDate.substring(0, 10)}
							</span>
						</div>
					) : (
						<div className="wishlist__heading__info1__detail"></div>
					)}
					{wishlist.items ? (
						<div className="wishlist__heading__detail">
							<label className="wishlist__heading__info1__detail__label">
								{'Item Count:  '}
							</label>
							<span className="wishlist__heading__info1__detail__span">
								{wishlist.items.length}
							</span>
						</div>
					) : (
						<div className="wishlist__heading__detail"></div>
					)}
				</div>
			</div>

			<div className="table-responsive container mt-4">
				<table className="table">
					<thead>
						<tr className="table-dark">
							<th>Name</th>
							<th>Description</th>
							<th>Image</th>
							<th>Purchase Link</th>
							<th>Price</th>
							<th>Completed</th>
							<th>Update</th>
							<th>Delete Item</th>
						</tr>
					</thead>
					<tbody>
						{wishlist.items
							? wishlist.items.map((w) => (
									<tr key={w.id}>
										<Item item={w} />
										<td>
											<button
												className="btn btn-sm btn-danger"
												onClick={() => deleteItem(w.wishlistID, w.id)}
											>
												Delete
											</button>
										</td>
									</tr>
							  ))
							: null}
					</tbody>
				</table>
			</div>
			{userAuthenticated ? (
				<div className="container has-text-centered wishlist-inputs">
					<form>
						<div className="container mt-4">
							<div className="row">
								<div className="mx-auto">
									<input
										required
										placeholder="Item Name"
										type="text"
										value={name}
										onChange={handleNameChange}
										className="col-sm-12 col-lg-2 m-1"
									/>
									<input
										placeholder="Description"
										type="text"
										value={description}
										onChange={handleDescChange}
										className="col-sm-12 col-lg-2 m-1"
									/>
									<input
										placeholder="Image Link"
										type="url"
										value={image}
										onChange={handleImageChange}
										className="col-sm-12 col-lg-2 m-1"
									/>
									<input
										placeholder="Purchase Link"
										type="url"
										value={purchaseLink}
										onChange={handlePurchaseLinkChange}
										className="col-sm-12 col-lg-2 m-1"
									/>
									<input
										placeholder="Price"
										type="text"
										value={price}
										onChange={handlePriceChange}
										className="col-sm-12 col-lg-2 m-1"
									/>
								</div>
							</div>
						</div>
						<button
							className="button is-success col-sm-12 col-lg-3 m-1"
							onClick={createItem}
						>
							Add Item
						</button>
					</form>
					<button
						className="button is-danger col-sm-12 col-lg-3 m-1"
						onClick={deleteWishlist}
					>
						Delete Wishlist
					</button>
				</div>
			) : (
				'Log in to edit'
			)}

			<div>
				{showShareNotification ? (
					<div class="notification is-primary is-light wishlist-notification">
						<button class="delete" onClick={shareWishlist}></button>
						<a href={window.location.href}>Link</a> copied to clipboard.
					</div>
				) : (
					<button className="button is-info" onClick={shareWishlist}>
						Share Wishlist
					</button>
				)}
			</div>
		</div>
	);
}
