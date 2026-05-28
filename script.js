const lessons = [
  {
    id: "odc-ballet-kids",
    title: "Ballet Foundations",
    type: "Ballet",
    mode: "public",
    ages: ["3-5", "6-8"],
    studio: "ODC Dance Commons",
    city: "San Francisco",
    zip: "94110",
    address: "Mission District",
    weekday: "Monday",
    date: "Jun 1",
    time: "4:00 PM",
    frequency: "Weekly",
    teacher: "Ms. Alvarez",
  },
  {
    id: "mission-hiphop-teen",
    title: "Hip-Hop Groove Lab",
    type: "Hip-Hop",
    mode: "public",
    ages: ["12-14", "15-17", "18+"],
    studio: "Dance Mission Theater",
    city: "San Francisco",
    zip: "94110",
    address: "24th Street",
    weekday: "Tuesday",
    date: "Jun 2",
    time: "6:30 PM",
    frequency: "Weekly",
    teacher: "Jordan Lee",
  },
  {
    id: "rae-jazz-adult",
    title: "Beginner Jazz",
    type: "Jazz",
    mode: "public",
    ages: ["18+"],
    studio: "Rae Studios",
    city: "San Francisco",
    zip: "94103",
    address: "Union Square",
    weekday: "Wednesday",
    date: "Jun 3",
    time: "7:15 PM",
    frequency: "Weekly",
    teacher: "Nina Park",
  },
  {
    id: "city-salsa-private",
    title: "Salsa Private Coaching",
    type: "Salsa",
    mode: "private",
    ages: ["15-17", "18+"],
    studio: "City Dance Studios",
    city: "San Francisco",
    zip: "94102",
    address: "Civic Center",
    weekday: "Thursday",
    date: "Jun 4",
    time: "5:30 PM",
    frequency: "Flexible",
    teacher: "Marco Rivera",
  },
  {
    id: "western-ballet-private",
    title: "Youth Ballet Private",
    type: "Ballet",
    mode: "private",
    ages: ["3-5", "6-8", "9-11", "12-14", "15-17"],
    studio: "Western Ballet",
    city: "Mountain View",
    zip: "94041",
    address: "Old Mountain View",
    weekday: "Friday",
    date: "Jun 5",
    time: "3:45 PM",
    frequency: "Flexible",
    teacher: "Elena Wright",
  },
  {
    id: "sj-ballroom-adult",
    title: "Ballroom Basics",
    type: "Ballroom",
    mode: "public",
    ages: ["18+"],
    studio: "Just Dance Ballroom",
    city: "Oakland",
    zip: "94612",
    address: "Downtown Oakland",
    weekday: "Monday",
    date: "Jun 1",
    time: "7:00 PM",
    frequency: "Weekly",
    teacher: "Sam Kim",
  },
  {
    id: "norcal-contemporary",
    title: "Contemporary Flow",
    type: "Contemporary",
    mode: "public",
    ages: ["12-14", "15-17", "18+"],
    studio: "Nor Cal Dance Arts",
    city: "San Jose",
    zip: "95128",
    address: "West San Jose",
    weekday: "Thursday",
    date: "Jun 4",
    time: "6:00 PM",
    frequency: "Weekly",
    teacher: "Ari Chen",
  },
  {
    id: "salsacrazy-adult-private",
    title: "Wedding Dance Prep",
    type: "Ballroom",
    mode: "private",
    ages: ["18+"],
    studio: "SalsaCrazy",
    city: "San Francisco",
    zip: "94103",
    address: "SoMa",
    weekday: "Wednesday",
    date: "Jun 3",
    time: "8:00 PM",
    frequency: "Flexible",
    teacher: "Dana Fields",
  },
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
];

const ageOptionsByMode = {
  public: ["Any age", "3-5", "6-8", "9-11", "12-14", "15-17", "18+"],
  private: ["Any age", "3-5", "6-8", "9-11", "12-14", "15-17", "18+"],
};

const state = {
  mode: "public",
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
  bookingForm: document.querySelector("#bookingForm"),
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
    const matchesMode = lesson.mode === state.mode;
    const matchesAge = state.age === "Any age" || lesson.ages.includes(state.age);
    const matchesType = els.danceType.value === "all" || lesson.type === els.danceType.value;
    const matchesZip = !zipQuery() || lesson.zip.startsWith(zipQuery());
    const searchable = `${lesson.title} ${lesson.type} ${lesson.studio} ${lesson.city} ${lesson.teacher}`.toLowerCase();
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
        <span class="pill ${lesson.mode}">${lesson.mode}</span>
        <span class="pill">${lesson.type}</span>
      </div>
      <h3>${lesson.title}</h3>
      <p>${lesson.studio} in ${lesson.city}, ${lesson.zip}</p>
      <p>${lesson.weekday} at ${lesson.time} with ${lesson.teacher}. ${lesson.frequency} schedule.</p>
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
    ${lesson.studio}, ${lesson.city}<br>
    ${lesson.weekday}, ${lessonDisplayDate(lesson)} at ${lesson.time}
  `;
  els.summaryStudio.textContent = lesson.studio;
  els.formStatus.textContent = "";
  renderAll();
}

function updateMode(mode) {
  state.mode = mode;
  state.age = "Any age";
  state.selectedLesson = null;
  document.querySelectorAll(".mode-tab").forEach((tab) => {
    const isActive = tab.dataset.mode === mode;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  els.selectedClass.classList.remove("ready");
  els.selectedClass.textContent = "Select a class from the calendar.";
  renderAll();
}

function renderSummary(items) {
  els.summaryMode.textContent = state.mode === "public" ? "Public" : "Private";
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
  state.selectedLesson = null;
  els.selectedClass.classList.remove("ready");
  els.selectedClass.textContent = "Select a class from the calendar.";
  renderAll();
});

[els.danceType, els.questionSelect].forEach((control) => {
  control.addEventListener("change", () => {
    state.selectedLesson = null;
    els.selectedClass.classList.remove("ready");
    els.selectedClass.textContent = "Select a class from the calendar.";
    renderAll();
  });
});

els.zipCode.addEventListener("input", () => {
  els.zipCode.value = els.zipCode.value.replace(/\D/g, "");
  state.selectedLesson = null;
  els.selectedClass.classList.remove("ready");
  els.selectedClass.textContent = "Select a class from the calendar.";
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
  state.selectedLesson = null;
  els.selectedClass.classList.remove("ready");
  els.selectedClass.textContent = "Select a class from the calendar.";
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
  state.selectedLesson = null;
  els.selectedClass.classList.remove("ready");
  els.selectedClass.textContent = "Select a class from the calendar.";
  renderAll();
});

els.nextWeekButton.addEventListener("click", () => {
  state.weekOffset += 1;
  state.selectedLesson = null;
  els.selectedClass.classList.remove("ready");
  els.selectedClass.textContent = "Select a class from the calendar.";
  renderAll();
});

els.previousWeekButton.addEventListener("click", () => {
  if (state.weekOffset === 0) return;
  state.weekOffset -= 1;
  state.selectedLesson = null;
  els.selectedClass.classList.remove("ready");
  els.selectedClass.textContent = "Select a class from the calendar.";
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

els.bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!state.selectedLesson) {
    els.formStatus.textContent = "Please choose a class time first.";
    return;
  }

  const formData = new FormData(els.bookingForm);
  const name = formData.get("fullName");
  els.formStatus.textContent = `Thanks, ${name}. Demo request saved for ${state.selectedLesson.studio}.`;
  els.bookingForm.reset();
});

populateTopFilters();
renderAll();
