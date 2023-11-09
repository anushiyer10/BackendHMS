import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
    expiresIn: '100d',
  });
};

export const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body;

  try {
    let user = null;
    

    if (role === 'patient') {
      user = await User.findOne({ email });
    } else if (role === 'doctor') {
      user = await Doctor.findOne({ email });
    }

    // Check if the user already exists
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (role === 'patient') {
      user = new User({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    } else if (role === 'doctor') {
      user = new Doctor({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }

    await user.save();
    res.status(200).json({ success: true, message: 'User successfully created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error, please try again' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = null;
    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });

    if (patient) {
      user = patient;
    } else if (doctor) {
      user = doctor;
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(404).json({ success: false, message: 'Invalid credentials' });
    }

    // Get token
    const token = generateToken(user);

    const { password, role, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      message: 'Successfully logged in',
      token,
      data: { ...rest },
      role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to log in, please try again' });
  }
};
