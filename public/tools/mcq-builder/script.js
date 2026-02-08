const questions = [];

function parseOptions(raw) {
  return raw
    .split(/\n\s*\n/)
    .map(line =>
      line
        .replace(/^[A-D]\.?Option\s*[A-D]\.\s*/i, "")
        .replace(/^[A-D]\.\s*/i, "")
        .trim()
    )
    .filter(Boolean);
}

function addMCQ() {
  const question = document.getElementById("question").value.trim();
  const rawOptions = document.getElementById("options").value;
  const correctIndex = Number(document.getElementById("correct").value);

  const prefix = document.getElementById("idPrefix").value.trim();
  let counter = Number(document.getElementById("counter").value);

  const options = parseOptions(rawOptions);

  if (!question) {
    alert("Question is required");
    return;
  }

  if (options.length !== 4) {
    alert("Paste exactly 4 options (A–D)");
    return;
  }

  const id = `${prefix}-${String(counter).padStart(2, "0")}`;

  questions.push({
    id,
    question,
    options,
    correctIndex
  });

  document.getElementById("counter").value = counter + 1;

  render();
  clearInputs();
}

function render() {
  document.getElementById("output").textContent =
    questions.map(q => JSON.stringify(q, null, 2)).join(",\n");
}

function copyJSON() {
  navigator.clipboard.writeText(
    questions.map(q => JSON.stringify(q, null, 2)).join(",\n")
  );
  alert("MCQs copied!");
}

function clearInputs() {
  document.getElementById("question").value = "";
  document.getElementById("options").value = "";
  document.getElementById("correct").value = "0";
}

function clearAll() {
  if (!confirm("Clear all MCQs?")) return;
  questions.length = 0;
  render();
}
