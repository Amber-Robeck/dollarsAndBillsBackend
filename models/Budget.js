const { Schema, model } = require('mongoose');

const budgetSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        match: [/^[0-9]*$/, "Not a number!"]
    },
    expenses: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Expense',
        },
    ],
});

const Budget = model('Budget', budgetSchema);

module.exports = Budget;