let lessons = [];

const EMAILJS_PUBLIC_KEY = "zPFqN-Gi-myazeqo2FABa";
const EMAILJS_SERVICE_ID = "service_tqmu52c";
const EMAILJS_TEMPLATE_ID = "template_xgnx27b";

const danceStudios = [
  { name: "Bay Area Dance School", email: "bay-area-dance-school@example.com" },
  { name: "Tingna Dance Studio", email: "tingna-dance-studio@example.com" },
  { name: "CANVAS Dance Arts", email: "canvas-dance-arts@example.com" },
  { name: "Star Dance Studio", email: "star-dance-studio@example.com" },
  { name: "Bay Area Ballet Conservatory", email: "bay-area-ballet-conservatory@example.com" },
  { name: "Rae Studios", email: "rae-studios@example.com" },
  { name: "On One Studios", email: "on-one-studios@example.com" },
  { name: "Mood & Moves Dance Co.", email: "mood-and-moves@example.com" },
  { name: "Dance Mission Theater", email: "dance-mission-theater@example.com" },
  { name: "ODC Dance Commons", email: "odc-dance-commons@example.com" },
  { name: "Smuin Center for Dance", email: "smuin-center-for-dance@example.com" },
  { name: "City Ballet San Francisco", email: "city-ballet-san-francisco@example.com" },
  { name: "Alonzo King LINES Dance Center", email: "lines-dance-center@example.com" },
  { name: "San Francisco Ballet School", email: "san-francisco-ballet-school@example.com" },
  { name: "DanceVibes Studio", email: "dancevibes-studio@example.com" },
  { name: "Dance Attack Los Gatos", email: "dance-attack-los-gatos@example.com" },
  { name: "West Valley Dance Company", email: "west-valley-dance-company@example.com" },
  { name: "Nor Cal Dance Arts", email: "nor-cal-dance-arts@example.com" },
  { name: "New Ballet School", email: "new-ballet-school@example.com" },
  { name: "Studio 10 Dance", email: "studio-10-dance@example.com" },
  { name: "Dance Identity", email: "dance-identity@example.com" },
  { name: "The Dance Loft", email: "the-dance-loft@example.com" },
  { name: "Purdance", email: "purdance@example.com" },
  { name: "Silicon Valley Dance Academy", email: "silicon-valley-dance-academy@example.com" },
  { name: "Mona Khan Company", email: "mona-khan-company@example.com" },
  { name: "Rang De Bollywood", email: "rang-de-bollywood@example.com" },
  { name: "Zohar Dance Company", email: "zohar-dance-company@example.com" },
  { name: "Academy of American Dance", email: "academy-of-american-dance@example.com" },
  { name: "Western Ballet", email: "western-ballet@example.com" },
  { name: "Menlo Park Academy of Dance", email: "menlo-park-academy-of-dance@example.com" },
  { name: "Dance Connection Palo Alto", email: "dance-connection-palo-alto@example.com" },
  { name: "Just B Dance Studio", email: "just-b-dance-studio@example.com" },
  { name: "Shawl-Anderson Dance Center", email: "shawl-anderson-dance-center@example.com" },
  { name: "East Bay Dance Center", email: "east-bay-dance-center@example.com" },
  { name: "Berkeley Ballet Theater", email: "berkeley-ballet-theater@example.com" },
];

const questions = {
  first: "Bring comfortable clothes, a water bottle, and the studio will confirm shoes after your request is sent.",
  pricing: "For this demo, prices are placeholders. Public classes and private lessons will later pull live pricing from each studio.",
  parent: "For kids and teens, a parent or guardian can use their own contact info and add student details in notes.",
  api: "The next version can connect to Google Search, Yelp, studio websites, or OpenAI-powered search through a Vercel backend.",
};

const weekdays = [
  { day: "Monday", baseDate: "2026-06-01" },
  { day: "Tuesday", baseDate: "2026-06-02" },
  { day: "Wednesday", baseDate: "2026-06-03" },
  { day: "Thursday", baseDate: "2026-06-04" },
  { day: "Friday", baseDate: "2026-06-05" },
  { day: "Saturday", baseDate: "2026-06-06" },
  { day: "Sunday", baseDate: "2026-06-07" },
];

