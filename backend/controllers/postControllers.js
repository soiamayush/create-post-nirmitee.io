const Post = require("../models/post")
const ErrorHandler =  require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError")
const cloudinary = require("cloudinary");
const APIFeatures = require("../utils/apiFeatures");


//create new blog => api/vi/blog/new
exports.newPost = catchAsyncError(async (req, res, next) => {


//     let images = []
//     if (typeof req.body.images === 'string') {
//         images.push(req.body.images)
//     } else {
//         images = req.body.images
//     }

//     let imagesLinks = [];

//     for (let i = 0; i < images.length; i++) {
//         const result = await cloudinary.v2.uploader.upload(images[i], {
//             folder: 'blogs'
//         });

//         imagesLinks.push({
//             public_id: result.public_id,
//             url: result.secure_url
//         })
//     }


// req.body.images = imagesLinks
req.body.user = req.user.id;	

const post = await Post.create(req.body);

     res.status(201).json({
         success: true,
         post
     })

})

//get all blogs => api/v1/blogs?keywords=fest

exports.getPost =  catchAsyncError (async ( req, res, next) => {

    const resPerPage = 100;   //resultd showing per page
    const postsCount = await Post.countDocuments();


    const apiFeatures = new APIFeatures(Post.find(), req.query)
	.search()
	.filter();
 
let posts = await apiFeatures.query;
let filteredPostsCount = posts.length;
 
apiFeatures.pagination(resPerPage);
posts = await apiFeatures.query.clone();
    res.status(200).json({
        success : true,
        postsCount,
        resPerPage,
        filteredPostsCount, 
        posts
    })
});



//get single blog with id => api/v1/blog/:id

exports.getSinglePost = catchAsyncError (async  (req, res, next) => {

    const post = await Post.findById(req.params.id);

    if(!post){
        return next(new ErrorHandler("post not found", 404))
    }

    res.status(200).json({
        success : true,
        // resPerPage,
        post
    })
})

//updating blog admin route
exports.updatePost = catchAsyncError (async  (req, res, next) => {

    let post = await Post.findById(req.params.id);

    if(!post){
        return next(new ErrorHandler("post not found", 404))
    }

    let images = []
		if (typeof req.body.images === 'string') {
			images.push(req.body.images)
		} else {
			images = req.body.images
		}

        if(images !== undefined){
             //handling delete images of blog
    for(let i = 0; i <post.images.length ; i++){
        const result = cloudinary.v2.uploader.destroy(post.images[i].public_id)
    }

    let imagesLinks = [];
	
		for (let i = 0; i < images.length; i++) {
			const result = await cloudinary.v2.uploader.upload(images[i], {
				folder: 'posts'
			});
	
			imagesLinks.push({
				public_id: result.public_id,
				url: result.secure_url
			})
		}


	req.body.images = imagesLinks
        }
	
		
    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true,
    })

    res.status(200).json({
        success : true,
        post
    })
})

//delete blog  :  api/v1/admin/blog/:id

exports.deletePost = catchAsyncError (async (req, res, next) => {
    const post = await Post.findById(req.params.id);


    if(!post){
        return res.status(404).json({
            success : false,
            message : "post not found"
        })
    };

   

    await post.deleteOne();
    res.status(200).json({
        success : true,
        message : "post is deleted."
    })
})

// Create new review   =>   /api/v1/review
exports.createPostComment = catchAsyncError(async (req, res, next) => {
    const { rating, coment, postId } = req.body
  
    const comment = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      coment,
    }
  
    const post = await Post.findById(postId)
  
    const isCommented = post.comments.find(
      (r) => r.user.toString() === req.user._id.toString(),
    )
  
    if (isCommented) {
      post.comments.forEach((comment) => {
        if (comment.user.toString() === req.user._id.toString()) {
          comment.comment = comment
          comment.rating = rating
        }
      })
    } else {
      post.comments.push(comment)
      post.numOfComments = post.comments.length
    }
  
    post.ratings =
      post.comments.reduce((acc, item) => item.rating + acc, 0) /
      post.comments.length
  
    await post.save({ validateBeforeSave: false })
  
    res.status(200).json({
      success: true,
    })
  })
  
  
//get blog reviews => api/v1/reviews

exports.getPostComment = catchAsyncError (async (req, res, next) => {
    const post = await Post.findById(req.query.id);

    res.status(200).json({
        success:true,
        comments : post.comments
    })
})



exports.deletePostComment = catchAsyncError (async (req, res, next) => {
    const post = await Post.findById(req.query.postId);

    const comments = post.comments.filter(comment => comment._id.toString() !== req.query.id.toString());

    const numOfComments = comments.length;
    
    const ratings = post.comments.reduce((acc, item) => item.rating + acc, 0) / comments.length;

    await Post.findByIdAndUpdate(req.query.postId, {
        comments,
        ratings,
        numOfComments
    }, {
        new : true,
        runValidators : true,
        useFindAndModify : false
    })

    res.status(200).json({
        success:true,
    })
})
    