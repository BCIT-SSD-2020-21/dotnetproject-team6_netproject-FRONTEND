import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { GiCheckMark, GiCancel, GiTrashCan } from 'react-icons/gi';
import { GrDocumentUpdate } from 'react-icons/gr';
const BASE_URL = process.env.REACT_APP_BASE_URL + 'api/';

export default class WishlistCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editNameInput: props.wishlist.name,
			editPasswordInput: props.wishlist.password,
			editDueDateInput: props.wishlist.dueDate,
			wishlistActive: true,
			showInputs: false,
			deleteClicked: false,
			wishlist: {
				id: props.wishlist.id,
				name: props.wishlist.name,
				password: props.wishlist.password,
				dueDate: props.wishlist.dueDate,
			},
		};
	}

	showEditInputs = () => {
		this.setState({ showInputs: !this.state.showInputs });
	};

	handleNameChangeEdit = (e) => {
		this.setState({ editNameInput: e.target.value });
	};
	handlePasswordChangeEdit = (e) => {
		this.setState({ editPasswordInput: e.target.value });
	};
	handleDueDateChangeEdit = (e) => {
		this.setState({ editDueDateInput: e.target.value });
	};

	setWishlistData = () => {
		this.setState({
			wishlist: {
				name: this.state.editNameInput,
				password: this.state.editPasswordInput,
				dueDate: this.state.editDueDateInput,
			},
		});
	};

	toggleConfirmDelete = () => {
		this.setState({ deleteClicked: !this.state.deleteClicked });
	};

	updateWishlist = () => {
		fetch(BASE_URL + 'wishlist', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${sessionStorage.getItem('bearer-token')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				Id: this.props.wishlist.id,
				Name: this.state.editNameInput,
				Password: this.state.editPasswordInput,
				DueDate: this.state.editDueDateInput,
			}),
		})
			.then((res) => res.json())
			// Data retrieved.
			.then((data) => {
				// fetchUserWishlists();
				this.setWishlistData();
				this.showEditInputs();
			})
			// Data not retrieved.
			.catch((e) => {
				console.log(e);
			});
	};

	deleteWishlist = () => {
		fetch(BASE_URL + 'wishlist/' + this.state.wishlist.id + '/', {
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
				// fetchUserWishlists();
				// window.location.href = "/wishlist/";
				this.setState({ showInputs: false });
				this.setState({ wishlistActive: false });
				this.toggleConfirmDelete();
			})
			// Data not retrieved.
			.catch((e) => {
				console.log(e);
			});
	};

	render() {
		return (
			<div
				className="wishlists__card"
				style={{ opacity: this.state.wishlistActive ? '1' : '0.4' }}
			>
				{/* Wishlist Name */}
				{this.state.showInputs ? (
					<input
						id="titleInput"
						className="wishlists__card__titleInput card-title"
						type="text"
						onChange={this.handleNameChangeEdit}
						value={this.state.editNameInput}
					/>
				) : this.state.wishlistActive ? (
					<NavLink
						className="wishlists__card__title card-title"
						to={`/wishlist/${this.state.wishlist.id}/${
							this.state.wishlist.password
								? '?password=' + this.state.wishlist.password
								: ''
						}`}
					>
						<button className="wishlists__card__title__button">
							{this.state.wishlist.name}
						</button>
					</NavLink>
				) : (
					<div>{this.state.wishlist.name + ' {DELETED}'}</div> // remove?
				)}
				{/* Item Count */}
				{this.state.showInputs ? (
					''
				) : (
					<div className="wishlists__card__count">
						{this.props.wishlist.items.length}{' '}
						{this.props.wishlist.items.length === 1 ? ' item' : ' items'}
					</div>
				)}
				{/* Wishlist Password */}
				{this.state.showInputs ? (
					<input
						id="passwordInput"
						className="wishlists__card__password card-text"
						type="text"
						onChange={this.handlePasswordChangeEdit}
						value={
							this.state.editPasswordInput == null
								? ''
								: this.state.editPasswordInput
						}
						placeholder={
							this.state.wishlist.password === '' ? 'password (optional)' : ''
						}
					/>
				) : this.state.wishlist.password !== '' ? (
					<p className="wishlists__card__password card-text">
						Password: {this.state.wishlist.password}
					</p>
				) : (
					<p className="wishlists__card__password card-text none_set">
						No Password Set
					</p>
				)}
				{/* Wishlist DueDate */}
				{this.state.showInputs ? (
					<input
						id="dueDateInput"
						className="wishlists__card__dueDate card-text"
						type="date"
						onChange={this.handleDueDateChangeEdit}
						value={
							this.state.editDueDateInput == null
								? ''
								: this.state.editDueDateInput
						}
					/>
				) : this.state.wishlist.dueDate === null ? (
					<p className="wishlists__card__dueDate card-text none_set">
						No Due Date Set
					</p>
				) : (
					<p className="wishlists__card__dueDate card-text">
						Due Date:{' '}
						<span className="wishlists__card__dueDate__date">
							{this.state.wishlist.dueDate.substring(0, 10)}
						</span>
					</p>
				)}

				{/* Toggle ShowUpdate / (Confirm + Cancel) */}
				<div className="wishlists__card__actions">
					{this.state.showInputs ? (
						<div className="wishlists__card__actions__update">
							<button
								id="confirmUpdate"
								className="wishlists__card__actions__update__button  animate__animated animate__bounceInLeft"
								onClick={() => this.updateWishlist()}
							>
								<GiCheckMark className="cardIcon" />
								{'  Confirm'}
							</button>
							<button
								id="cancelUpdate"
								className="wishlists__card__actions__update__button animate__animated animate__bounceInRight"
								onClick={() => this.showEditInputs()}
							>
								<GiCancel className="cardIcon" />
								{'  Cancel Update'}
							</button>
						</div>
					) : (
						<div className="wishlists__card__actions__update">
							<button
								id="showUpdate"
								className="wishlists__card__actions__update__button"
								style={{
									cursor: this.state.wishlistActive ? 'pointer' : 'default',
								}}
								onClick={
									this.state.wishlistActive ? () => this.showEditInputs() : null
								}
							>
								<GrDocumentUpdate className="cardIcon" />
								{'  Update Wishlist'}
							</button>
						</div>
					)}
					{/* Delete Wishlist */}
					{this.state.deleteClicked ? (
						<div className="wishlists__card__actions__delete">
							<button
								id="confirmDelete"
								className="wishlists__card__actions__delete__button  animate__animated animate__bounceInLeft"
								onClick={
									this.state.wishlistActive ? () => this.deleteWishlist() : null
								}
							>
								<GiCheckMark className="cardIcon" />
								{'  Confirm'}
							</button>
							<button
								id="cancelDelete"
								className="wishlists__card__actions__delete__button animate__animated animate__bounceInRight"
								onClick={() => this.toggleConfirmDelete()}
							>
								<GiCancel className="cardIcon" />
								{'  Cancel Delete'}
							</button>
						</div>
					) : (
						<div className="wishlists__card__actions__delete">
							<button
								id="showDelete"
								className="wishlists__card__actions__delete__button"
								style={{
									cursor: this.state.wishlistActive ? 'pointer' : 'default',
								}}
								onClick={
									this.state.wishlistActive
										? () => this.toggleConfirmDelete()
										: null
								}
							>
								<GiTrashCan size={26} className="cardIcon" />
								{'  Delete'}
							</button>
						</div>
					)}
				</div>
			</div>
		);
	}
}
