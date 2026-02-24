const overviewBtn = document.getElementById("btn-overview");
const pairsBtn = document.getElementById("btn-pairs");
const methodsBtn = document.getElementById("btn-methods");
const conclusionBtn = document.getElementById("btn-conclusion");
const overviewSection = document.getElementById("overview");
const pairsSection = document.getElementById("pairs");
const methodsSection = document.getElementById("methods");
const conclusionSection = document.getElementById("conclusion");

const statRes = document.getElementById("stat-res-count");
const statArt = document.getElementById("stat-art-count");
const statPairs = document.getElementById("stat-pair-count");

const topicSearch = document.getElementById("topic-search");
const topicList = document.getElementById("topic-list");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalResident = document.getElementById("modal-resident");
const modalArticle = document.getElementById("modal-article");
const modalClose = document.getElementById("modal-close");

const RES_PREFIX = "Resident_Guide_Chapters/";
const ART_PREFIX = "articles/";
const ART_PREFIX_ALT = "amboss_articles/";
const RES_WEB = "resident_guide_chapters/";
const ART_WEB = "amboss_articles/";
const RES_LABEL = "Resident's Guide Chapters";
const ART_LABEL = "Amboss Articles";

const EXPERIMENT_TOPICS = [
  {
    key: "adhd",
    label: "ADHD",
    residentMatch: "_018_ATTENTION DEFICIT HYPERACTIVITY DISORDER",
    articleMatch: "_Attention Deficit Hyperactivity Disorder",
  },
  {
    key: "immunizations",
    label: "Immunizations",
    residentMatch: "_003_CHILDHOOD IMMUNIZATION SCHEDULE",
    articleMatch: "_Childhood Immunization Schedule",
  },
  {
    key: "post_mi",
    label: "Prevention of MI (Post-MI Management)",
    residentMatch: "_063_AMBULATORY POST-MI MANAGEMENT",
    articleMatch: "_Ambulatory Post-Mi Management",
  },
  {
    key: "postpartum",
    label: "Postpartum Care",
    residentMatch: "_024_POSTPARTUM DISCHARGE INSTRUCTIONS",
    articleMatch: "_Postpartum Discharge Instructions",
  },
  {
    key: "contraception",
    label: "Contraception",
    residentMatch: "_026_CONTRACEPTION ORAL CONTRACEPTIVES",
    articleMatch: "_Contraception",
  },
  {
    key: "potassium",
    label: "Hyperkalemia / Potassium Metabolism",
    residentMatch: "POTASSIUM METABOLISM",
    articleMatch: "_Potassium Metabolism",
  },
  {
    key: "gad",
    label: "GAD / Anxiety Disorders",
    residentMatch: "_106_ANXIETY DISORDERS AND OBSESSIVE",
    articleMatch: "_Anxiety Disorders and Obsessive-Compulsive and Related Disorders",
  },
  {
    key: "asthma",
    label: "Asthma",
    residentMatch: "_055_ASTHMA IN ADULTS",
    articleMatch: "_Asthma in Adults",
    fallbackResidentMatch: "_007_ASTHMA IN CHILDREN",
    fallbackArticleMatch: "_Asthma in Children",
  },
];

function toWebPath(path) {
  if (path.startsWith(RES_PREFIX)) return path.replace(RES_PREFIX, RES_WEB);
  if (path.startsWith(ART_PREFIX)) return path.replace(ART_PREFIX, ART_WEB);
  if (path.startsWith(ART_PREFIX_ALT)) return path.replace(ART_PREFIX_ALT, ART_WEB);
  return path;
}

function displayName(path) {
  return path
    .replace(RES_PREFIX, "")
    .replace(ART_PREFIX, "")
    .replace(ART_PREFIX_ALT, "")
    .replace(RES_WEB, "")
    .replace(ART_WEB, "");
}

