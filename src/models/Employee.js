const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 120,
    },
    position: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    salary: {
      type: Number,
      required: true,
      min: 0.01,
    },
    date_of_joining: {
      type: Date,
      required: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

employeeSchema.index({ user: 1, email: 1 }, { unique: true });

employeeSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
