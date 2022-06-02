const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.verifyPassword = function(passwordProvided) {
  // `this` refers to the document object
  return bcrypt.compare(passwordProvided, this.password);
};

userSchema.pre("save", async function(next) {
  // if the password path hasn't changed, then no need to hash
  if (!this.isModfied("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
