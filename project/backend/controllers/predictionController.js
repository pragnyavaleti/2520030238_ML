const { db } = require('../config/firebase');
const mlService = require('../services/mlService');

exports.predictYield = async (req, res, next) => {
  try {
    const {
      year,
      state,
      crop,
      season,
      area,
      production,
      annualRainfall,
      fertilizer,
      pesticide,
      model,
      mode
    } = req.body;

    // Strict validation
    if (!year || !state || !crop || !season) {
      return res.status(400).json({
        success: false,
        message: 'Missing required categorical fields: year, state, crop, and season are mandatory.'
      });
    }

    if (area === undefined || area === null || parseFloat(area) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Cultivated Area must be a positive number greater than 0.'
      });
    }

    if (production !== undefined && production !== null && production !== '' && (isNaN(production) || parseFloat(production) < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Production must be a non-negative number if provided.'
      });
    }

    if (annualRainfall === undefined || annualRainfall === null || parseFloat(annualRainfall) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Annual Rainfall must be a non-negative number.'
      });
    }

    const areaVal = parseFloat(area);
    const prodVal = (production !== undefined && production !== null && production !== '') ? parseFloat(production) : null;
    const requestedMode = (mode || 'single').toLowerCase();
    const requestedModel = model || 'xgboost';

    // Prepare payload for ML Service
    const mlPayload = {
      year: parseInt(year),
      state: state.trim(),
      crop: crop.trim(),
      season: season.trim(),
      area: areaVal,
      production: prodVal,
      annualRainfall: parseFloat(annualRainfall),
      fertilizer: parseFloat(fertilizer) || 0,
      pesticide: parseFloat(pesticide) || 0,
      model: requestedModel,
      mode: requestedMode
    };

    // 1. Call ML Service
    const mlResult = await mlService.predict(mlPayload);
    const estimatedProd = mlResult.estimated_production ?? (Math.round(mlResult.predicted_yield * areaVal * 100) / 100);
    const isSingle = (mlResult.mode === 'single') || (requestedMode === 'single' && (!mlResult.all_predictions || mlResult.all_predictions.length === 0));

    // 2. Prepare document for Firebase Firestore collection 'predictions'
    let predictionDoc;
    if (isSingle) {
      predictionDoc = {
        mode: 'single',
        year: mlPayload.year,
        state: mlPayload.state,
        crop: mlPayload.crop,
        season: mlPayload.season,
        area: mlPayload.area,
        production: prodVal ?? estimatedProd,
        estimatedProduction: estimatedProd,
        annualRainfall: mlPayload.annualRainfall,
        fertilizer: mlPayload.fertilizer,
        pesticide: mlPayload.pesticide,
        predictedYield: mlResult.predicted_yield,
        modelUsed: mlResult.model_used,
        modelKey: mlResult.model_key || requestedModel,
        metrics: mlResult.metrics || null,
        productivityPercentage: mlResult.productivity_percentage ?? 100.0,
        yieldCategory: mlResult.yield_category || 'Moderate',
        advisory: mlResult.advisory || '',
        createdAt: new Date().toISOString()
      };
    } else {
      predictionDoc = {
        mode: 'compare',
        year: mlPayload.year,
        state: mlPayload.state,
        crop: mlPayload.crop,
        season: mlPayload.season,
        area: mlPayload.area,
        production: prodVal ?? estimatedProd,
        estimatedProduction: estimatedProd,
        annualRainfall: mlPayload.annualRainfall,
        fertilizer: mlPayload.fertilizer,
        pesticide: mlPayload.pesticide,
        predictedYield: mlResult.predicted_yield,
        modelUsed: mlResult.model_used,
        bestModelName: mlResult.best_model_name || mlResult.model_used,
        productivityPercentage: mlResult.productivity_percentage ?? 100.0,
        selectionRationale: mlResult.selection_rationale || 'Algorithm with the highest predicted crop yield was selected as the Best Algorithm.',
        allPredictions: mlResult.all_predictions || [],
        yieldCategory: mlResult.yield_category || 'Moderate',
        advisory: mlResult.advisory || '',
        createdAt: new Date().toISOString()
      };
    }

    // 3. Save to Firebase Firestore
    const docRef = await db.collection('predictions').add(predictionDoc);

    return res.status(201).json({
      success: true,
      message: isSingle
        ? `${predictionDoc.modelUsed} prediction generated successfully and recorded.`
        : 'All algorithms compared successfully and recorded in database.',
      data: {
        id: docRef.id,
        ...predictionDoc
      }
    });

  } catch (error) {
    next(error);
  }
};
