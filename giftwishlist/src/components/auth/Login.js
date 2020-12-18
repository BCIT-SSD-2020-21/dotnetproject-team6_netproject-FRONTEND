import React, { Component } from 'react';
import 'animate.css';
import FormErrors from '../util/FormErrors';
import validateForm from '../util/Validation';
import { UserAuthContext } from '../UserAuthContext';
import { NavLink } from 'react-router-dom';
import { GiCheckMark } from 'react-icons/gi';

// const LOCALHOST = 44361;
const BASE_URL = process.env.REACT_APP_BASE_URL;

class Login extends Component {
	state = {
		email: '',
		password: '',
		errors: {
			blankfield: false,
			matchedpassword: false,
			failedlogin: false,
		},
	};

	componentDidMount() {
		if (
			sessionStorage.getItem('bearer-token') === null ||
			sessionStorage.getItem('bearer-token') === ''
		) {
			sessionStorage.setItem('loggedIn-email', this.state.email);
		}
	}

	// helper function...be sure to list the state variables specific to the form
	clearErrors = () => {
		this.setState({
			errors: {
				blankfield: false,
				failedlogin: false,
				//matchedpassword: false
			},
		});
	};

	handleSubmit = async (event) => {
		//Prevent page reload
		event.preventDefault();

		//Form validation
		this.clearErrors();
		const error = validateForm(event, this.state);

		if (error) {
			this.setState({
				errors: { ...this.state.errors, ...error },
			});
		} else {
			//Integrate Auth here on valid form submission
			fetch(`${BASE_URL}Auth/Login`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					Email: this.state.email,
					Password: this.state.password,
				}),
			})
				// Response received.
				.then((response) => response.json())
				// Data retrieved.
				.then((json) => {
					console.log(JSON.stringify(json));
					// Store token with session data.
					if (json['status'] === 'OK') {
						sessionStorage.setItem('bearer-token', json['token']);
						sessionStorage.setItem('loggedIn-email', this.state.email);
						// rediredt to Wishlist AFTER sessionStorage updated
						window.location.href = '/wishlist';
					} else {
						this.setState({
							errors: { ...this.state.errors, ...{ failedlogin: true } },
						});
					}
				})
				// Data not retrieved
				.catch(function (error) {
					console.log(error);
				});
			if (
				sessionStorage.getItem('bearer-token') === null ||
				sessionStorage.getItem('bearer-token') === ''
			) {
				sessionStorage.setItem('loggedIn-email', this.state.email);
			}
		}
	};

	onInputChange = (event) => {
		this.setState({
			[event.target.id]: event.target.value,
		});
		document.getElementById(event.target.id).classList.remove('is-danger');
	};

	render() {
		// const { userAuthenticated, updateUserAuthenticated } = this.context

		return (
			<section className="login section auth">
				<div className="login__container container">
					<h1 className="login__container__title animate__animated animate__fadeIn  display-4 mb-4">
						Login
					</h1>
					<FormErrors formerrors={this.state.errors} />
					<form
						className="login__container__form animate__animated animate__fadeInDown"
						onSubmit={this.handleSubmit}
					>
						<div className="login__container__form__field field">
							<p className="login__container__form__field__control control">
								<input
									className="login__container__form__field__control__input input"
									type="text"
									id="email"
									placeholder="Enter email"
									value={this.state.email}
									onChange={this.onInputChange}
								/>
							</p>
						</div>
						<div className="login__container__form__field field">
							<p className="login__container__form__field__control control">
								<input
									className="login__container__form__field__control__input input"
									type="password"
									id="password"
									placeholder="Password"
									value={this.state.password}
									onChange={this.onInputChange}
								/>
							</p>
						</div>
						<div className="login__container__form__field field">
							<p className="login__container__form__field__control control">
								<UserAuthContext.Consumer>
									{({ userAuthenticated, updateUserAuthenticated }) => {
										return (
											<button
												className="login__container__form__field__control__button"
												onClick={updateUserAuthenticated}
											>
												GO!
												{userAuthenticated ? <GiCheckMark /> : <div></div>}
											</button>
										);
									}}
								</UserAuthContext.Consumer>
							</p>
						</div>
					</form>
					<NavLink
						className="login__container__register animate__animated animate__zoomInUp"
						to="/register"
					>
						Register
					</NavLink>
				</div>
			</section>
		);
	}
}

export default Login;
