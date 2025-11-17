import ar from "../lib/arcjet.js";

export const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await ar.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).send("Too Many Requests");
      } else if (decision.reason.isBot) {
        return res.status(403).json({ message: "Access Denied" });
      } else {
        return res.status(403).json({ message: "Access Denied" });
      }
    }

    if (decision.results.some(isSpoofedBot)) {
      return res
        .status(403)
        .json({ error: "spoofed bot detected", message: "Access Denied" });
    }

    next();
  } catch (error) {
    console.log("Arcjet Protection Error:", error);
    next(); // السماح للسيستم يكمل بدون توقف
  }
};
