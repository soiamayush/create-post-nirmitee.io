const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true , "Please enter title of your post"],
        trim : true,
        maxlength : [50, "post title cannot be exceed 50 characters"]
    },
    description : {
        type : String,
        required : [true , "Please enter post description"],
    },
    images : [
        {
            public_id : {
                type : String,
                required : true
            },
            url: {
                type : String,
                required : true
            },
        }
    ],
  
    numOfComments : {
        type : Number,
        default : 0,
    },
    comments : [
       { 
        user : {
            type : mongoose.Schema.ObjectId, 
            ref : "User",
            required : true
        },
           name : {
            type : String,
            required : true,
        },

        rating : {
            type : Number,
            required : true,
        },
        comment : {
            type : String,
            required : true,
        }
    }
    ],

    user : {
        type : mongoose.Schema.ObjectId, 
        ref : "User",
        required : true
    },
    
    createdAt : {
        type : Date,
        default : Date.now,
    }
})

module.exports = mongoose.model("post", postSchema );