const ageOptionsByMode = {
  all: ["Any age", "3-5", "6-8", "9-11", "12-14", "15-17", "18+"],
  public: ["Any age", "3-5", "6-8", "9-11", "12-14", "15-17", "18+"],
  private: ["Any age", "3-5", "6-8", "9-11", "12-14", "15-17", "18+"],
};

const state = {
  mode: "all",
  age: "Any age",
  selectedLesson: null,
  weekOffset: 0,
};

const els = {
  danceType: document.querySelector("#danceType"),
  zipCode: document.querySelector("#zipCode"),
  zipSuggestionList: document.querySelector("#zipSuggestionList"),
  questionSelect: document.querySelector("#questionSelect"),
  searchInput: document.querySelector("#searchInput"),
  ageOptions: document.querySelector("#ageOptions"),
  summaryMode: document.querySelector("#summaryMode"),
  summaryAge: document.querySelector("#summaryAge"),
  summaryStudio: document.querySelector("#summaryStudio"),
  resultCount: document.querySelector("#resultCount"),
  questionAnswer: document.querySelector("#questionAnswer"),
  calendarHint: document.querySelector("#calendarHint"),
  calendarGrid: document.querySelector("#calendarGrid"),
  previousWeekButton: document.querySelector("#previousWeekButton"),
  nextWeekButton: document.querySelector("#nextWeekButton"),
  lessonList: document.querySelector("#lessonList"),
  selectedClass: document.querySelector("#selectedClass"),
  contactForm: document.querySelector("#contactForm"),
  studioSelect: document.querySelector("#studioSelect"),
  submitContactButton: document.querySelector("#submitContactButton"),
  formStatus: document.querySelector("#formStatus"),
};

function uniqueValues(items, key) {
  return [...new Set(items.map((item) => item[key]))].sort();
}

function addOptions(select, values, allLabel) {
  const current = select.value;
  select.innerHTML = `<option value="all">${allLabel}</option>`;
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
  select.value = values.includes(current) ? current : "all";
}

function formatMode(mode) {
  return mode === "private" ? "Private" : "Public";
}

function formatAges(ages) {
  return ages.join(", ");
}

function formatSchedule(lesson) {
  if (lesson.time.toLowerCase() === "by appointment") {
    return `${lesson.weekday}, by appointment`;
  }
  return `${lesson.weekday} at ${lesson.time}`;
}

function formatSelectedSchedule(lesson) {
  if (lesson.time.toLowerCase() === "by appointment") {
    return `${lesson.weekday}, by appointment`;
  }
  return `${lesson.weekday}, ${lessonDisplayDate(lesson)} at ${lesson.time}`;
}

function normalizeLesson(item) {
  const location = item.location || {};
  const schedule = item.schedule || {};
  return {
    id: item.id,
    title: item.className,
    type: item.danceType,
    mode: item.mode,
    ages: item.ageGroups || [],
    studio: item.studio,
    city: location.city,
    state: location.state,
    zip: location.zip,
    address: location.address,
    locationName: location.name,
    weekday: schedule.weekday,
    time: schedule.time,
    frequency: schedule.frequency || "Weekly",
    sourceUrl: item.sourceUrl,
    lastChecked: item.lastChecked,
  };
}

function isCompleteClass(item) {
  return Boolean(
    item.id &&
      item.studio &&
      item.className &&
      item.danceType &&
      item.mode &&
      item.ageGroups?.length &&
      item.location?.zip &&
      item.schedule?.weekday &&
      item.schedule?.time,
  );
}

function zipQuery() {
  return els.zipCode.value.trim();
}

function zipSuggestions() {
  const query = zipQuery();
  return uniqueValues(lessons, "zip")
    .filter((zip) => query && zip.startsWith(query) && zip !== query)
    .slice(0, 5);
}

