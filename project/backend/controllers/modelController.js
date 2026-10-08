const mlService = require('../services/mlService');

exports.getModelResults = async (req, res, next) => {
  try {
    const results = await mlService.getModelResults();
    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

exports.getBestModel = async (req, res, next) => {
  try {
    const bestModel = await mlService.getBestModel();
    return res.status(200).json({
      success: true,
      data: bestModel
    });
  } catch (error) {
    next(error);
  }
};

exports.getEdaStats = async (req, res, next) => {
  try {
    const edaStats = await mlService.getEdaStats();
    return res.status(200).json({
      success: true,
      data: edaStats
    });
  } catch (error) {
    next(error);
  }
};
