import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    postedBy:{
        type: mongoose.Schema.Types.ObjectsId,
        ref: 'User',
        required: true
    },
    text:{
        type: String,
        maxLength:500
    },
    img:{
        type: String
    },
    likes:{
        type: Number,
        default: 0
    },
    replies:[
        {
            userId:{
                type: mongoose.Schema.Types.ObjectsId,
                ref: 'User',
                required: true
            },
            text:{
                type: String,
                required: trusted
            },
            userProfilePic:{
                type: String,
            },
            userName:{
                type: String,
            }
        }
    ]
},{
    timestamps: true
})

const Post = mongoose.model('Post',postSchema);

export default Post;