// 1. First run this to verify calculations
db.student_depression_dataset.aggregate([
  {
    $addFields: {
      // Safely convert all required fields
      num_SCL: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Semester_Credit_Load", ""] }, null, "$Semester_Credit_Load"] }, 0] }},
      num_Stress: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Stress_Level", ""] }, null, "$Stress_Level"] }, 0] }},
      num_Depression: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Depression_Score", ""] }, null, "$Depression_Score"] }, 0] }},
      num_Anxiety: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Anxiety_Score", ""] }, null, "$Anxiety_Score"] }, 0] }},
      num_Financial: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Financial_Stress", ""] }, null, "$Financial_Stress"] }, 0] }},
      num_Sleep: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Sleep_Quality", ""] }, null, "$Sleep_Quality"] }, 3] }},
      num_Social: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Social_Support", ""] }, null, "$Social_Support"] }, 0] }},
      num_Illness: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Chronic_Illness", ""] }, null, "$Chronic_Illness"] }, 0] }},
      num_CGPA: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$CGPA", ""] }, null, "$CGPA"] }, 0] }},
      num_Activity: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Physical_Activity", ""] }, null, "$Physical_Activity"] }, 0] }},
      num_Extra: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Extracurricular_Involvement", ""] }, null, "$Extracurricular_Involvement"] }, 0] }},
      num_Diet: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Diet_Quality", ""] }, null, "$Diet_Quality"] }, 0] }},
      num_Counseling: { $toDouble: { $ifNull: [{ $cond: [{ $eq: ["$Counseling_Service_Use", ""] }, null, "$Counseling_Service_Use"] }, 0] }}
    }
  },
  {
    $addFields: {
      Academic_Pressure: {
        $round: [
          {
            $add: [
              { $multiply: [0.5, "$num_SCL"] },
              { $multiply: [1.0, "$num_Stress"] },
              { $multiply: [0.8, "$num_Depression"] },
              { $multiply: [0.8, "$num_Anxiety"] },
              { $multiply: [0.6, "$num_Financial"] },
              { $multiply: [0.5, { $subtract: [3, "$num_Sleep"] }] },
              { $multiply: [0.5, { $subtract: [3, "$num_Social"] }] },
              { $multiply: [0.3, "$num_Illness"] },
              { $multiply: [-0.4, "$num_CGPA"] },
              { $multiply: [-0.3, "$num_Activity"] },
              { $multiply: [-0.3, "$num_Extra"] },
              { $multiply: [-0.3, "$num_Diet"] },
              { $multiply: [-0.5, "$num_Counseling"] }
            ]
          },
          1 // Round to 1 decimal place
        ]
      }
    }
  },
  { 
    $project: { 
      _id: 1,
      id: 1,
      Academic_Pressure: 1,
      // Include original fields for verification if needed
      Semester_Credit_Load: 1,
      Stress_Level: 1,
      Depression_Score: 1
    } 
  },
  // Remove to process all documents
]).forEach(function(doc) {
  db.student_depression_dataset.updateOne(
    { _id: doc._id },
    { $set: { Academic_Pressure: doc.Academic_Pressure } }
  );
});
db.getCollection("student_depression_dataset").find({})
