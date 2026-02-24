# Medical Corpus Insights – Corpus Analysis Workflow

This repo compares two medical resources:
- `Resident_Guide_Chapters/` (Resident's Guide Chapters)
- `articles/` (Amboss Articles)

We do this with a reproducible, quantitative pipeline that produces file-level metrics and corpus-level summaries for objective comparison.

## Experiment Pairwise Set (Qualitative Survey Check)

This “experiment” samples a small subset of paired topics (some Resident's Guide, some Amboss) and collects qualitative survey responses. The table below shows pairwise similarity metrics for the sampled topics to help frame how the selected topics relate to the broader corpus.

<div id="experiment-pairs"></div>

### Visual Overlays

These overlays show where the selected topics fall relative to the full pairwise dataset.

**What TF‑IDF means**  
TF‑IDF is a way to summarize the “signature” words in a document. It up‑weights words that are frequent in that document but uncommon across the whole collection. When we compute TF‑IDF for each pair and take a cosine similarity, a **higher score means the two documents emphasize similar key terms**, while a **lower score means they emphasize different terms**.

<div class="chart-row">
  <div class="chart-block">
    <div class="chart-label">TF‑IDF vs Density Δ (all pairs + highlighted sample)</div>
    <div class="chart" id="experiment-chart-tfidf-density"></div>
  </div>
  <div class="chart-block">
    <div class="chart-label">Density Δ vs Readability Δ (all pairs + highlighted sample)</div>
    <div class="chart" id="experiment-chart-density-grade"></div>
  </div>
</div>

**Context for the overlays**  
- The selected topics span a wide range of term similarity, from low to very high. Most sit in the middle of the TF‑IDF distribution, but a few are at the extremes.  
- Density differences for the selected topics are mostly in the middle of the full distribution, with one notably low‑difference pair and one notably high‑difference pair.  
- In the Density Δ vs Readability Δ plot, the selected topics cluster near the center of the cloud, indicating the reading‑level differences track the broader dataset even when term similarity varies.  
- Overall, the selected topics cover common cases and a few edge cases, which supports qualitative comparison without implying a summary conclusion.

## Method Summary

The workflow is designed to be scientific (transparent, repeatable, and auditable):

1. **Inventory**
   - Enumerate all `*.md` files in each corpus.

2. **Topic Pairing (Indexing)**
   - Generate a chapter-to-article index using filename/topic similarity, with manual overrides for ambiguous cases.
   - Output: `ResidentGuide_Articles_Index.md`

3. **Text Normalization**
   - Strip Markdown (code blocks, links, inline code, tables, headings).
   - Keep the raw text untouched for length/bullet counts.

4. **Linguistic Analysis (per file)**
   - Tokenize and parse with spaCy.
   - Compute length/structure metrics.
   - Compute readability metrics (multiple formulas).
   - Compute lexical diversity and sophistication.
   - Compute conceptual density proxies.
   - Compute language type/style proxies.

5. **Aggregation (per corpus)**
   - For each metric, compute mean/median/stdev across files.

6. **Output**
   - JSON file with per-file metrics + per-corpus summaries.

## Metrics (What We Measure)

The script computes a broad set of objective metrics. Key categories:

- **Length & Structure**: word count, sentence count, paragraph count, sentence length stats, word length, syllables/word.
- **Readability**: Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau, ARI, Linsear Write, Dale-Chall, LIX, RIX.
- **Lexical Diversity**: type-token ratio (TTR), MTLD.
- **Conceptual Density Proxies**:
  - Content word rate (nouns/verbs/adjectives/proper nouns)
  - Unique content lemmas per sentence
  - Noun-chunk density
  - Named-entity density
  - Noun/verb ratio
- **Language Type / Style Proxies**:
  - Imperative rate
  - Second-person rate
  - Bullet/list density
  - Acronym density
  - Numeric density
- **Lexical Sophistication**:
  - Wordfreq Zipf frequency (average)
  - Rare-word rate (Zipf < 3.5)

These proxies allow comparison of:
- Clinical density vs. narrative explanation
- Procedural vs. descriptive tone
- Jargon intensity
- Structural differences (lists vs. prose)

## How To Run

Install dependencies:

```bash
pip install spacy wordfreq numpy pyphen
python -m spacy download en_core_web_sm
```

Run analysis:

```bash
python scripts/analyze_corpus.py \
  --resident-dir Resident_Guide_Chapters \
  --articles-dir articles \
  --output analysis.json
```

## Pairwise Cognitive Comparison

We also compute **pairwise cognitive content similarity** for each indexed chapter–article pair using `ResidentGuide_Articles_Index.md`.

Install additional dependency:

```bash
pip install scikit-learn
```

Run pairwise comparison:

```bash
python scripts/compare_pairs.py \
  --index ResidentGuide_Articles_Index.md \
  --output analysis_pairs.json
```

### Pairwise Metrics

- **TF‑IDF cosine similarity** on content lemmas.
- **Jaccard overlap** of top‑N content lemmas (default N=200).
- **Entity overlap** (named entities).
- **Noun‑chunk overlap**.
- **Density deltas** (absolute differences of content density proxies).
- **Cognitive distance**: z‑scored composite of similarity + density deltas.

## Visualization Dashboard

A graphs-first dashboard lives in `web/` and reads the JSON outputs.

Run a local server from the repo root:

```bash
python3 -m http.server 8000
```

Then open:

```
http://localhost:8000/web/index.html
```

## Output Schema (analysis.json)

Top-level keys:
- `generated_at`: UTC timestamp
- `resources`: summary stats per corpus
- `files`: per-file metrics
- `metrics_description`: human-readable descriptions for key metrics

Example (trimmed):

```json
{
  "generated_at": "2026-02-24T18:42:00Z",
  "resources": {
    "Resident_Guide_Chapters": {
      "word_count": {"mean": 900.2, "median": 780.0, "stdev": 340.5},
      "flesch_kincaid_grade": {"mean": 13.9, "median": 13.7, "stdev": 1.2}
    },
    "articles": { ... }
  },
  "files": [
    {
      "path": "Resident_Guide_Chapters/001_THE NEWBORN EXAM HISTORY R.md",
      "resource": "Resident_Guide_Chapters",
      "metrics": {"word_count": 1102, "mtld": 82.1, ...}
    }
  ]
}
```

## Scientific Guardrails

We are careful to keep comparisons valid:
- **Same preprocessing** across corpora.
- **Multiple readability formulas** to reduce bias from any one metric.
- **Transparent proxies** for conceptual density and jargon.
- **Aggregate stats** (mean/median/stdev) to avoid cherry-picking.
- **Explicit versioning** via timestamped outputs.

## Known Limits

- No medical lexicon is used; conceptual density is inferred from syntactic proxies.
- Readability formulas were designed for general English and may overestimate difficulty for domain experts.
- Dale-Chall is a proxy based on wordfreq Zipf thresholds (no official easy-word list available offline).
- Syllable counts are estimated using `pyphen` (no CMUdict).

## Future Enhancements

If we obtain a domain lexicon (e.g., UMLS/MeSH or a curated medical glossary), we can add true clinical-term density metrics.

If we obtain a domain lexicon (e.g., UMLS/MeSH or a curated medical glossary), we can add true clinical-term density metrics.
