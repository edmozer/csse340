function sanitizeString(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .replace(/<[^>]*>/g, "")
    .trim()
}

function validateClassification(req, res, next) {
  const errors = []
  const classification_name = sanitizeString(req.body.classification_name)

  if (!classification_name) {
    errors.push({ msg: "Classification name is required." })
  } else if (!/^[A-Za-z0-9]+$/.test(classification_name)) {
    errors.push({
      msg: "Classification name may only contain letters and numbers (no spaces or special characters).",
    })
  } else if (classification_name.length > 50) {
    errors.push({ msg: "Classification name must be 50 characters or fewer." })
  }

  req.body.classification_name = classification_name
  req.validationErrors = errors
  next()
}

function validateInventory(req, res, next) {
  const errors = []

  const inv_make = sanitizeString(req.body.inv_make)
  const inv_model = sanitizeString(req.body.inv_model)
  const inv_year = Number.parseInt(req.body.inv_year, 10)
  const classification_id = Number.parseInt(req.body.classification_id, 10)
  const inv_description = sanitizeString(req.body.inv_description)
  const inv_image = sanitizeString(req.body.inv_image)
  const inv_thumbnail = sanitizeString(req.body.inv_thumbnail)
  const inv_price = Number.parseFloat(req.body.inv_price)
  const inv_miles = Number.parseInt(req.body.inv_miles, 10)
  const inv_color = sanitizeString(req.body.inv_color)

  if (!inv_make) {
    errors.push({ msg: "Make is required." })
  } else if (inv_make.length > 100) {
    errors.push({ msg: "Make must be 100 characters or fewer." })
  }

  if (!inv_model) {
    errors.push({ msg: "Model is required." })
  } else if (inv_model.length > 100) {
    errors.push({ msg: "Model must be 100 characters or fewer." })
  }

  if (!Number.isInteger(inv_year)) {
    errors.push({ msg: "Year must be a whole number." })
  } else if (inv_year < 1886 || inv_year > 2099) {
    errors.push({ msg: "Year must be between 1886 and 2099." })
  }

  if (!Number.isInteger(classification_id)) {
    errors.push({ msg: "Please choose a classification." })
  }

  if (!inv_description) {
    errors.push({ msg: "Description is required." })
  }

  const imagePattern = /^\/images\/[A-Za-z0-9/_\-]+\.(png|jpe?g|gif)$/i
  if (!inv_image) {
    errors.push({ msg: "Image path is required." })
  } else if (!imagePattern.test(inv_image)) {
    errors.push({ msg: "Image path must be a valid /images/... file path." })
  }

  if (!inv_thumbnail) {
    errors.push({ msg: "Thumbnail path is required." })
  } else if (!imagePattern.test(inv_thumbnail)) {
    errors.push({ msg: "Thumbnail path must be a valid /images/... file path." })
  }

  if (!Number.isFinite(inv_price)) {
    errors.push({ msg: "Price must be a number." })
  } else if (inv_price < 0) {
    errors.push({ msg: "Price must be 0 or greater." })
  }

  if (!Number.isInteger(inv_miles)) {
    errors.push({ msg: "Miles must be a whole number." })
  } else if (inv_miles < 0) {
    errors.push({ msg: "Miles must be 0 or greater." })
  }

  if (!inv_color) {
    errors.push({ msg: "Color is required." })
  } else if (inv_color.length > 50) {
    errors.push({ msg: "Color must be 50 characters or fewer." })
  }

  req.body = {
    ...req.body,
    inv_make,
    inv_model,
    inv_year: Number.isInteger(inv_year) ? inv_year : req.body.inv_year,
    classification_id: Number.isInteger(classification_id)
      ? classification_id
      : req.body.classification_id,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price: Number.isFinite(inv_price) ? inv_price : req.body.inv_price,
    inv_miles: Number.isInteger(inv_miles) ? inv_miles : req.body.inv_miles,
    inv_color,
  }

  req.validationErrors = errors
  next()
}

module.exports = {
  validateClassification,
  validateInventory,
}
