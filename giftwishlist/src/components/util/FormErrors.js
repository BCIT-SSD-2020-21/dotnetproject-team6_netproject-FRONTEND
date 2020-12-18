import React from 'react';

function FormErrors(props) {
	// Only keep the errors that are set to true
	const activeErrors =
		Object.entries(props.formerrors).filter((e) => e[1]).length > 0;

	// currently only validating for two types of errors, blankfield and mismatched password on Register
	if (props.formerrors && activeErrors) {
		return (
			<div className="error container">
				<div className="errorMessage row justify-content-center">
					{props.formerrors.matchedpassword
						? 'Password value does not match confirm password value'
						: ''}
				</div>
				<div className="errorMessage">
					{props.formerrors.blankfield ? 'All fields are required' : ''}
				</div>
				<div className="errorMessage">
					{props.formerrors.failedlogin ? 'Login failed.' : ''}
				</div>
				<div className="errorMessage">
					{props.formerrors.failedregister ? 'Registration failed.' : ''}
				</div>
			</div>
		);
	} else {
		return <div />;
	}
}

export default FormErrors;
