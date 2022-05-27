const mongoose = require("mongoose");

const testSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

// The string "TestModel" specifies that data of this schema should be stored
// under the "testmodels" collection
const TestModel = mongoose.model("TestModel", testSchema);

module.exports = TestModel;
