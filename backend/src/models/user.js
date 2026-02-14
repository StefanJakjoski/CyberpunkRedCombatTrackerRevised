import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// format for users to store in database
const userFormat = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["default", "admin"], default: "default" },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

// password hashing before we save it
// pre("save") comes before saving
userFormat.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

// define custom method for comparing passwords
userFormat.methods.comparePassword = async function(unhashed){
    return bcrypt.compare(unhashed, this.password);
};

export default mongoose.model("User", userFormat);