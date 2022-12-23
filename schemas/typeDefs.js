const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        password: String
        budgets: [Budget]!
    }

    type Budget {
        _id: ID
        name: String
        amount: Int
        expenses: [Expense]!
    }

    type Expense {
        _id: ID
        name: String
        amount: Int
        description: String
        userId: User
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        users: [User]
        user(username: String!): User
        budgets(username: String): [Budget]
        budget(budgetId: ID!): Budget
        expenses: [Expense]
        expense(expenseId: ID!): Expense
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        addBudget(name: String!, amount: Int): Budget
        addExpense(budgetId: ID!, name: String!, description: String!, amount: Int!): Expense
        removeBudget(budgetId: ID!): Budget
        removeExpense(expenseId: ID!): Expense
        updateExpense(expenseId: ID!, name: String!, description: String!, amount: Int!): Expense
        
    }
`;
module.exports = typeDefs;