function setActiveSection(section) {
  if (section === "overview") {
    overviewSection.classList.add("active");
    pairsSection.classList.remove("active");
    methodsSection.classList.remove("active");
    conclusionSection.classList.remove("active");
    overviewBtn.classList.add("active");
    pairsBtn.classList.remove("active");
    methodsBtn.classList.remove("active");
    conclusionBtn.classList.remove("active");
  } else {
    overviewSection.classList.remove("active");
    pairsSection.classList.remove("active");
    methodsSection.classList.remove("active");
    conclusionSection.classList.remove("active");
    overviewBtn.classList.remove("active");
    pairsBtn.classList.remove("active");
    methodsBtn.classList.remove("active");
    conclusionBtn.classList.remove("active");

    if (section === "pairs") {
      pairsSection.classList.add("active");
      pairsBtn.classList.add("active");
    } else if (section === "methods") {
      methodsSection.classList.add("active");
      methodsBtn.classList.add("active");
    } else if (section === "conclusion") {
      conclusionSection.classList.add("active");
      conclusionBtn.classList.add("active");
    }
  }
}

overviewBtn.addEventListener("click", () => setActiveSection("overview"));
pairsBtn.addEventListener("click", () => setActiveSection("pairs"));
methodsBtn.addEventListener("click", () => setActiveSection("methods"));
conclusionBtn.addEventListener("click", () => setActiveSection("conclusion"));

function formatNumber(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return "–";
  return Number(value).toFixed(digits);
}

function tidyLabel(label) {
  return label.replace(/_/g, " ");
}

