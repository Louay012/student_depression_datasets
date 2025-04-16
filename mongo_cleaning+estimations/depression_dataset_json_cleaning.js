db.getCollection("student_depression_dataset").find().forEach(function(doc) {
  const updates = {}; // Initialize updates at the beginning of each document processing

  if ("Gender" in doc && doc.Gender) {
    const gender = String(doc.Gender).toLowerCase();
    const newGender =
      gender === "male" ? "M" :
      gender === "female" ? "F" :
      doc.Gender;

    if (newGender !== doc.Gender) {
      updates["Gender"] = newGender;
    }
  }

  // Encoder Yes/No en booléens
  const boolMap = { "Yes": 1, "No": 0 };

  if ("Family_History" in doc) {
    if (typeof doc.Family_History === 'string') {
      updates["Family_History"] = boolMap[doc.Family_History] ?? doc.Family_History;
    } else {
      updates["Family_History"] = doc.Family_History; // Keep the original value if not a string
    }
  }

  if ("Chronic_Illness" in doc) {
    if (typeof doc.Chronic_Illness === 'string') {
      updates["Chronic_Illness"] = boolMap[doc.Chronic_Illness] ?? doc.Chronic_Illness;
    } else {
      updates["Chronic_Illness"] = doc.Chronic_Illness; // Keep the original value if not a string
    }
  }

  // Ordinales à encoder
  const ordinalMaps = {
    "Extracurricular_Involvement": { "Low": 1, "Moderate": 2, "High": 3 },
    "Sleep_Quality": { "Poor": 1, "Average": 2, "Good": 3 },
    "Physical_Activity": { "Low": 1, "Moderate": 2, "High": 3 },
    "Diet_Quality": { "Poor": 1, "Average": 2, "Good": 3 },
    "Social_Support": { "Low": 1, "Moderate": 2, "High": 3 },
    "Substance_Use": { "Never": 0, "Occasionally": 1, "Frequently": 2 },
    "Counseling_Service_Use": { "Never": 0, "Occasionally": 1, "Frequently": 2 },
  };

  for (let field in ordinalMaps) {
    if (doc[field]) {
      updates[field] = ordinalMaps[field][doc[field]] ?? doc[field];
    }
  }

  // CGPA normalisé
  if ("CGPA" in doc) {
    updates["CGPA"] = doc.CGPA / 2.5;
  }

  // Ajout du niveau de dépression
  const depressionScore = doc.Depression_Score ?? 0;
  updates["Depression"] = depressionScore > 0 ? 1 : 0;

    if ("CGPA" in doc) {
  updates["CGPA"] = parseFloat(doc.CGPA.toFixed(2)); // Ensures 2 decimal places
}
  // Mettre à jour le document only if there are updates
  if (Object.keys(updates).length > 0) {
    db.getCollection("student_depression_dataset").updateOne({ _id: doc._id }, { $set: updates });
  }
});



db.getCollection("student_depression_dataset").find({})
