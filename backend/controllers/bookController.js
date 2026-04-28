import bookModel from "../models/bookModel.js";

// Get all books
export const getAllBooks = async (req, res) => {
  try {
    const { type, category, search } = req.query;

    const filter = {};

    // Filter by type
    if (type) {
      filter.type = type;
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Search by name or author (case-insensitive)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    const books = await bookModel.find(filter).sort({ createdAt: -1 });

    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Check availability
export const searchBooks = async (req, res) => {
  try {
    const { name, author } = req.query;

    const filter = {};

    // Search by book name (case-insensitive)
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    // Search by author (case-insensitive)
    if (author) {
      filter.author = { $regex: author, $options: "i" };
    }

    const books = await bookModel.find(filter).sort({ createdAt: -1 });

    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get book names for dropdown
export const getBookList = async (req, res) => {
  try {
    const books = await bookModel
      .find({}, "name author serialNo availableQty status")
      .sort({ name: 1 });

    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add book (admin only)
export const addBook = async (req, res) => {
  try {
    const { name, author, category, type, cost, procurementDate, quantity } =
      req.body;

    // Validation
    if (!name || !author || !category || !type || !cost || !procurementDate) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Generate Serial Number
    const count = await bookModel.countDocuments({ type, category });

    const prefix = `${category
      .substring(0, 2)
      .toUpperCase()}${type === "book" ? "B" : "M"}`;

    const serialNo = `${prefix}${String(count + 1).padStart(6, "0")}`;

    // Quantity handling
    const qty = quantity || 1;

    const book = new bookModel({
      serialNo,
      name,
      author,
      category,
      type,
      cost,
      procurementDate,
      quantity: qty,
      availableQty: qty,
    });

    await book.save();

    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Update book (admin only)
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await bookModel.findByIdAndUpdate(id, req.body, {
      new: true, // return updated document
      runValidators: true, // apply schema validation
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
