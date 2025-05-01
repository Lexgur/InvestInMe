export const validateRegister = (req, res, next) => {
    const { email, password, username } = req.body;
  
    if (!email || !password || !username) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
  
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }
  
    next();
  };
  
  export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
  
    next();
  };