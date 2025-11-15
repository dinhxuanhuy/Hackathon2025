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
