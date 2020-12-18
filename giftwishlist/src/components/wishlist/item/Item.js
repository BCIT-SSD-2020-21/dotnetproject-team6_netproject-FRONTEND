import React, { useState } from 'react';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Item = (props) => {
	const formatPrice = (price) => {
		const formatter = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
		});

		var newPrice = formatter.format(price);

		if (isNaN(price)) {
			return price;
		} else {
			return newPrice;
		}
	};

	const [itemData, setItemData] = useState(props.item);
	const [showInputs, setShowInputs] = useState(false);
	const [editNameInput, setEditNameInput] = useState(itemData.name);
	const [editDescriptionInput, setEditDescriptionInput] = useState(
		itemData.description
	);
	const [editImageURL, setEditImageURL] = useState(itemData.imageURL);
	const [editPurchaseURL, setEditPurchaseURL] = useState(itemData.purchaseURL);
	const [editPrice, setEditPrice] = useState(itemData.price);

	const toggleCompletedStatus = async (wishlistId, itemId) => {
		const response = await fetch(
			BASE_URL + 'api/wishlist/' + wishlistId + '/item/' + itemId,
			{
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${sessionStorage.getItem('bearer-token')}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					Id: itemId,
					isComplete: !itemData.isComplete,
					wishlistID: wishlistId,
				}),
			}
		).catch((err) => console.log(err));
		if (response.status > 400) {
			return response;
		}
		setItemData({ ...itemData, ...{ isComplete: !itemData.isComplete } });
		return await response.json();
		// window.location.href="/wishlist/" + wishlistId;
	};

	const getItem = async () => {
		const response = await fetch(
			BASE_URL + 'api/wishlist/' + itemData.wishlistID + '/item/' + itemData.id,
			{
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${sessionStorage.getItem('bearer-token')}`,
					'Content-Type': 'application/json',
				},
			}
		).catch((err) => console.log(err));
		if (response.status > 400) {
			return response;
		}
		const result = await response.json();
		setItemData({ ...result });
		console.log(result);
	};

	const updateItem = () => {
		fetch(
			BASE_URL + 'api/wishlist/' + itemData.wishlistID + '/item/' + itemData.id,
			{
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${sessionStorage.getItem('bearer-token')}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					Id: itemData.id,
					Name: editNameInput, // editable
					IsComplete: itemData.isComplete,
					wishlistID: itemData.wishlistID,
					Description: editDescriptionInput, // editable
					ImageURL: editImageURL, // editable
					PurchaseURL: editPurchaseURL, // editable
					Price: editPrice, // editable
				}),
			}
		)
			.then((res) => res.json())
			// Data retrieved.
			.then((data) => {
				setShowInputs(!showInputs);
				// window.location.href="/wishlist/" + itemData.wishlistID;
				getItem();
			})
			// Data not retrieved.
			.catch((e) => {
				console.log(e);
			});
	};

	const showEditInputs = () => {
		setShowInputs(!showInputs);
	};
	// const initializeNameChangeEdit = () => {
	//   setEditNameInput("");
	// }

	const handleNameChangeEdit = (e) => {
		setEditNameInput(e.target.value);
	};

	const handleDescriptionChangeEdit = (e) => {
		setEditDescriptionInput(e.target.value);
	};

	const handleImageChangeEdit = (e) => {
		setEditImageURL(e.target.value);
	};

	const handlePurchaseURLChangeEdit = (e) => {
		setEditPurchaseURL(e.target.value);
	};

	const handlePriceChangeEdit = (e) => {
		if (isNaN(e.target.value)) {
			alert('Price should be a number !!!');
		}
		setEditPrice(e.target.value);
	};

	return (
		<>
			<td>
				{showInputs ? (
					<input
						onChange={handleNameChangeEdit}
						value={editNameInput ? editNameInput : ''}
						className="w-75 text-center"
					/>
				) : (
					<strong>{itemData.name}</strong>
				)}
			</td>
			<td>
				{showInputs ? (
					<input
						onChange={handleDescriptionChangeEdit}
						value={editDescriptionInput ? editDescriptionInput : ''}
						className="w-75 text-center"
					/>
				) : (
					editDescriptionInput
				)}
			</td>
			<td>
				{showInputs ? (
					<input
						onChange={handleImageChangeEdit}
						value={editImageURL ? editImageURL : ''}
						className="w-75 text-center"
					/>
				) : (
					<img
						width="100px"
						height="100px"
						src={itemData.imageURL}
						alt={itemData.name}
					/>
				)}
			</td>
			<td>
				{showInputs ? (
					<input
						onChange={handlePurchaseURLChangeEdit}
						value={editPurchaseURL ? editPurchaseURL : ''}
						className="w-75 text-center"
					/>
				) : (
					<a href={editPurchaseURL} target="blank">
						Purchase
					</a>
				)}
			</td>
			<td>
				{showInputs ? (
					<input
						onChange={handlePriceChangeEdit}
						value={editPrice ? editPrice : ''}
						className="w-75 text-center"
					/>
				) : (
					formatPrice(itemData.price)
				)}
			</td>
			<td>
				<button
					className="button"
					onClick={() =>
						toggleCompletedStatus(itemData.wishlistID, itemData.id)
					}
				>
					{itemData.isComplete ? '✔' : '❌'}
				</button>
			</td>
			<td>
				{showInputs ? (
					<div>
						<button
							className="btn btn-sm btn-success m-1"
							onClick={() => updateItem()}
						>
							Confirm
						</button>
						<button
							className="btn btn-sm btn-warning"
							onClick={() => showEditInputs()}
						>
							Cancel
						</button>
					</div>
				) : (
					<button
						className="btn btn-sm btn-info"
						onClick={() => showEditInputs()}
					>
						Update
					</button>
				)}
			</td>
		</>
	);
};

export default Item;