function setZipSuggestionsOpen(isOpen) {
  els.zipSuggestionList.classList.toggle("open", isOpen);
  els.zipCode.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

function clearSelectedLesson() {
  state.selectedLesson = null;
  els.selectedClass.classList.remove("ready");
  els.selectedClass.textContent = "Choose a class or select a studio below.";
}

function renderZipSuggestions() {
  const suggestions = zipSuggestions();
  els.zipSuggestionList.innerHTML = "";
  suggestions.forEach((zip) => {
    const matchingLessons = lessons.filter((lesson) => lesson.zip === zip);
    const cities = uniqueValues(matchingLessons, "city").join(", ");
    const option = document.createElement("button");
    option.type = "button";
    option.className = "zip-suggestion";
    option.setAttribute("role", "option");
    option.dataset.zip = zip;
    option.innerHTML = `<span>${zip}</span><small>${cities}</small>`;
    els.zipSuggestionList.append(option);
  });
  setZipSuggestionsOpen(document.activeElement === els.zipCode && suggestions.length > 0);
}

function populateTopFilters() {
  addOptions(els.danceType, uniqueValues(lessons, "type"), "All types");
  renderZipSuggestions();
}

function populateStudioSelect() {
  danceStudios.forEach((studio, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = studio.name;
    els.studioSelect.append(option);
  });
}

function displayDate(baseDate) {
  const date = new Date(`${baseDate}T12:00:00`);
  date.setDate(date.getDate() + state.weekOffset * 7);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function lessonDisplayDate(lesson) {
  const weekday = weekdays.find((item) => item.day === lesson.weekday);
  return weekday ? displayDate(weekday.baseDate) : lesson.date;
}

function renderAgeOptions() {
  els.ageOptions.innerHTML = "";
  ageOptionsByMode[state.mode].forEach((age) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `age-chip${state.age === age ? " active" : ""}`;
    button.textContent = age;
    button.dataset.age = age;
    button.setAttribute("aria-pressed", state.age === age ? "true" : "false");
    els.ageOptions.append(button);
  });
}

function filteredLessons() {
  const search = els.searchInput.value.trim().toLowerCase();
  return lessons.filter((lesson) => {
    const matchesMode = state.mode === "all" || lesson.mode === state.mode;
    const matchesAge = state.age === "Any age" || lesson.ages.includes(state.age);
    const matchesType = els.danceType.value === "all" || lesson.type === els.danceType.value;
    const query = zipQuery();
    const matchesZip = !query || (query.length === 5 ? lesson.zip === query : lesson.zip.startsWith(query));
    const searchable = `${lesson.title} ${lesson.type} ${lesson.studio} ${lesson.city} ${lesson.zip} ${lesson.locationName}`.toLowerCase();
    const matchesSearch = !search || searchable.includes(search);
    return matchesMode && matchesAge && matchesType && matchesZip && matchesSearch;
  });
}

function renderCalendar(items) {
  els.calendarGrid.innerHTML = "";
  weekdays.forEach(({ day, baseDate }) => {
    const column = document.createElement("div");
    column.className = "day-column";
    column.innerHTML = `
      <div class="day-title">
        <strong>${day}</strong>
        <span>${displayDate(baseDate)}</span>
      </div>
    `;

    const dayLessons = items.filter((lesson) => lesson.weekday === day);
    if (!dayLessons.length) {
      const empty = document.createElement("div");
      empty.className = "empty-day";
      empty.textContent = "No matching times";
      column.append(empty);
    }

    dayLessons.forEach((lesson) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `slot-button${state.selectedLesson?.id === lesson.id ? " active" : ""}`;
      button.dataset.lessonId = lesson.id;
      button.innerHTML = `
        <strong>${lesson.time}</strong>
        <span>${lesson.title}</span>
        <span>${lesson.studio}</span>
        <span>${lesson.city}, ${lesson.zip}</span>
      `;
      column.append(button);
    });

    els.calendarGrid.append(column);
  });
}

