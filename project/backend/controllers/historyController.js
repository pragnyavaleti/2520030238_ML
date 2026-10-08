const { db } = require('../config/firebase');

/**
 * Retrieve prediction records from Firebase Firestore with filtering and search
 */
exports.getHistory = async (req, res, next) => {
  try {
    const { search, state, crop, model } = req.query;

    const snapshot = await db.collection('predictions').get();
    let records = [];

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      records.push({
        id: doc.id,
        ...data
      });
    });

    // Sort by createdAt descending (newest first)
    records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply filters
    if (state && state !== 'All') {
      records = records.filter(r => r.state && r.state.toLowerCase() === state.toLowerCase());
    }

    if (crop && crop !== 'All') {
      records = records.filter(r => r.crop && r.crop.toLowerCase() === crop.toLowerCase());
    }

    if (model && model !== 'All') {
      records = records.filter(r => {
        if (!r.modelUsed) return false;
        return r.modelUsed.toLowerCase().includes(model.toLowerCase());
      });
    }

    // Apply search query (state or crop)
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      records = records.filter(r => 
        (r.state && r.state.toLowerCase().includes(q)) ||
        (r.crop && r.crop.toLowerCase().includes(q)) ||
        (r.modelUsed && r.modelUsed.toLowerCase().includes(q))
      );
    }

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Delete a prediction record from Firestore by ID
 */
exports.deletePrediction = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Prediction ID is required.'
      });
    }

    await db.collection('predictions').doc(id).delete();

    return res.status(200).json({
      success: true,
      message: `Prediction with ID ${id} was deleted successfully.`
    });

  } catch (error) {
    next(error);
  }
};
