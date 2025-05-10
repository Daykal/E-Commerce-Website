import Order from "../models/order.model.js";
import Coupon from "../models/coupon.model.js";
import { stripe } from "../lib/stripe.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ Error: "Invalid or empty cart" });
    }

    let totalAmount = 0;

    // making lineitems for stripe
    // stripe asks price in cents
    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100);
      totalAmount += amount;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: 1,
      };
    });
    // cheking for coupon and applying discount
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });

      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({ id: p._id, quantity: "1", price: p.price }))
        ),
      },
    });
    // if customer spent more than 50 usd they get coupon
    if (totalAmount >= 5000) {
      await createNewCoupon(req.user._id);
    }
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });

  } catch (err) {
    res
      .status(500)
      .json({ message: "Error proccessing checkout", err: err.message });
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return coupon.id;
}

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });

    if (!existingOrder && session.payment_status === "paid") {
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          {
            isActive: false,
          }
        );
      }

      const products = JSON.parse(session.metadata.products);
      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((product) => ({
          product: product.id,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100, //Convert from cents to dollers
        stripeSessionId: sessionId,
      });

      await newOrder.save();
      res
        .status(200)
        .json({
          Success: true,
          message: "Payment successful, order created and coupon deactivated if used.",
          OrderId: newOrder._id,
        });
    }
  } catch (err) {
		res.status(500).json({ message: "Error processing successful checkout", error: err.message });
  }
};

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

  await newCoupon.save();

  return newCoupon;
}