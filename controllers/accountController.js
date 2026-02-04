const accountModel = require('../models/account-model')
const reviewModel = require('../models/review-model')
const utilities = require('../utilities')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const accountCont = {}

/* ***************************
 *  Deliver login view
 * ************************** */
accountCont.buildLogin = async function (req, res) {
  res.render('account/login', {
    title: 'Login',
    errors: null,
    account_email: '',
  })
}

/* ***************************
 *  Deliver registration view
 * ************************** */
accountCont.buildRegister = async function (req, res) {
  res.render('account/register', {
    title: 'Register',
    errors: null,
    account_firstname: '',
    account_lastname: '',
    account_email: '',
  })
}

/* ***************************
 *  Process registration
 * ************************** */
accountCont.registerAccount = async function (req, res, next) {
  try {
    const errors = req.validationErrors || []
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    if (errors.length) {
      return res.render('account/register', {
        title: 'Register',
        errors,
        account_firstname,
        account_lastname,
        account_email,
      })
    }

    // Check if email already exists
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists) {
      return res.render('account/register', {
        title: 'Register',
        errors: [{ msg: 'Email already exists. Please log in or use a different email.' }],
        account_firstname,
        account_lastname,
        account_email,
      })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(account_password, 10)

    // Register the account
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash('notice', `Congratulations, you're registered ${account_firstname}. Please log in.`)
      return res.redirect('/account/login')
    } else {
      return res.render('account/register', {
        title: 'Register',
        errors: [{ msg: 'Sorry, the registration failed. Please try again.' }],
        account_firstname,
        account_lastname,
        account_email,
      })
    }
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Process login
 * ************************** */
accountCont.accountLogin = async function (req, res, next) {
  try {
    const errors = req.validationErrors || []
    const { account_email, account_password } = req.body

    if (errors.length) {
      return res.render('account/login', {
        title: 'Login',
        errors,
        account_email,
      })
    }

    // Get account by email
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
      return res.render('account/login', {
        title: 'Login',
        errors: [{ msg: 'Please check your credentials and try again.' }],
        account_email,
      })
    }

    // Check password
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)
    if (!passwordMatch) {
      return res.render('account/login', {
        title: 'Login',
        errors: [{ msg: 'Please check your credentials and try again.' }],
        account_email,
      })
    }

    // Create JWT token (exclude password)
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

    // Set cookie with JWT
    const cookieOptions = {
      httpOnly: true,
      maxAge: 3600 * 1000, // 1 hour
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    }
    res.cookie('jwt', accessToken, cookieOptions)

    return res.redirect('/account/')
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Deliver account management view
 * ************************** */
accountCont.buildManagement = async function (req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id
    const reviews = await reviewModel.getReviewsByAccountId(account_id)
    
    res.render('account/management', {
      title: 'Account Management',
      errors: null,
      reviews: reviews
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Deliver account update view
 * ************************** */
accountCont.buildUpdate = async function (req, res, next) {
  try {
    const account_id = parseInt(req.params.account_id)
    const accountData = await accountModel.getAccountById(account_id)

    if (!accountData) {
      req.flash('notice', 'Account not found.')
      return res.redirect('/account/')
    }

    res.render('account/update', {
      title: 'Update Account',
      errors: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Process account update
 * ************************** */
accountCont.updateAccount = async function (req, res, next) {
  try {
    const errors = req.validationErrors || []
    const { account_id, account_firstname, account_lastname, account_email } = req.body

    if (errors.length) {
      return res.render('account/update', {
        title: 'Update Account',
        errors,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      })
    }

    // Check if email already exists for another account
    const emailExists = await accountModel.checkExistingEmailExcept(account_email, account_id)
    if (emailExists) {
      return res.render('account/update', {
        title: 'Update Account',
        errors: [{ msg: 'Email already exists. Please use a different email.' }],
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      })
    }

    // Update account
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )

    if (updateResult) {
      // Update JWT token with new account data
      const accountData = await accountModel.getAccountById(account_id)
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

      const cookieOptions = {
        httpOnly: true,
        maxAge: 3600 * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      }
      res.cookie('jwt', accessToken, cookieOptions)

      req.flash('notice', 'Account information updated successfully.')
      return res.redirect('/account/')
    } else {
      return res.render('account/update', {
        title: 'Update Account',
        errors: [{ msg: 'Sorry, the update failed. Please try again.' }],
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      })
    }
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Process password change
 * ************************** */
accountCont.updatePassword = async function (req, res, next) {
  try {
    const errors = req.validationErrors || []
    const { account_id, account_password } = req.body

    // Get current account data to restore form if error
    const accountData = await accountModel.getAccountById(account_id)

    if (errors.length) {
      return res.render('account/update', {
        title: 'Update Account',
        errors,
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
      })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(account_password, 10)

    // Update password
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

    if (updateResult) {
      req.flash('notice', 'Password changed successfully.')
      return res.redirect('/account/')
    } else {
      return res.render('account/update', {
        title: 'Update Account',
        errors: [{ msg: 'Sorry, the password change failed. Please try again.' }],
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
      })
    }
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Process logout
 * ************************** */
accountCont.logout = async function (req, res) {
  res.clearCookie('jwt')
  req.flash('notice', 'You have been logged out.')
  return res.redirect('/')
}

module.exports = accountCont
