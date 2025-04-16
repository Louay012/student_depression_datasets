import pandas as pd
import numpy as np

# Charger le fichier CSV
df = pd.read_csv("student_depression_dataset1.csv")
print(df)
#df['id'] = range(1, len(df) + 1)
# Remplacer les valeurs non valides par NaN
"""df.replace(["N/A", "n/a", "--", "?"], np.nan, inplace=True)
# Nettoyer d'abord les valeurs de "Sleep Duration" avant de les convertir
if 'Sleep Duration' in df.columns:
    df['Sleep Duration'] = df['Sleep Duration'].apply(lambda x: str(x).strip().lower())  # Strip and lower case all values
    df['Sleep Duration'] = df['Sleep Duration'].replace({
        "7-8 hours": 7.5, "6-7 hours": 6.5, "5-6 hours": 5.5, "8-9 hours": 8.5,
        "less than 5 hours": 4.5, "more than 8 hours": 8.5,
        "less than 6 hours": 5.5, "less than 7 hours": 6.5,
        "less than 8 hours": 7.5, "less than 9 hours": 8.5,
        "more than 5 hours": 5.5, "more than 6 hours": 6.5,
        "more than 7 hours": 7.5, "more than 9 hours": 9
    })
if 'Dietary Habits' in df.columns:
    df['Dietary Habits'] = df['Dietary Habits'].replace({
        'Unhealthy': 1, 'Moderate': 2, 'Healthy': 3
    })
# Colonnes booléennes → convertir en 0/1
bool_cols = ["Have you ever had suicidal thoughts ?", "Family History of Mental Illness", ]
for col in bool_cols:
    if col in df.columns:
        df[col] = df[col].apply(lambda x: 1 if str(x).strip().lower() in ['yes', 'true'] else 0)   
# Convertir les colonnes numériques
float_cols = [
    "Age", "Academic Pressure", "Work Pressure", "CGPA",
    "Study Satisfaction", "Job Satisfaction", "Sleep Duration",
    "Work/Study Hours", "Financial Stress"
]
for col in float_cols:
    df[col] = pd.to_numeric(df[col], errors='coerce')



# Supprimer les lignes vides
df.dropna(how='all', inplace=True)

# Supprimer les doublons éventuels
df.drop_duplicates(inplace=True)

df['Age'] = df['Age'].astype(str).str.replace(' ', '', regex=True)

# Convertir la colonne 'Age' en entier (int)
df['Age'] = pd.to_numeric(df['Age'], errors='coerce').fillna(0).astype(int)

# Remplace les valeurs non numériques par NaN
df['Financial Stress'] = pd.to_numeric(df['Financial Stress'], errors='coerce')

# Remplace les NaN par une valeur par défaut (ex : 0) OU drop les lignes
df['Financial Stress'] = df['Financial Stress'].fillna(0)

# Convertit en entier
df['Financial Stress'] = df['Financial Stress'].astype(int)
"""
print(df['CGPA'].unique())

# Sauvegarder un nouveau fichier propre
df.to_csv("student_depression_dataset1.csv", index=False)