function renderLessons(items) {
  els.lessonList.innerHTML = "";

  if (!items.length) {
    els.lessonList.innerHTML = '<div class="empty-day">No lessons match these choices yet.</div>';
    return;
  }

  items.forEach((lesson) => {
    const card = document.createElement("article");
    card.className = "lesson-card";
    card.innerHTML = `
      <div class="lesson-meta">
        <span class="pill ${lesson.mode}">${formatMode(lesson.mode)}</span>
        <span class="pill">${lesson.type}</span>
      </div>
      <h3>${lesson.title}</h3>
      <p>${lesson.studio} in ${lesson.city}, ${lesson.zip}</p>
      <p>${lesson.locationName}: ${lesson.address}</p>
      <p>${formatSchedule(lesson)}. Ages ${formatAges(lesson.ages)}. ${lesson.frequency} schedule.</p>
      <button type="button" data-lesson-id="${lesson.id}">Choose</button>
    `;
    els.lessonList.append(card);
  });
}

function renderQuestion() {
  els.questionAnswer.textContent = questions[els.questionSelect.value];
}

function setSelectedLesson(id) {
  state.selectedLesson = lessons.find((lesson) => lesson.id === id) || null;
  if (!state.selectedLesson) return;

  const lesson = state.selectedLesson;
  els.selectedClass.classList.add("ready");
  els.selectedClass.innerHTML = `
    <strong>${lesson.title}</strong><br>
    ${lesson.studio}, ${lesson.city} ${lesson.zip}<br>
    ${formatSelectedSchedule(lesson)}
  `;
  els.summaryStudio.textContent = lesson.studio;
  const studioIndex = danceStudios.findIndex((studio) => studio.name === lesson.studio);
  if (studioIndex >= 0) {
    els.studioSelect.value = String(studioIndex);
  }
  els.formStatus.textContent = "";
  renderAll();
}

function updateMode(mode) {
  state.mode = mode;
  state.age = "Any age";
  clearSelectedLesson();
  document.querySelectorAll(".mode-tab").forEach((tab) => {
    const isActive = tab.dataset.mode === mode;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  renderAll();
}

function renderSummary(items) {
  els.summaryMode.textContent = state.mode === "all" ? "All" : formatMode(state.mode);
  els.summaryAge.textContent = state.age;
  if (!state.selectedLesson) {
    els.summaryStudio.textContent = items.length ? "Choose a class" : "No matches";
  }
  els.resultCount.textContent = `${items.length} option${items.length === 1 ? "" : "s"}`;
  els.calendarHint.textContent =
    state.weekOffset === 0
      ? "Pick a class time to start a booking."
      : `Showing the week of ${displayDate(weekdays[0].baseDate)}. Pick a class time to start a booking.`;
  els.previousWeekButton.disabled = state.weekOffset === 0;
}

function renderAll() {
  renderAgeOptions();
  renderQuestion();
  renderZipSuggestions();
  const items = filteredLessons();
  renderSummary(items);
  renderCalendar(items);
  renderLessons(items);
}

document.querySelectorAll(".mode-tab").forEach((tab) => {
  tab.addEventListener("click", () => updateMode(tab.dataset.mode));
});

els.ageOptions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-age]");
  if (!button) return;
  state.age = button.dataset.age;
  clearSelectedLesson();
  renderAll();
});

[els.danceType, els.questionSelect].forEach((control) => {
  control.addEventListener("change", () => {
    clearSelectedLesson();
    renderAll();
  });
});

els.zipCode.addEventListener("input", () => {
  els.zipCode.value = els.zipCode.value.replace(/\D/g, "");
  clearSelectedLesson();
  renderAll();
});

els.zipCode.addEventListener("focus", () => {
  renderZipSuggestions();
});

els.zipCode.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowDown") return;
  const firstSuggestion = els.zipSuggestionList.querySelector(".zip-suggestion");
  if (firstSuggestion) {
    event.preventDefault();
    firstSuggestion.focus();
  }
});

els.zipSuggestionList.addEventListener("click", (event) => {
  const option = event.target.closest("[data-zip]");
  if (!option) return;
  els.zipCode.value = option.dataset.zip;
  clearSelectedLesson();
  setZipSuggestionsOpen(false);
  renderAll();
});

