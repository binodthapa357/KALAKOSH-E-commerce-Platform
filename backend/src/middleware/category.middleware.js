const VALID_CATEGORIES = ['pottery','dhaka-weaving','thangka-painting','silver-jewelry','woodwork','pashmina'];

const validateCategory = (req, res, next) => {
  const { categoryName } = req.params;
  if (!VALID_CATEGORIES.includes(categoryName)) {
    return res.status(400).json({
      success: false,
      message: `Invalid category. Valid options are: ${VALID_CATEGORIES.join(', ')}`,
    });
  }
  next();
};

export { validateCategory };
