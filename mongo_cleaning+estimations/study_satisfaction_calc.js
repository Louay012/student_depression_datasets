// 1. FIRST RUN THIS TO VERIFY CALCULATIONS (SAFE TEST)
db.student_depression_dataset.aggregate([
  {
    $addFields: {
      // Convert all required fields safely
      num_CGPA: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$CGPA", ""] }, null, "$CGPA"] }, 0] }},
      num_Sleep: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Sleep_Quality", ""] }, null, "$Sleep_Quality"] }, 0] }},
      num_Activity: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Physical_Activity", ""] }, null, "$Physical_Activity"] }, 0] }},
      num_Diet: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Diet_Quality", ""] }, null, "$Diet_Quality"] }, 0] }},
      num_Social: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Social_Support", ""] }, null, "$Social_Support"] }, 0] }},
      num_Extra: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Extracurricular_Involvement", ""] }, null, "$Extracurricular_Involvement"] }, 0] }},
      num_Stress: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Stress_Level", ""] }, null, "$Stress_Level"] }, 0] }},
      num_Depression: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Depression_Score", ""] }, null, "$Depression_Score"] }, 0] }},
      num_Anxiety: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Anxiety_Score", ""] }, null, "$Anxiety_Score"] }, 0] }},
      num_Financial: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Financial_Stress", ""] }, null, "$Financial_Stress"] }, 0] }},
      num_Substance: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Substance_Use", ""] }, null, "$Substance_Use"] }, 0] }}
    }
  },
  {
    $addFields: {
      Study_Satisfaction: {
        $round: [
          {
            $add: [
              { $multiply: [0.8, "$num_CGPA"] },
              { $multiply: [0.5, "$num_Sleep"] },
              { $multiply: [0.5, "$num_Activity"] },
              { $multiply: [0.5, "$num_Diet"] },
              { $multiply: [0.5, "$num_Social"] },
              { $multiply: [0.3, "$num_Extra"] },
              { $multiply: [-0.7, "$num_Stress"] },
              { $multiply: [-0.6, "$num_Depression"] },
              { $multiply: [-0.6, "$num_Anxiety"] },
              { $multiply: [-0.4, "$num_Financial"] },
              { $multiply: [-1.0, "$num_Substance"] }
            ]
          },
          1  // Round to 1 decimal place
        ]
      }
    }
  },
  { 
    $project: { 
      _id: 1,
      id: 1,
      Study_Satisfaction: 1,
      // Include original fields for verification:
      CGPA: 1,
      Sleep_Quality: 1,
      Physical_Activity: 1
    } 
  },
    // Test with 5 documents first

]).forEach(function(doc) {
  db.student_depression_dataset.updateOne(
    { _id: doc._id },
    { $set: { Study_Satisfaction: doc.Study_Satisfaction } }
  );
});
db.getCollection("student_depression_dataset").find({})