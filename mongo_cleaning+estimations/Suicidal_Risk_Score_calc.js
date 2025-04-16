// 1. FIRST RUN THIS TO VERIFY CALCULATIONS
db.student_depression_dataset.aggregate([
  {
    $addFields: {
      // Safely convert all required fields with clinical defaults
      num_Depression: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Depression_Score", ""] }, null, "$Depression_Score"] }, 0] }},
      num_Anxiety: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Anxiety_Score", ""] }, null, "$Anxiety_Score"] }, 0] }},
      num_Stress: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Stress_Level", ""] }, null, "$Stress_Score"] }, 0] }},
      num_Substance: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Substance_Use", ""] }, null, "$Substance_Use"] }, 0] }},
      num_Sleep: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Sleep_Quality", ""] }, null, "$Sleep_Quality"] }, 3] }}, // Default to mid-range
      num_Social: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Social_Support", ""] }, null, "$Social_Support"] }, 0] }},
      num_History: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Family_History", ""] }, null, "$Family_History"] }, 0] }},
      num_Illness: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Chronic_Illness", ""] }, null, "$Chronic_Illness"] }, 0] }},
      num_Counseling: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Counseling_Service_Use", ""] }, null, "$Counseling_Service_Use"] }, 0] }}
    }
  },
  {
    $addFields: {
      // Clinical risk calculation (weights based on research)
      Suicidal_Risk_Score: {
        $round: [
          {
            $add: [
              { $multiply: [1.5, "$num_Depression"] },      // Strongest predictor
              { $multiply: [1.2, "$num_Anxiety"] },
              { $multiply: [0.8, "$num_Stress"] },
              { $multiply: [0.7, "$num_Substance"] },
              { $multiply: [0.6, { $subtract: [3, "$num_Sleep"] }] }, // Inverse: poor sleep increases risk
              { $multiply: [0.5, { $subtract: [3, "$num_Social"] }] }, // Inverse: low support increases risk
              { $multiply: [0.5, "$num_History"] },        // Family history
              { $multiply: [0.3, "$num_Illness"] },
              { $multiply: [-0.6, "$num_Counseling"] }     // Protective factor
            ]
          },
          1  // Round to 1 decimal place
        ]
      }
    }
  },
  {
    $addFields: {
      // Binary classification (1=at risk, 0=not at risk)
      Suicidal_Thoughts_Risk: {
        $cond: [
          { $gte: ["$Suicidal_Risk_Score", 4.5] },  // Clinical threshold
          1,
          0
        ]
      }
    }
  },
  { 
    $project: { 
      _id: 1,
      id: 1,
      Suicidal_Risk_Score: 1,
      Suicidal_Thoughts_Risk: 1,
      // Include original fields for verification:
      Depression_Score: 1,
      Anxiety_Score: 1,
      Substance_Use: 1,
      Sleep_Quality: 1
    } 
  },



]).forEach(function(doc) {
  db.student_depression_dataset.updateOne(
    { _id: doc._id },
    { 
      $set: { 
        Suicidal_Risk_Score: doc.Suicidal_Risk_Score,
        Suicidal_Thoughts_Risk: doc.Suicidal_Thoughts_Risk
      } 
    }
  );
});
db.getCollection("student_depression_dataset").find({})