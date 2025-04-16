db.student_depression_dataset.aggregate([
  // Stage 1: Safely convert all required fields to numbers
  {
    $addFields: {
      // Convert each field with proper null/empty string handling
      num_Semester_Credit_Load: {
        $toDouble: {
          $ifNull: [
            { $cond: [{ $eq: ["$Semester_Credit_Load", ""] }, null, "$Semester_Credit_Load"] },
            0
          ]
        }
      },
      num_Stress_Level: {
        $toDouble: {
          $ifNull: [
            { $cond: [{ $eq: ["$Stress_Level", ""] }, null, "$Stress_Level"] },
            0
          ]
        }
      },
      num_CGPA: {
        $toDouble: {
          $ifNull: [
            { $cond: [{ $eq: ["$CGPA", ""] }, null, "$CGPA"] },
            0
          ]
        }
      },
      num_Extracurricular: {
        $toDouble: {
          $ifNull: [
            { $cond: [{ $eq: ["$Extracurricular_Involvement", ""] }, null, "$Extracurricular_Involvement"] },
            0
          ]
        }
      },
      num_Physical_Activity: {
        $toDouble: {
          $ifNull: [
            { $cond: [{ $eq: ["$Physical_Activity", ""] }, null, "$Physical_Activity"] },
            0
          ]
        }
      },
      num_Sleep_Quality: {
        $toDouble: {
          $ifNull: [
            { $cond: [{ $eq: ["$Sleep_Quality", ""] }, null, "$Sleep_Quality"] },
            3
          ]
        }
      },
      num_Substance_Use: {
        $toDouble: {
          $ifNull: [
            { $cond: [{ $eq: ["$Substance_Use", ""] }, null, "$Substance_Use"] },
            0
          ]
        }
      },
      num_Social_Support: {
        $toDouble: {
          $ifNull: [
            { $cond: [{ $eq: ["$Social_Support", ""] }, null, "$Social_Support"] },
            0
          ]
        }
      },
      num_Chronic_Illness: {
        $toDouble: {
          $ifNull: [
            { $cond: [{ $eq: ["$Chronic_Illness", ""] }, null, "$Chronic_Illness"] },
            0
          ]
        }
      }
    }
  },
  
  // Stage 2: Calculate Estimated_Study_Hours
  {
    $addFields: {
      Estimated_Study_Hours: {
        $round: [
          {
            $max: [
              0,
              {
                $min: [
                  40,
                  {
                    $add: [
                      { $multiply: [1.2, "$num_Semester_Credit_Load"] },
                      { $multiply: [0.5, "$num_Stress_Level"] },
                      { $multiply: [0.6, "$num_CGPA"] },
                      { $multiply: [-0.7, "$num_Extracurricular"] },
                      { $multiply: [-0.5, "$num_Physical_Activity"] },
                      { $multiply: [-0.4, { $subtract: [3, "$num_Sleep_Quality"] }] },
                      { $multiply: [-1.0, "$num_Substance_Use"] },
                      { $multiply: [-0.3, "$num_Social_Support"] },
                      { $multiply: [-1.0, "$num_Chronic_Illness"] }
                    ]
                  }
                ]
              }
            ]
          },
          1
        ]
      }
    }
  },
  
  // Stage 3: Project only the fields we want in the output
  {
    $project: {
      _id: 1,
      id: 1,
      Estimated_Study_Hours: 1,
      // Include original fields if needed
      Semester_Credit_Load: 1,
      Stress_Level: 1,
      CGPA: 1
    }
  }
]).forEach(function(doc) {
  db.student_depression_dataset.updateOne(
    { _id: doc._id },
    { $set: { Estimated_Study_Hours: doc.Estimated_Study_Hours } }
  );
});