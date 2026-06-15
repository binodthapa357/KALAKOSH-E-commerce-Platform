/**
 * @desc    Get standard shipping rates and delivery times
 * @route   GET /api/shipping/rates
 * @access  Public
 */
export const getShippingRates = async (req, res, next) => {
  try {
    const shippingRates = [
      { region: "Kathmandu Valley", cost: 100, estimated_days: "1-2 days" },
      { region: "Lalitpur", cost: 100, estimated_days: "1-2 days" },
      { region: "Bhaktapur", cost: 100, estimated_days: "1-2 days" },
      { region: "Major Cities (Pokhara, Biratnagar, Butwal, Chitwan)", cost: 150, estimated_days: "2-4 days" },
      { region: "Rest of Nepal", cost: 200, estimated_days: "3-6 days" },
      { region: "Remote Himalayan Regions (Solukhumbu, Mustang, Dolpa)", cost: 250, estimated_days: "5-9 days" },
    ];

    res.status(200).json({
      success: true,
      rates: shippingRates,
      free_shipping_threshold: 5000,
      currency: "NPR",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Calculate dynamic shipping cost based on city/state and cart subtotal
 * @route   POST /api/shipping/calculate
 * @access  Public
 */
export const calculateShippingCost = async (req, res, next) => {
  try {
    const { city, state, subtotal } = req.body;

    if (!city || !state) {
      return res.status(400).json({ message: "City and State/Province are required to calculate shipping" });
    }

    const subtotalAmt = Number(subtotal) || 0;

    // Free shipping threshold
    if (subtotalAmt >= 5000) {
      return res.status(200).json({
        success: true,
        shipping_cost: 0,
        estimated_days: "2-5 days",
        currency: "NPR",
        message: "Your order qualifies for Free Shipping!",
      });
    }

    const normalizedCity = city.trim().toLowerCase();
    const normalizedState = state.trim().toLowerCase();

    let cost = 150;
    let estimated_days = "3-6 days";

    if (
      ["kathmandu", "lalitpur", "bhaktapur", "kirtipur"].includes(normalizedCity) ||
      normalizedState === "bagmati"
    ) {
      cost = 100;
      estimated_days = "1-2 days";
    } else if (
      ["pokhara", "biratnagar", "butwal", "chitwan", "dharan", "birgunj", "nepalgunj", "hentauda", "itahari"].includes(
        normalizedCity
      )
    ) {
      cost = 150;
      estimated_days = "2-4 days";
    } else if (
      [
        "solukhumbu",
        "mustang",
        "manang",
        "dolpa",
        "jumla",
        "humla",
        "mugu",
        "kalikot",
        "darchula",
        "taplejung",
        "sankhuwasabha",
      ].includes(normalizedCity)
    ) {
      cost = 250;
      estimated_days = "5-9 days";
    } else {
      cost = 200;
      estimated_days = "3-6 days";
    }

    res.status(200).json({
      success: true,
      shipping_cost: cost,
      estimated_days,
      currency: "NPR",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getShippingRates,
  calculateShippingCost,
};