function makeMeanComparisonChart(summary) {
  const metrics = [
    "sentence_count",
    "avg_sentence_length",
    "unique_content_lemmas_per_sentence",
    "entity_density_per_1k",
    "avg_zipf_frequency",
    "flesch_kincaid_grade",
    "gunning_fog",
  ];

  const res = summary.Resident_Guide_Chapters;
  const art = summary.articles;

  const labelMap = {
    sentence_count: "Sentence Count",
    avg_sentence_length: "Sentence Length",
    unique_content_lemmas_per_sentence: "Concepts / Sentence",
    entity_density_per_1k: "Clinical Entities",
    avg_zipf_frequency: "Word Commonness",
    flesch_kincaid_grade: "Reading Grade",
    gunning_fog: "Fog Index",
  };

  const definitionMap = {
    sentence_count:
      "Higher = longer documents. Lower = more concise overviews. For pre-clinic teaching, moderate counts help focus.",
    avg_sentence_length:
      "Higher = denser, more complex sentence structure. Lower = easier scanning and comprehension.",
    unique_content_lemmas_per_sentence:
      "Higher = more distinct concepts per sentence (information-dense). Lower = more explanatory pacing.",
    entity_density_per_1k:
      "Higher = more clinical entities and named terms. Useful for domain exposure, but can overload novices.",
    avg_zipf_frequency:
      "Higher = more common words (simpler language). Lower = rarer words (more jargon).",
    flesch_kincaid_grade:
      "Higher = higher estimated reading grade level (harder). Lower = more accessible.",
    gunning_fog:
      "Higher = more complex text (harder). Lower = clearer prose.",
  };

  const residentValues = metrics.map((m) => res[m]?.mean ?? 0);
  const articleValues = metrics.map((m) => art[m]?.mean ?? 0);

  const data = [
    {
      x: metrics.map((m) => labelMap[m] || tidyLabel(m)),
      y: residentValues,
      name: RES_LABEL,
      type: "bar",
      marker: { color: "#0d4a5b" },
    },
    {
      x: metrics.map((m) => labelMap[m] || tidyLabel(m)),
      y: articleValues,
      name: ART_LABEL,
      type: "bar",
      marker: { color: "#b89b72" },
    },
  ];

  const layout = {
    barmode: "group",
    margin: { t: 20, r: 10, l: 50, b: 120 },
    height: 360,
    legend: { orientation: "h", y: 1.18, x: 0 },
    xaxis: { tickangle: -30, automargin: true, tickfont: { size: 11 } },
    yaxis: { gridcolor: "#ece7dd" },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  Plotly.newPlot("chart-means", data, layout, { displayModeBar: false });

  const definitionEl = document.getElementById("mean-definition");
  const chartEl = document.getElementById("chart-means");
  chartEl.on("plotly_click", (event) => {
    const label = event.points?.[0]?.x;
    const metricKey = Object.keys(labelMap).find((k) => labelMap[k] === label);
    if (!metricKey) return;
    definitionEl.textContent = definitionMap[metricKey] || "";
  });
}

function makeWordCountMean(summary) {
  const res = summary.Resident_Guide_Chapters;
  const art = summary.articles;
  const data = [
    {
      x: [RES_LABEL, ART_LABEL],
      y: [res.word_count?.mean ?? 0, art.word_count?.mean ?? 0],
      type: "bar",
      marker: { color: ["#0d4a5b", "#b89b72"] },
    },
  ];

  const layout = {
    margin: { t: 20, r: 10, l: 60, b: 60 },
    height: 320,
    yaxis: { title: "Mean Word Count", gridcolor: "#ece7dd" },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  Plotly.newPlot("chart-wordcount-mean", data, layout, { displayModeBar: false });
}

function makeWordCountHistogram(files) {
  const res = files.filter((f) => f.resource === "Resident_Guide_Chapters");
  const art = files.filter((f) => f.resource === "articles");

  const data = [
    {
      x: res.map((f) => f.metrics.word_count),
      type: "histogram",
      name: RES_LABEL,
      opacity: 0.7,
      marker: { color: "#0d4a5b" },
    },
    {
      x: art.map((f) => f.metrics.word_count),
      type: "histogram",
      name: ART_LABEL,
      opacity: 0.7,
      marker: { color: "#b89b72" },
    },
  ];

  const layout = {
    barmode: "overlay",
    margin: { t: 20, r: 10, l: 60, b: 60 },
    height: 320,
    xaxis: { title: "Word Count", gridcolor: "#ece7dd" },
    yaxis: { title: "Count", gridcolor: "#ece7dd" },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  Plotly.newPlot("chart-wordcount-hist", data, layout, { displayModeBar: false });
}

function makeReadabilityChart(files) {
  const res = files.filter((f) => f.resource === "Resident_Guide_Chapters");
  const art = files.filter((f) => f.resource === "articles");

  const data = [
    {
      y: res.map((f) => f.metrics.flesch_kincaid_grade),
      type: "box",
      name: RES_LABEL,
      marker: { color: "#0d4a5b" },
      boxmean: "sd",
    },
    {
      y: art.map((f) => f.metrics.flesch_kincaid_grade),
      type: "box",
      name: ART_LABEL,
      marker: { color: "#b89b72" },
      boxmean: "sd",
    },
  ];

  const layout = {
    margin: { t: 20, r: 10, l: 50, b: 40 },
    height: 360,
    yaxis: { title: "Flesch-Kincaid Grade", gridcolor: "#ece7dd", range: [5, 25] },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  Plotly.newPlot("chart-readability", data, layout, { displayModeBar: false });
}

function mean(values) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function paddedRange(values, padding = 0.08) {
  const nums = values.filter((v) => Number.isFinite(v));
  if (!nums.length) return undefined;
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  if (min === max) {
    const delta = Math.abs(min || 1) * 0.1;
    return [min - delta, max + delta];
  }
  const pad = (max - min) * padding;
  return [min - pad, max + pad];
}

function makeScatter(files) {
  const res = files.filter((f) => f.resource === "Resident_Guide_Chapters");
  const art = files.filter((f) => f.resource === "articles");

  const resX = res.map((f) => f.metrics.content_word_rate);
  const resY = res.map((f) => f.metrics.flesch_kincaid_grade);
  const artX = art.map((f) => f.metrics.content_word_rate);
  const artY = art.map((f) => f.metrics.flesch_kincaid_grade);

  const resCenter = { x: mean(resX), y: mean(resY) };
  const artCenter = { x: mean(artX), y: mean(artY) };
  const densityDiff = resCenter.x - artCenter.x;
  const gradeDiff = resCenter.y - artCenter.y;

  const data = [
    {
      x: resX,
      y: resY,
      mode: "markers",
      name: RES_LABEL,
      marker: { color: "#0d4a5b", size: 8, opacity: 0.7 },
      text: res.map((f) => f.path),
    },
    {
      x: artX,
      y: artY,
      mode: "markers",
      name: ART_LABEL,
      marker: { color: "#b89b72", size: 8, opacity: 0.7 },
      text: art.map((f) => f.path),
    },
    {
      x: [resCenter.x],
      y: [resCenter.y],
      mode: "markers",
      name: `${RES_LABEL} Center`,
      marker: {
        color: "#0d4a5b",
        size: 14,
        symbol: "x",
        line: { color: "#000000", width: 2 },
      },
      hovertemplate: `${RES_LABEL} Center<br>Density: %{x:.3f}<br>Grade: %{y:.2f}<extra></extra>`,
    },
    {
      x: [artCenter.x],
      y: [artCenter.y],
      mode: "markers",
      name: `${ART_LABEL} Center`,
      marker: {
        color: "#b89b72",
        size: 14,
        symbol: "x",
        line: { color: "#000000", width: 2 },
      },
      hovertemplate: `${ART_LABEL} Center<br>Density: %{x:.3f}<br>Grade: %{y:.2f}<extra></extra>`,
    },
  ];

  const layout = {
    margin: { t: 20, r: 10, l: 60, b: 60 },
    height: 360,
    xaxis: {
      title: "Content Word Rate",
      gridcolor: "#ece7dd",
      range: [0.5, 1],
      automargin: true,
    },
    yaxis: {
      title: "Flesch-Kincaid Grade",
      gridcolor: "#ece7dd",
      range: [5, 25],
      automargin: true,
    },
    legend: {
      orientation: "h",
      y: 1.18,
      x: 0,
      title: {
        text: `Center Δ: density ${densityDiff.toFixed(3)}, grade ${gradeDiff.toFixed(2)}`,
        font: { size: 12, color: "#574f45" },
      },
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  Plotly.newPlot("chart-scatter", data, layout, { displayModeBar: false });

  const interp = document.getElementById("scatter-interpretation");
  const densityText =
    Math.abs(densityDiff) < 0.001
      ? "both corpora have similar content density"
      : densityDiff > 0
      ? `${RES_LABEL} is denser per sentence`
      : `${ART_LABEL} are denser per sentence`;
  const gradeText =
    Math.abs(gradeDiff) < 0.1
      ? "and reading difficulty is similar"
      : gradeDiff > 0
      ? `and ${RES_LABEL} reads at a higher grade level`
      : `and ${ART_LABEL} read at a higher grade level`;
  interp.textContent = `Center-of-mass summary: ${densityText}; ${gradeText}. (Δ density ${densityDiff.toFixed(3)}, Δ grade ${gradeDiff.toFixed(2)})`;
}

function makeLexicalChart(files) {
  const res = files.filter((f) => f.resource === "Resident_Guide_Chapters");
  const art = files.filter((f) => f.resource === "articles");

  const resX = res.map((f) => f.metrics.avg_zipf_frequency);
  const resY = res.map((f) => f.metrics.rare_word_rate);
  const artX = art.map((f) => f.metrics.avg_zipf_frequency);
  const artY = art.map((f) => f.metrics.rare_word_rate);

  const data = [
    {
      x: resX,
      y: resY,
      mode: "markers",
      name: RES_LABEL,
      marker: { color: "#0d4a5b", size: 8, opacity: 0.7 },
    },
    {
      x: artX,
      y: artY,
      mode: "markers",
      name: ART_LABEL,
      marker: { color: "#b89b72", size: 8, opacity: 0.7 },
    },
  ];

  const layout = {
    margin: { t: 20, r: 10, l: 60, b: 60 },
    height: 360,
    xaxis: {
      title: "Avg Zipf Frequency",
      gridcolor: "#ece7dd",
      range: [3, 5],
      automargin: true,
    },
    yaxis: {
      title: "Rare Word Rate",
      gridcolor: "#ece7dd",
      range: [0, 0.5],
      automargin: true,
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  Plotly.newPlot("chart-lexical", data, layout, { displayModeBar: false });
}

function makePairsScatter(pairs) {
  const filtered = pairs.filter((p) => p.metrics);
  const data = [
    {
      x: filtered.map((p) => p.metrics.tfidf_cosine),
      y: filtered.map((p) => p.metrics.density_delta_mean),
      mode: "markers",
      marker: {
        color: filtered.map((p) => p.metrics.cognitive_distance),
        colorscale: "Viridis",
        size: 9,
        opacity: 0.75,
        colorbar: { title: "Distance" },
      },
      text: filtered.map(
        (p) => `${p.resident_path} <-> ${p.article_path}`
      ),
      hovertemplate:
        "%{text}<br>TF-IDF: %{x:.2f}<br>Density Δ: %{y:.3f}<extra></extra>",
    },
  ];

  const layout = {
    margin: { t: 20, r: 10, l: 60, b: 60 },
    height: 360,
    xaxis: { title: "TF-IDF Cosine", gridcolor: "#ece7dd" },
    yaxis: { title: "Density Delta (mean)", gridcolor: "#ece7dd" },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  Plotly.newPlot("chart-pairs-scatter", data, layout, { displayModeBar: false });
}

function makeDistanceChart(pairs) {
  const values = pairs
    .filter((p) => p.metrics && p.metrics.cognitive_distance !== undefined)
    .map((p) => p.metrics.cognitive_distance);

  const data = [
    {
      x: values,
      type: "histogram",
      marker: { color: "#0d4a5b" },
    },
  ];

  const layout = {
    margin: { t: 20, r: 10, l: 60, b: 60 },
    height: 360,
    xaxis: { title: "Cognitive Distance", gridcolor: "#ece7dd" },
    yaxis: { title: "Count", gridcolor: "#ece7dd" },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  Plotly.newPlot("chart-distance", data, layout, { displayModeBar: false });
}

function makePairDensityReadabilityChart(pairs, fileMap) {
  const points = pairs
    .filter((p) => p.metrics && p.resident_path && p.article_path)
    .map((p) => {
      const res = fileMap.get(p.resident_path);
      const art = fileMap.get(p.article_path);
      if (!res || !art) return null;
      return {
        x: res.metrics.content_word_rate - art.metrics.content_word_rate,
        y: res.metrics.flesch_kincaid_grade - art.metrics.flesch_kincaid_grade,
        label: `${p.resident_path} vs ${p.article_path}`,
        distance: p.metrics.cognitive_distance ?? 0,
      };
    })
    .filter(Boolean);

  const data = [
    {
      x: points.map((p) => p.x),
      y: points.map((p) => p.y),
      mode: "markers",
      marker: {
        color: points.map((p) => p.distance),
        colorscale: "Viridis",
        size: 9,
        opacity: 0.8,
        colorbar: { title: "Cognitive Distance" },
      },
      text: points.map((p) => p.label),
      hovertemplate:
        "%{text}<br>Δ density: %{x:.3f}<br>Δ grade: %{y:.2f}<extra></extra>",
    },
  ];

  const layout = {
    margin: { t: 20, r: 10, l: 60, b: 60 },
    height: 360,
    xaxis: { title: "Δ Density (Resident's Guide - Amboss)", gridcolor: "#ece7dd" },
    yaxis: { title: "Δ Readability Grade (Resident's Guide - Amboss)", gridcolor: "#ece7dd" },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  Plotly.newPlot("chart-pairs-density-readability", data, layout, { displayModeBar: false });
}

function buildTopicList(pairs, query = "") {
  const filtered = pairs
    .filter((p) => p.metrics && p.article_path)
    .filter((p) => {
      const text = `${p.resident_path} ${p.article_path}`.toLowerCase();
      return text.includes(query.toLowerCase());
    })
    .sort((a, b) => (a.metrics.cognitive_distance ?? 0) - (b.metrics.cognitive_distance ?? 0));

  topicList.innerHTML = filtered
    .map(
      (p) => `
        <div class="topic-item" data-res="${p.resident_path}" data-art="${p.article_path}">
          <div class="topic-title">${displayName(p.resident_path)}</div>
          <div class="topic-sub">${displayName(p.article_path)}</div>
          <div class="topic-metrics">
            <div class="topic-metric">TF-IDF ${formatNumber(p.metrics.tfidf_cosine, 2)}</div>
            <div class="topic-metric">Lemma Jaccard ${formatNumber(p.metrics.jaccard_top_lemmas, 2)}</div>
            <div class="topic-metric">Density Δ ${formatNumber(p.metrics.density_delta_mean, 3)}</div>
            <div class="topic-metric">Distance ${formatNumber(p.metrics.cognitive_distance, 2)}</div>
          </div>
        </div>
      `
    )
    .join("");

  topicList.querySelectorAll(".topic-item").forEach((item) => {
    item.addEventListener("click", async () => {
      const resPath = item.getAttribute("data-res");
      const artPath = item.getAttribute("data-art");
      await openModal(resPath, artPath);
    });
  });
}

async function openModal(resPath, artPath) {
  modalTitle.textContent = `${displayName(resPath)} <-> ${displayName(artPath)}`;
  modalResident.innerHTML = "Loading…";
  modalArticle.innerHTML = "Loading…";
  modal.classList.remove("hidden");

  const [resText, artText] = await Promise.all([
    fetch(`./${toWebPath(resPath)}`).then((r) => r.text()),
    fetch(`./${toWebPath(artPath)}`).then((r) => r.text()),
  ]);

  modalResident.innerHTML = marked.parse(resText);
  modalArticle.innerHTML = marked.parse(artText);
}

modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
});

let cachedPairList = null;
let cachedFileMap = null;

async function loadData() {
  const [analysis, pairs] = await Promise.all([
    fetch("./analysis.json").then((r) => r.json()),
    fetch("./analysis_pairs.json").then((r) => r.json()),
  ]);

  const files = analysis.files || [];
  const pairList = pairs.pairs || [];
  const fileMap = new Map(files.map((f) => [f.path, f]));

  statRes.textContent = files.filter((f) => f.resource === "Resident_Guide_Chapters").length;
  statArt.textContent = files.filter((f) => f.resource === "articles").length;
  statPairs.textContent = pairList.filter((p) => p.metrics).length;

  makeMeanComparisonChart(analysis.resources || {});
  makeReadabilityChart(files);
  makeWordCountMean(analysis.resources || {});
  makeWordCountHistogram(files);
  makeScatter(files);
  makeLexicalChart(files);
  makePairsScatter(pairList);
  makeDistanceChart(pairList);
  makePairDensityReadabilityChart(pairList, fileMap);
  buildTopicList(pairList);
  cachedPairList = pairList;
  cachedFileMap = fileMap;
  renderExperimentPairs(pairList);
  renderExperimentOverlays(pairList, fileMap);

  loadReferenceYears();

  topicSearch.addEventListener("input", (event) => {
    buildTopicList(pairList, event.target.value);
  });
}

loadData().catch((err) => {
  console.error("Failed to load data", err);
});

async function loadMethods() {
  const methodsEl = document.getElementById("methods-content");
  if (!methodsEl) return;
  try {
    const text = await fetch("./methods.md").then((r) => r.text());
    methodsEl.innerHTML = marked.parse(text);
    renderExperimentPairs(cachedPairList);
    renderExperimentOverlays(cachedPairList, cachedFileMap);
  } catch (err) {
    methodsEl.textContent = "Failed to load methods.md";
  }
}

loadMethods();

async function loadConclusion() {
  const conclusionEl = document.getElementById("conclusion-content");
  if (!conclusionEl) return;
  try {
    const text = await fetch("./conclusion.md").then((r) => r.text());
    conclusionEl.innerHTML = marked.parse(text);
  } catch (err) {
    conclusionEl.textContent = "Failed to load conclusion.md";
  }
}

loadConclusion();

async function loadReferenceYears() {
  try {
    const ref = await fetch("./analysis_references.json").then((r) => r.json());
    makeReferenceYearsChart(ref);
    makeReferenceMedianChart(ref);
  } catch (err) {
    const yearsEl = document.getElementById("chart-ref-years");
    const medianEl = document.getElementById("chart-ref-median");
    if (yearsEl) yearsEl.textContent = "Failed to load reference year data.";
    if (medianEl) medianEl.textContent = "Failed to load reference year data.";
  }
}

function makeReferenceYearsChart(ref) {
  const res = ref.resources?.Resident_Guide_Chapters;
  const art = ref.resources?.articles;
  if (!res || !art) return;

  const data = [
    {
      x: res.all_years || [],
      type: "histogram",
      name: RES_LABEL,
      opacity: 0.65,
      marker: { color: "#0d4a5b" },
      autobinx: false,
      xbins: { size: 1 },
    },
    {
      x: art.all_years || [],
      type: "histogram",
      name: ART_LABEL,
      opacity: 0.6,
      marker: { color: "#b89b72" },
      autobinx: false,
      xbins: { size: 1 },
    },
  ];

  const layout = {
    barmode: "overlay",
    margin: { t: 20, r: 10, l: 60, b: 60 },
    height: 320,
    xaxis: { title: "Reference Year", gridcolor: "#ece7dd", dtick: 2 },
    yaxis: { title: "Count", gridcolor: "#ece7dd" },
    legend: { orientation: "h", y: 1.12, x: 0 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  Plotly.newPlot("chart-ref-years", data, layout, { displayModeBar: false });
}

function makeReferenceMedianChart(ref) {
  const res = ref.resources?.Resident_Guide_Chapters;
  const art = ref.resources?.articles;
  if (!res || !art) return;

  const data = [
    {
      y: res.per_file_median_years || [],
      type: "box",
      name: RES_LABEL,
      marker: { color: "#0d4a5b" },
      boxmean: "sd",
    },
    {
      y: art.per_file_median_years || [],
      type: "box",
      name: ART_LABEL,
      marker: { color: "#b89b72" },
      boxmean: "sd",
    },
  ];

  const layout = {
    margin: { t: 20, r: 10, l: 60, b: 60 },
    height: 320,
    yaxis: { title: "Median Reference Year (Per File)", gridcolor: "#ece7dd" },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  Plotly.newPlot("chart-ref-median", data, layout, { displayModeBar: false });
}

function renderExperimentPairs(pairList) {
  const host = document.getElementById("experiment-pairs");
  if (!host || !pairList) return;

  const findPair = (topic) => {
    const matches = pairList.filter((p) => {
      if (!p || !p.resident_path || !p.article_path) return false;
      const r = p.resident_path;
      const a = p.article_path;
      return (
        r.includes(topic.residentMatch) ||
        a.includes(topic.articleMatch)
      );
    });
    if (matches.length) return matches[0];
    if (topic.fallbackResidentMatch || topic.fallbackArticleMatch) {
      return pairList.find((p) => {
        if (!p || !p.resident_path || !p.article_path) return false;
        const r = p.resident_path;
        const a = p.article_path;
        return (
          (topic.fallbackResidentMatch && r.includes(topic.fallbackResidentMatch)) ||
          (topic.fallbackArticleMatch && a.includes(topic.fallbackArticleMatch))
        );
      });
    }
    return null;
  };

  const rows = EXPERIMENT_TOPICS.map((t) => {
    const pair = findPair(t);
    return { topic: t, pair };
  });

  const fmt = (v) => (v === null || v === undefined ? "—" : v.toFixed(3));

  host.innerHTML = `
    <table class="experiment-table">
      <thead>
        <tr>
          <th>Topic</th>
          <th>${RES_LABEL}</th>
          <th>${ART_LABEL}</th>
          <th>TF-IDF</th>
          <th>Jaccard</th>
          <th>Entity</th>
          <th>Noun-Chunk</th>
          <th>Density Δ</th>
          <th>Cognitive Distance</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(({ topic, pair }) => {
            if (!pair || !pair.metrics) {
              return `
                <tr>
                  <td>${topic.label}</td>
                  <td colspan="8">Pair not found in analysis_pairs.json</td>
                </tr>
              `;
            }
            const m = pair.metrics;
            return `
              <tr>
                <td>${topic.label}</td>
                <td><button class="pair-link" data-res="${pair.resident_path}" data-art="${pair.article_path}">${displayName(pair.resident_path)}</button></td>
                <td><button class="pair-link" data-res="${pair.resident_path}" data-art="${pair.article_path}">${displayName(pair.article_path)}</button></td>
                <td>${fmt(m.tfidf_cosine)}</td>
                <td>${fmt(m.jaccard_top_lemmas)}</td>
                <td>${fmt(m.entity_overlap)}</td>
                <td>${fmt(m.noun_chunk_overlap)}</td>
                <td>${fmt(m.density_delta_mean)}</td>
                <td>${fmt(m.cognitive_distance)}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;

  host.querySelectorAll(".pair-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const resPath = btn.getAttribute("data-res");
      const artPath = btn.getAttribute("data-art");
      if (resPath && artPath) {
        openModal(resPath, artPath);
      }
    });
  });
}

function renderExperimentOverlays(pairList, fileMap) {
  const chartA = document.getElementById("experiment-chart-tfidf-density");
  const chartB = document.getElementById("experiment-chart-density-grade");
  if (!chartA || !chartB || !pairList) return;

  const findPair = (topic) => {
    const matches = pairList.filter((p) => {
      if (!p || !p.resident_path || !p.article_path) return false;
      const r = p.resident_path;
      const a = p.article_path;
      return r.includes(topic.residentMatch) || a.includes(topic.articleMatch);
    });
    if (matches.length) return matches[0];
    if (topic.fallbackResidentMatch || topic.fallbackArticleMatch) {
      return pairList.find((p) => {
        if (!p || !p.resident_path || !p.article_path) return false;
        const r = p.resident_path;
        const a = p.article_path;
        return (
          (topic.fallbackResidentMatch && r.includes(topic.fallbackResidentMatch)) ||
          (topic.fallbackArticleMatch && a.includes(topic.fallbackArticleMatch))
        );
      });
    }
    return null;
  };

  const selected = EXPERIMENT_TOPICS.map((t) => ({
    topic: t,
    pair: findPair(t),
  })).filter((row) => row.pair && row.pair.metrics);

  const basePairs = pairList.filter((p) => p.metrics);

  const baseTrace = {
    x: basePairs.map((p) => p.metrics.tfidf_cosine),
    y: basePairs.map((p) => p.metrics.density_delta_mean),
    mode: "markers",
    name: "All Pairs",
    marker: { color: "rgba(30,30,30,0.12)", size: 7 },
    text: basePairs.map((p) => `${displayName(p.resident_path)} ↔ ${displayName(p.article_path)}`),
    hovertemplate: "%{text}<br>TF-IDF: %{x:.2f}<br>Density Δ: %{y:.3f}<extra></extra>",
  };

  const highlightTrace = {
    x: selected.map((s) => s.pair.metrics.tfidf_cosine),
    y: selected.map((s) => s.pair.metrics.density_delta_mean),
    mode: "markers+text",
    name: "Instructor Sample",
    marker: { color: "#d04b2f", size: 12, line: { color: "#2b1d1a", width: 1 } },
    text: selected.map((s) => s.topic.label),
    textposition: "top center",
    hovertemplate:
      "%{text}<br>TF-IDF: %{x:.2f}<br>Density Δ: %{y:.3f}<extra></extra>",
  };

  const layoutA = {
    margin: { t: 30, r: 10, l: 60, b: 60 },
    height: 360,
    xaxis: { title: "TF-IDF Cosine", gridcolor: "#ece7dd" },
    yaxis: { title: "Density Δ (mean)", gridcolor: "#ece7dd" },
    legend: { orientation: "h", y: 1.12, x: 0 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  Plotly.newPlot("experiment-chart-tfidf-density", [baseTrace, highlightTrace], layoutA, {
    displayModeBar: false,
  });

  if (!fileMap) return;

  const baseB = basePairs
    .map((p) => {
      const res = fileMap.get(p.resident_path);
      const art = fileMap.get(p.article_path);
      if (!res || !art) return null;
      return {
        x: res.metrics.content_word_rate - art.metrics.content_word_rate,
        y: res.metrics.flesch_kincaid_grade - art.metrics.flesch_kincaid_grade,
        label: `${displayName(p.resident_path)} ↔ ${displayName(p.article_path)}`,
      };
    })
    .filter(Boolean);

  const baseTraceB = {
    x: baseB.map((p) => p.x),
    y: baseB.map((p) => p.y),
    mode: "markers",
    name: "All Pairs",
    marker: { color: "rgba(30,30,30,0.12)", size: 7 },
    text: baseB.map((p) => p.label),
    hovertemplate: "%{text}<br>Δ density: %{x:.3f}<br>Δ grade: %{y:.2f}<extra></extra>",
  };

  const selectedB = selected
    .map((s) => {
      const res = fileMap.get(s.pair.resident_path);
      const art = fileMap.get(s.pair.article_path);
      if (!res || !art) return null;
      return {
        x: res.metrics.content_word_rate - art.metrics.content_word_rate,
        y: res.metrics.flesch_kincaid_grade - art.metrics.flesch_kincaid_grade,
        label: s.topic.label,
      };
    })
    .filter(Boolean);

  const highlightTraceB = {
    x: selectedB.map((p) => p.x),
    y: selectedB.map((p) => p.y),
    mode: "markers+text",
    name: "Instructor Sample",
    marker: { color: "#d04b2f", size: 12, line: { color: "#2b1d1a", width: 1 } },
    text: selectedB.map((p) => p.label),
    textposition: "top center",
    hovertemplate: "%{text}<br>Δ density: %{x:.3f}<br>Δ grade: %{y:.2f}<extra></extra>",
  };

  const layoutB = {
    margin: { t: 30, r: 10, l: 60, b: 60 },
    height: 360,
    xaxis: { title: "Δ Density (Resident's Guide - Amboss)", gridcolor: "#ece7dd" },
    yaxis: { title: "Δ Readability Grade (Resident's Guide - Amboss)", gridcolor: "#ece7dd" },
    legend: { orientation: "h", y: 1.12, x: 0 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  Plotly.newPlot("experiment-chart-density-grade", [baseTraceB, highlightTraceB], layoutB, {
    displayModeBar: false,
  });
}
