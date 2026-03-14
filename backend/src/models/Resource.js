const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  subject: String,
  grade: String,
  curriculumTags: [String],
  files: [
    {
      url: String,
      filename: String,
      mimeType: String
    }
  ],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  downloads: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  forkFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', default: null },
  forkCount: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  verifiedAt: { type: Date },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verificationNotes: { type: String },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// text index to support simple search over title, description and tags
ResourceSchema.index({ title: 'text', description: 'text', curriculumTags: 'text' });

module.exports = mongoose.model('Resource', ResourceSchema);
