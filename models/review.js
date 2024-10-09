import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
    turf : {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:'Turf'
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'  
    },
    content: {
      type: String,
      required: true,
      trim: true  
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });
  const Review = mongoose.model('Review',reviewSchema)
  export default Review;
  