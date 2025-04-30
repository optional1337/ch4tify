import { User } from "../models/user-model.js";
import Group from "../models/Group.js";
// import Admin  from "../models/Admin.js"
import bcryptjs, { compare } from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../mailtrap/emails.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { send } from "process";
import cloudinary from '../utils/cloudinary.js'
import jwt from "jsonwebtoken";
import { io, getReceiverSocketId } from "../utils/socket.js";

export const signup = async (req, res) => {
    const { email, password, name, alias } = req.body;
    try {
        if (!email || !password || !name || !alias) {
            return res.status(400).json({success:false, message: "All fields are required" });
        }
    const userAlreadyExists = await User.findOne({ email});
    const aliasAlreadyExists = await User.findOne({ alias });
    
    if (userAlreadyExists) {
        return res.status(400).json({success:false, message: "User already exists" });
        }
    else if (aliasAlreadyExists) {
        return res.status(400).json({success:false, message: "Alias already exists" });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
	if (!passwordRegex.test(password)) {
		return res.status(400).json({success:false, message:
			"Password is not Strong"
    });
	    return;
    }

        const hashPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            email,
            password: hashPassword,
            name,
            alias,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        });
        await user.save();

        //jwt token
        generateTokenAndSetCookie(res, user._id);

        // await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success:true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined
            }

        });

    } catch (error) {
        res.status(400).json({success:false, message: error.message});
    }
};

export const verifyEmail = async (req, res) => {
    const {code} = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({success:false, message: "Invalid or expired verification code"});
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        // await sendWelcomeEmail(user.email, user.alias);

        res.status(200).json({
            success:true,
            message: "User Created successfully",
            user : {
                ...user._doc,
                password: undefined
            }
        });
    }
    catch (error) {
        console.log("error in verifyEmail", error);
        res.status(500).json({success:false, message: "server error"});
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    // Validate if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({success:false, message: "Invalid Email"});
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({success:false, message: "Invalid Password"});//credentials
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(403).json({ success: false, message: "Please verify your email before logging in" });
        }
        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = Date.now();
        await user.save();
        
        res.status(200).json({
            success:true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
                
            },
        });
    } catch (error) {
            console.log("Error in login", error);
            res.status(500).json({success:false, message: "Internal server error"});
        }
}


export const verifyPassword = async (req, res) => {
  try {
    console.log("DEBUG: req.user =", req.user); // 🔥 Log this first

    const { currentPassword } = req.body;

    if (!currentPassword) {
      console.log("DEBUG: No currentPassword provided");
      return res.status(400).json({ success: false, message: "Current password is required" });
    }

    // Fetch user again with password
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      console.log("DEBUG: User not found by ID", req.user._id);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("DEBUG: Fetched user for verification:", user);

    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    console.log("DEBUG: Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    res.status(200).json({ success: true, message: "Password verified successfully" });
  } catch (error) {
    console.error("🔥 Error in verifyPassword:", error); // Log full error
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const updatePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "New password and confirmation are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(newPassword)) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters with uppercase, lowercase, and a number" });
    }

    // Fetch user again to update
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isSamePassword = await bcryptjs.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ success: false, message: "New password cannot be same as old password" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({success:true, message: "Logged out successfully"});
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({success:false, message: "Email not found"});
        }
        // generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hours
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();

        // send email

        // await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        
        res.status(200).json({success:true, message: "Reset password email sent successfully"});
    } catch (error) {
        console.log("Error in forgotPassword", error);
        res.status(500).json({success: false, message: "Server error. Please try again later"});
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        }).select("+password");
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        // Check if the new password is the same as the current password
        const isSamePassword = await bcryptjs.compare(password, user.password);
        if (isSamePassword) {
            return res.status(400).json({ success: false, message: "New password cannot be the same as the current password" });
        }

        // Check if the password matches the regex (similar to frontend validation)
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character." });
        }


        // Update password
        const hashPassword = await bcryptjs.hash(password, 10);
        user.password = hashPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save(); 

        // Send email (optional)
        // await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log("Error in resetPassword", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(400).json({success:false, message: "User not found"});
        }
        res.status(200).json({success:true, user});
    } catch (error) {
        console.log("Error in checkAuth", error);
        res.status(400).json({success:false, message: error.message});
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
    
        if (!profilePic) {
          return res.status(400).json({ message: "Profile pic is required" });
        }
        let imageUrl = profilePic;

        if (profilePic.startsWith("data:image")) {
            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            imageUrl = uploadResponse.secure_url;
          }

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { profilePic: imageUrl },
          { new: true }
        );
    
        res.status(200).json({ user: updatedUser });
      } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
      }
}


