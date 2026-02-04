function sanitizeString(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .replace(/<[^>]*>/g, "")
    .trim()
}

/* ***************************
 *  Validate registration data
 * ************************** */
function validateRegistration(req, res, next) {
  const errors = []

  const account_firstname = sanitizeString(req.body.account_firstname)
  const account_lastname = sanitizeString(req.body.account_lastname)
  const account_email = sanitizeString(req.body.account_email)
  const account_password = req.body.account_password || ""

  // Firstname validation
  if (!account_firstname) {
    errors.push({ msg: "First name is required." })
  } else if (account_firstname.length < 1 || account_firstname.length > 50) {
    errors.push({ msg: "First name must be between 1 and 50 characters." })
  }

  // Lastname validation
  if (!account_lastname) {
    errors.push({ msg: "Last name is required." })
  } else if (account_lastname.length < 2 || account_lastname.length > 50) {
    errors.push({ msg: "Last name must be between 2 and 50 characters." })
  }

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!account_email) {
    errors.push({ msg: "Email is required." })
  } else if (!emailPattern.test(account_email)) {
    errors.push({ msg: "Please enter a valid email address." })
  } else if (account_email.length > 100) {
    errors.push({ msg: "Email must be 100 characters or fewer." })
  }

  // Password validation (minimum 12 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character)
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{12,}$/
  if (!account_password) {
    errors.push({ msg: "Password is required." })
  } else if (!passwordPattern.test(account_password)) {
    errors.push({
      msg: "Password must be at least 12 characters and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
    })
  }

  // Update sanitized values in body
  req.body.account_firstname = account_firstname
  req.body.account_lastname = account_lastname
  req.body.account_email = account_email

  req.validationErrors = errors
  next()
}

/* ***************************
 *  Validate login data
 * ************************** */
function validateLogin(req, res, next) {
  const errors = []

  const account_email = sanitizeString(req.body.account_email)
  const account_password = req.body.account_password || ""

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!account_email) {
    errors.push({ msg: "Email is required." })
  } else if (!emailPattern.test(account_email)) {
    errors.push({ msg: "Please enter a valid email address." })
  }

  // Password validation
  if (!account_password) {
    errors.push({ msg: "Password is required." })
  }

  req.body.account_email = account_email
  req.validationErrors = errors
  next()
}

/* ***************************
 *  Validate account update data
 * ************************** */
function validateAccountUpdate(req, res, next) {
  const errors = []

  const account_id = parseInt(req.body.account_id, 10)
  const account_firstname = sanitizeString(req.body.account_firstname)
  const account_lastname = sanitizeString(req.body.account_lastname)
  const account_email = sanitizeString(req.body.account_email)

  // Account ID validation
  if (!Number.isInteger(account_id)) {
    errors.push({ msg: "Invalid account ID." })
  }

  // Firstname validation
  if (!account_firstname) {
    errors.push({ msg: "First name is required." })
  } else if (account_firstname.length < 1 || account_firstname.length > 50) {
    errors.push({ msg: "First name must be between 1 and 50 characters." })
  }

  // Lastname validation
  if (!account_lastname) {
    errors.push({ msg: "Last name is required." })
  } else if (account_lastname.length < 2 || account_lastname.length > 50) {
    errors.push({ msg: "Last name must be between 2 and 50 characters." })
  }

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!account_email) {
    errors.push({ msg: "Email is required." })
  } else if (!emailPattern.test(account_email)) {
    errors.push({ msg: "Please enter a valid email address." })
  } else if (account_email.length > 100) {
    errors.push({ msg: "Email must be 100 characters or fewer." })
  }

  req.body.account_id = account_id
  req.body.account_firstname = account_firstname
  req.body.account_lastname = account_lastname
  req.body.account_email = account_email

  req.validationErrors = errors
  next()
}

/* ***************************
 *  Validate password change
 * ************************** */
function validatePasswordChange(req, res, next) {
  const errors = []

  const account_id = parseInt(req.body.account_id, 10)
  const account_password = req.body.account_password || ""

  // Account ID validation
  if (!Number.isInteger(account_id)) {
    errors.push({ msg: "Invalid account ID." })
  }

  // Password validation (minimum 12 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character)
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{12,}$/
  if (!account_password) {
    errors.push({ msg: "Password is required." })
  } else if (!passwordPattern.test(account_password)) {
    errors.push({
      msg: "Password must be at least 12 characters and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
    })
  }

  req.body.account_id = account_id
  req.validationErrors = errors
  next()
}

module.exports = {
  validateRegistration,
  validateLogin,
  validateAccountUpdate,
  validatePasswordChange,
}
