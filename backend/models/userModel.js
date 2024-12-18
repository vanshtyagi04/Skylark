import mongoose from 'mongoose';
import bcrypt from "bcrypt"


const userSchema = mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        minLength: 6,
        required: true,
    },
    profilePic:{
        type: String,
        default: "",
    },
    followers:{
        type: [String],
        default: [],
    },
    following:{
        type: [String],
        default: [],
    },
    bio:{
        type: String,
        default: "",
    }
}, {
    timestamps: true,
});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) {
        next();
    }

    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User',userSchema);
export default User;