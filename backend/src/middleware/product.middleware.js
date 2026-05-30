//updaed by bibhusha
const validateSearch = (req, res, next) => {
  const { keyword, category, minPrice, maxPrice } = req.query;

  if (minPrice && isNaN(Number(minPrice))) {
    return res.status(400).json({ message: "minPrice must be a number" });
  }
  if (maxPrice && isNaN(Number(maxPrice))) {
    return res.status(400).json({ message: "maxPrice must be a number" });
  }
  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    return res.status(400).json({ message: "minPrice cannot be greater than maxPrice" });
  }

  next();
};

export { validateSearch };