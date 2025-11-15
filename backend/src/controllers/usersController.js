import User from "../models/User.js";

export async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(User);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}

export async function createUser(req, res) {
  try {
    const {
      UserID,
      UserPassword,
      Role,
      EndTimeGiuXe,
      StartTimeGiuXe,
      TotalFare,
      UserName,
    } = req.body;
    const user = new User({
      UserID,
      UserPassword,
      Role,
      EndTimeGiuXe,
      StartTimeGiuXe,
      TotalFare,
      UserName,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export async function updateUser(req, res) {
  try {
    const {
      UserID,
      UserPassword,
      Role,
      EndTimeGiuXe,
      StartTimeGiuXe,
      TotalFare,
      UserName,
    } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        UserID,
        UserPassword,
        Role,
        EndTimeGiuXe,
        StartTimeGiuXe,
        TotalFare,
        UserName,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}
export async function deleteUser(req, res) {
  try {
    const id = req.params.id;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User " + id + " deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}
// backend/src/controllers/usersController.js - Add this function
export async function loginUser(req, res) {
  try {
    const { UserID, UserPassword } = req.body;

    if (!UserID || !UserPassword) {
      return res.status(400).json({ message: "UserID và Password là bắt buộc" });
    }

    // Find user by UserID
    const user = await User.findOne({ UserID: UserID });

    if (!user) {
      return res.status(401).json({ message: "User ID không tồn tại" });
    }

    // Simple password check (in production, use bcrypt)
    if (user.UserPassword !== UserPassword) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    // Return user data (exclude password)
    const userData = {
      _id: user._id,
      UserID: user.UserID,
      UserName: user.UserName,
      Role: user.Role,
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
}
