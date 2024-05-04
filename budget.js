const express = require("express");
const router = express.Router();
const { Expense, Category } = require("./models/db");


router.post("/budget", async (req, res) => {
  try {
    const { userId, name, allocatedAmount } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    await Category.create({ name, allocatedAmount, userId });

    res.status(200).json({ message: "Category added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/allBudget", async (req, res) => {
  try {
    let userId = req.user.id
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing", });
    }

    const categories = await Category.find({ userId: userId });
    res.status(200).json({ message: "Categories get successfully", categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/deleteBudget", async (req, res) => {
  try {
    const userId = req.user.id;
    const categoryId = req.headers["categoryid"]
    if (!userId || !categoryId) {
      return res
        .status(400)
        .json({ message: "User ID or categoryId ID is missing" });
    }
    let result = await Expense.find({ categoryId: categoryId });
    if (result && result.length) {
      return res
        .status(206)
        .json({ message: "Can't delete , Category already used by expense" });
    }
    await Category.deleteOne({ _id: categoryId });
    res
      .status(200)
      .json({ message: "category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


router.post("/addExpense", async (req, res) => {
  try {
    const { userId, _id, description, amount, date, categoryId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }
    const newExpense = new Expense({
      description,
      amount,
      date,
      categoryId,
      userId
    });
    savedExpense = await newExpense.save();
    res.status(200).json({ message: "Expense added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/allExpense", async (req, res) => {
  try {
    let userId = req.user.id
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing", });
    }

    const expenses = await Expense.find({ userId: userId });
    res.status(200).json({ message: "Expenses get successfully", expenses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/deleteExpense", async (req, res) => {
  try {
    const expenseId = req.headers["expenseid"]

    if (!expenseId) {
      return res.status(400).json({ message: "Expense ID is missing" });
    }

    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await Expense.deleteOne({ _id: expenseId });


    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
