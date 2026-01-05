
#!/usr/bin/env python3
"""
Generate a synthetic CSV: id,category,value
- id: 1..N
- category: A..J
- value: random float (0..1000)
"""
import random
import os

def generate_csv(out_path: str, rows: int = 200_000, categories=None):
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    if categories is None:
        categories = [chr(ord('A') + i) for i in range(10)]  # A..J

    random.seed(42)
    with open(out_path, "w") as f:
        f.write("id,category,value\n")
        for i in range(1, rows + 1):
            cat = random.choice(categories)
            val = round(random.random() * 1000.0, 4)
            f.write(f"{i},{cat},{val}\n")

if __name__ == "__main__":
    # Change rows to a bigger number if you want heavier IO tests (e.g., 2_000_000)
    generate_csv(out_path="data/sample_data.csv", rows=200_000)
    print("Generated: data/sample_data.csv")
