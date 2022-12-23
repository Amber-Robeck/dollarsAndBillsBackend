const { AuthenticationError } = require('apollo-server-express');
const { User, Budget, Expense } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async () => {
            return User.find().populate({ path: 'budgets', populate: 'expenses' });
        },
        user: async (parent, { username }) => {
            return User.findOne({ username }).populate({ path: 'budgets', populate: 'expenses' });
        },
        budgets: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Budget.find(params).populate('expenses').sort({ createdAt: -1 });
        },
        budget: async (parent, { budgetId }) => {
            return Budget.findOne({ _id: budgetId }).populate('expenses');
        },
        expenses: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Expense.find(params).sort({ createdAt: -1 });
        },
        expense: async (parent, { expenseId }) => {
            return Expense.findOne({ _id: expenseId });
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password.');
            }

            const token = signToken(user);

            return { token, user };
        },
        addBudget: async (parent, { name, amount }, context) => {
            if (context.user) {
                const budget = await Budget.create({
                    name,
                    amount,
                });

                await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { budgets: budget._id } }
                );

                return budget;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        addExpense: async (parent, { name, amount, description, budgetId }, context) => {
            if (context.user) {
                const expense = await Expense.create({ name, amount, description });

                await Budget.findOneAndUpdate(
                    { _id: budgetId },
                    { $addToSet: { expenses: expense._id } }
                );

                return expense;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeBudget: async (parent, { budgetId }, context) => {
            if (context.user) {
                const budget = await Budget.findOneAndDelete({
                    _id: budgetId
                });

                await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { budgets: budget._id } }
                );

                return budget;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeExpense: async (parent, { expenseId }, context) => {
            if (context.user) {
                return Expense.deleteOne(
                    { _id: expenseId },
                );
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        updateExpense: async (parent, { name, amount, description, expenseId }, context) => {
            if (context.user) {
                const expense = await Expense.findOneAndUpdate({ _id: expenseId }, { name, amount, description });

                return expense;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },
};

module.exports = resolvers;
