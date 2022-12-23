const { Schema, model } = require('mongoose');

const expenseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        match: [/^[0-9]*$/, "Not a number!"]
    },
    description: {
        type: String,
        required: true,
        maxlength: 280,
    },
    userId: 
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
});

const Expense = model('Expense', expenseSchema);

module.exports = Expense;