els.zipSuggestionList.addEventListener("keydown", (event) => {
  const suggestions = [...els.zipSuggestionList.querySelectorAll(".zip-suggestion")];
  const index = suggestions.indexOf(document.activeElement);
  if (event.key === "Escape") {
    setZipSuggestionsOpen(false);
    els.zipCode.focus();
  }
  if (event.key === "ArrowDown" && suggestions[index + 1]) {
    event.preventDefault();
    suggestions[index + 1].focus();
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (suggestions[index - 1]) {
      suggestions[index - 1].focus();
    } else {
      els.zipCode.focus();
    }
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".zip-combobox")) {
    setZipSuggestionsOpen(false);
  }
});

els.searchInput.addEventListener("input", () => {
  clearSelectedLesson();
  renderAll();
});

els.nextWeekButton.addEventListener("click", () => {
  state.weekOffset += 1;
  clearSelectedLesson();
  renderAll();
});

els.previousWeekButton.addEventListener("click", () => {
  if (state.weekOffset === 0) return;
  state.weekOffset -= 1;
  clearSelectedLesson();
  renderAll();
});

els.calendarGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-lesson-id]");
  if (button) setSelectedLesson(button.dataset.lessonId);
});

els.lessonList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-lesson-id]");
  if (button) setSelectedLesson(button.dataset.lessonId);
});

function setFormStatus(message, type = "") {
  els.formStatus.textContent = message;
  els.formStatus.className = `form-status${type ? ` ${type}` : ""}`;
}

function selectedStudio() {
  if (els.studioSelect.value === "") return null;
  return danceStudios[Number(els.studioSelect.value)] || null;
}

function emailSelectedClass() {
  if (!state.selectedLesson) return "No class selected";
  return `${state.selectedLesson.title} - ${formatSelectedSchedule(state.selectedLesson)}`;
}

async function sendContactEmail() {
  const studio = selectedStudio();
  if (!studio) {
    setFormStatus("Please choose a dance studio.", "error");
    return;
  }

  if (!window.emailjs) {
    setFormStatus("Email service is still loading. Please try again in a moment.", "error");
    return;
  }

  const formData = new FormData(els.contactForm);
  const templateParams = {
    to_name: studio.name,
    to_email: studio.email,
    studio_name: studio.name,
    studio_email: studio.email,
    from_name: formData.get("name"),
    from_email: formData.get("email"),
    reply_to: formData.get("email"),
    message: formData.get("message"),
    selected_class: emailSelectedClass(),
  };

  els.submitContactButton.disabled = true;
  els.submitContactButton.textContent = "Sending...";
  setFormStatus("");

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    setFormStatus(`Thanks, ${templateParams.from_name}. Your message was sent to ${studio.name}.`, "success");
    els.contactForm.reset();
    clearSelectedLesson();
    renderAll();
  } catch (error) {
    console.error(error);
    setFormStatus("Something went wrong and the message was not sent. Please try again.", "error");
  } finally {
    els.submitContactButton.disabled = false;
    els.submitContactButton.textContent = "Send Message";
  }
}

els.contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendContactEmail();
});

els.studioSelect.addEventListener("change", () => {
  setFormStatus("");
});

populateStudioSelect();
if (window.emailjs) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

async function loadLessons() {
  try {
    const response = await fetch("dance-classes.json");
    if (!response.ok) throw new Error(`Unable to load dance-classes.json (${response.status})`);
    const data = await response.json();
    lessons = data.filter(isCompleteClass).map(normalizeLesson);
    populateTopFilters();
    renderAll();
  } catch (error) {
    els.calendarGrid.innerHTML = '<div class="empty-day">Class data could not be loaded. Run this site through a local server.</div>';
    els.lessonList.innerHTML = '<div class="empty-day">Class data could not be loaded. Run this site through a local server.</div>';
    els.resultCount.textContent = "0 options";
    console.error(error);
  }
}

loadLessons();