export const adminLogin = async (req, res) => {
    const { secretKey } = req.body;
    
    if (!secretKey) {
        return res.status(400).json({ success: false, message: "Secret key is required" });
    }

    try {
        // Check if the secret key matches the environment variable
        if (secretKey !== process.env.ADMIN_SECRET_KEY) {
            return res.status(401).json({ success: false, message: "Invalid secret key" });
        }

        // Generate a token (since we don't have an admin user in DB)
        const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("adminToken", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

        res.status(200).json({
            success: true,
            message: "Access Granted",
            token, // Send token if needed for frontend authentication
        });
    } catch (error) {
        console.error("Error in admin login", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const adminLogout = async (req, res) => {
    res.clearCookie("adminToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

// Friend System

export const sendFriendRequest = async (req, res) => {
  const { receiverId } = req.body;

  try {
      const senderId = req.user?._id;

      if (!senderId) {
          return res.status(401).json({ success: false, message: "Unauthorized - Sender not found" });
      }

      if (receiverId === senderId.toString()) {
          return res.status(400).json({ success: false, message: "You cannot send a request to yourself" });
      }

      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);

      if (!receiver) {
          return res.status(404).json({ success: false, message: "Receiver not found" });
      }

      if (
          receiver.friendRequestsReceived.includes(senderId) ||
          receiver.friends.includes(senderId)
      ) {
          return res.status(400).json({ success: false, message: "Friend request already sent or you're already friends" });
      }

      // ✅ Correct field names
      receiver.friendRequestsReceived.push(senderId);
      sender.friendRequestsSent.push(receiverId);

      await receiver.save();
      await sender.save();

      res.status(200).json({ success: true, message: "Friend request sent" });
  } catch (error) {
      console.error("Error in sendFriendRequest:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};


export const acceptFriendRequest = async (req, res) => {
  const { senderId } = req.body;
  const receiverId = req.user._id;

  try {
      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);

      if (!sender || !receiver.friendRequestsReceived.includes(senderId)) {
          return res.status(400).json({ success: false, message: "Friend request not found" });
      }

      // Remove from friend request arrays
      receiver.friendRequestsReceived = receiver.friendRequestsReceived.filter(
          id => id.toString() !== senderId
      );
      sender.friendRequestsSent = sender.friendRequestsSent.filter(
          id => id.toString() !== receiverId.toString()
      );

      // Add to friends list
      receiver.friends.push(senderId);
      sender.friends.push(receiverId);

      await receiver.save();
      await sender.save();

      res.status(200).json({ success: true, message: "Friend request accepted" });
  } catch (error) {
      console.error("Error accepting friend request:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};


export const declineFriendRequest = async (req, res) => {
  const { senderId } = req.body;
  const receiverId = req.user._id;

  try {
      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);

      if (!sender || !receiver.friendRequestsReceived.includes(senderId)) {
          return res.status(400).json({ success: false, message: "Friend request not found" });
      }

      // Remove from request lists
      receiver.friendRequestsReceived = receiver.friendRequestsReceived.filter(
          id => id.toString() !== senderId
      );
      sender.friendRequestsSent = sender.friendRequestsSent.filter(
          id => id.toString() !== receiverId.toString()
      );

      await receiver.save();
      await sender.save();

      res.status(200).json({ success: true, message: "Friend request declined" });
  } catch (error) {
      console.error("Error declining friend request:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getFriendRequests = async (req, res) => {
  try {
      const user = await User.findById(req.user._id)
          .populate("friendRequestsReceived", "name email alias profilePic");

      res.status(200).json({ friendRequests: user.friendRequestsReceived });
  } catch (error) {
      console.error("Error fetching friend requests:", error);
      res.status(500).json({ message: "Failed to fetch friend requests" });
  }
};

export const getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("friends", "name email alias profilePic");

        res.status(200).json({ friends: user.friends });
    } catch (error) {
        console.error("Error fetching friends list:", error);
        res.status(500).json({ message: "Failed to fetch friends list" });
    }
};

export const removeFriend = async (req, res) => {
    const userId = req.user._id;
    const { friendId } = req.body;
  
    try {
      if (!friendId) {
        return res.status(400).json({ success: false, message: "Friend ID is required" });
      }
  
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);
  
      if (!user || !friend) {
        return res.status(404).json({ success: false, message: "User or friend not found" });
      }
  
      // Remove each other from friends list
      user.friends = user.friends.filter(id => id.toString() !== friendId);
      friend.friends = friend.friends.filter(id => id.toString() !== userId.toString());
  
      await user.save();
      await friend.save();
  
      res.status(200).json({ success: true, message: "Friend removed successfully" });
    } catch (error) {
      console.error("Error removing friend:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  

// group creation

export const createGroup = async (req, res) => {
    try {
      const { name, members, groupPic } = req.body;
      const creatorId = req.user._id;
  
      // Validate input data
      if (!name || !members || members.length < 2) {
        return res.status(400).json({ message: "Group must have a name and at least 2 members." });
      }
  
      // Add creator to members if not already included
      const uniqueMembers = [...new Set([...members, creatorId.toString()])];
  
      const group = new Group({
        name,
        members: uniqueMembers,
        adminIds: [creatorId], // 👈 Only the creator is admin
        createdBy: creatorId, 
        isGroupChat: true,
        groupPic: groupPic || "/avatar/default.png",
      });
  
      const savedGroup = await group.save();
  
      res.status(201).json(savedGroup);
    } catch (error) {
      console.error("Create group error:", error);
      res.status(500).json({ message: "Server error creating group." });
    }
  };
  
export const addGroupMembers = async (req, res) => {
    try {
      const groupId = req.params.groupId;
      const { newMemberIds } = req.body;
      const userId = req.user._id; // The current user making the request
  
      if (!newMemberIds || !Array.isArray(newMemberIds) || newMemberIds.length === 0) {
        return res.status(400).json({ message: "No members provided." });
      }
  
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found." });
      }
  
      // Check if current user is an admin
      if (!group.adminIds.includes(userId.toString())) {
        return res.status(403).json({ message: "Only group admins can add members." });
      }
  
      // Prevent duplicates
      const currentMemberIds = group.members.map((id) => id.toString());
      const uniqueNewMembers = newMemberIds.filter(
        (id) => !currentMemberIds.includes(id.toString())
      );
  
      if (uniqueNewMembers.length === 0) {
        return res.status(400).json({ message: "All selected users are already in the group." });
      }
  
      // Add new members
      group.members.push(...uniqueNewMembers);
      await group.save();
  
      const updatedGroup = await Group.findById(groupId).populate("members", "username alias avatar");
  
      res.status(200).json(updatedGroup);
    } catch (error) {
      console.error("Add members error:", error);
      res.status(500).json({ message: "Server error adding members." });
    }
  };

export const getUserGroups = async (req, res) => {
    try {
    //   const userId = req.user._Id;
  
      const groups = await Group.find({ members: req.user._id }).populate("members", "alias profilePic");
  
      res.status(200).json(groups);
    } catch (error) {
      console.error("Get user groups error:", error);
      res.status(500).json({ message: "Server error fetching groups" });
    }
  };

// Promote member to admin
export const promoteToAdmin = async (req, res) => {
    try {
      const { groupId, memberId } = req.params;
      const userId = req.user._id;
  
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ error: "Group not found" });
  
      // Check if current user is an admin
      const isAdmin = group.adminIds.some((id) => id.toString() === userId.toString());
      if (!isAdmin) {
        return res.status(403).json({ error: "Only admins can promote a member" });
      }
  
      const isMember = group.members.some((m) => m.toString() === memberId);
      if (!isMember) return res.status(400).json({ error: "User is not a group member" });
  
      const alreadyAdmin = group.adminIds.some((id) => id.toString() === memberId);
      if (alreadyAdmin) return res.status(400).json({ error: "User is already an admin" });
  
      group.adminIds.push(memberId);
      await group.save();
  
      res.status(200).json({ message: "Member promoted to admin", group });
    } catch (error) {
      console.error("promoteToAdmin error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
export const demoteAdmin = async (req, res) => {
    try {
      const { groupId, userIdToDemote } = req.body;
      const requesterId = req.user._id;
  
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ message: "Group not found" });
  
      if (group.createdBy.toString() !== requesterId.toString()) {
        return res.status(403).json({ message: "Only the creator can demote admins" });
      }
  
      if (group.createdBy.toString() === userIdToDemote) {
        return res.status(400).json({ message: "Creator cannot be demoted" });
      }
  
      group.adminIds = group.adminIds.filter(
        (id) => id.toString() !== userIdToDemote
      );
  
      await group.save();
      res.status(200).json({ message: "Admin demoted successfully", group });
    } catch (err) {
      console.error("Demote admin error:", err);
      res.status(500).json({ message: "Server error while demoting admin" });
    }
  };

export const leaveGroup = async (req, res) => {
    try {
      const { groupId } = req.body;
      const userId = req.user._id;
  
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ message: "Group not found" });
  
      // Prevent the creator from leaving
      if (group.createdBy.toString() === userId.toString()) {
        return res.status(400).json({ message: "Group creator cannot leave the group." });
      }
  
      // Remove user from members
      group.members = group.members.filter(
        (id) => id.toString() !== userId.toString()
      );
  
      // Also remove from adminIds if they were an admin
      group.adminIds = group.adminIds.filter(
        (id) => id.toString() !== userId.toString()
      );
  
      await group.save();
      res.status(200).json({ message: "Left group successfully", group });
    } catch (err) {
      console.error("Leave group error:", err);
      res.status(500).json({ message: "Server error leaving group" });
    }
  };
  
// Remove member from group
export const removeMember = async (req, res) => {
    try {
      const { groupId, memberId } = req.params;
      const userId = req.user._id;
  
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ error: "Group not found" });
  
      const isAdmin = group.adminIds.includes(userId.toString());
      if (!isAdmin) {
        return res.status(403).json({ error: "Only admins can remove members" });
      }
  
      group.members = group.members.filter((id) => id.toString() !== memberId);
      group.adminIds = group.adminIds.filter((id) => id.toString() !== memberId);
  
      await group.save();
      res.status(200).json({ message: "Member removed", group });
    } catch (error) {
      console.error("removeMember error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  

// Delete group
export const deleteGroup = async (req, res) => {
    try {
      const { groupId } = req.params;
      const userId = req.user._id;
  
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ error: "Group not found" });
  
      // ✅ Only the group creator can delete it
      if (group.createdBy.toString() !== userId.toString()) {
        return res.status(403).json({ error: "Only the group creator can delete the group" });
      }
  
      await Group.findByIdAndDelete(groupId);
      res.status(200).json({ message: "Group deleted" });
    } catch (error) {
      console.error("deleteGroup error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  

