import pandas as pd
import numpy as np

# Charger le fichier JSON
df = pd.read_json("student_depression_dataset4.json")
print(df.columns)
print("✅ Données chargées depuis JSON")

# Ajouter une colonne ID commençant à 27901
df.insert(0, "id", range(27902, 27902 + len(df)))
"""
# Remplacer les valeurs non valides par NaN
df.replace(["N/A", "n/a", "--", "?", "", " "], np.nan, inplace=True)

# Supprimer les lignes complètement vides
df.dropna(how='all', inplace=True)

# Supprimer les doublons
df.drop_duplicates(inplace=True)

# Identifier automatiquement les colonnes numériques
for col in df.columns:
    df[col] = pd.to_numeric(df[col], errors='ignore')  # ne convertit que si possible

# Colonnes ordinales à encoder
ordinal_maps = {
    "Extracurricular_Involvement": {"Low": 1, "Moderate": 2, "High": 3},
    "Sleep_Quality": {"Poor": 1, "Average": 2, "Good": 3},
    "Physical_Activity": {"Low": 1, "Moderate": 2, "High": 3},
    "Diet_Quality": {"Poor": 1, "Average": 2, "Good": 3},
    "Social_Support": {"Low": 1, "Moderate": 2, "High": 3},
    "Substance_Use": {"Never": 0, "Occasionally": 1, "Frequently": 2},
    "Counseling_Service_Use": {"Never": 0, "Occasionally": 1, "Frequently": 2},
    "Family_History": {"No": 0, "Yes": 1},
    "Chronic_Illness": {"No": 0, "Yes": 1},
}

# Appliquer les mappings
for col, mapping in ordinal_maps.items():
    if col in df.columns:
        df[col] = df[col].map(mapping)

# Nettoyer les colonnes booléennes/Yes-No
bool_cols = ["Family_History", "Chronic_Illness"]
for col in bool_cols:
    if col in df.columns:
        df[col] = df[col].replace({"Yes": 1, "No": 0})

# Normaliser CGPA
if "CGPA" in df.columns:
    df["CGPA"] = df["CGPA"] * 2.5

# Supprimer les lignes avec trop de valeurs manquantes (> 40%)
df = df[df.isnull().mean(axis=1) < 0.4]

# Remplir les NaN restants avec la médiane (pour les colonnes numériques)
df.fillna(df.median(numeric_only=True), inplace=True)
"""
# Sauvegarder le fichier nettoyé au format JSON
df.to_json("student_depression_dataset4_clean.json", orient="records", indent=2)
print("✅ Nettoyage terminé et fichier sauvegardé sous 'Student_Depression_Dataset_Clean4.json'")
