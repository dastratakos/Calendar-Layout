window.CalendarRenderer = class CalendarRenderer {
  constructor(config = {}) {
    this.container = document.getElementById(config.containerId || "calendar");
    this.timeLabelsContainer = document.getElementById(
      config.timeLabelsId || "time-labels"
    );
    this.dayLayout = new DayLayout(config);
  }

  renderTimeLabels() {
    for (let hour = 0; hour < 24; hour++) {
      const label = document.createElement("div");
      label.className = "time-label";
      label.style.top = `${hour * 60}px`;
      label.innerText = `${hour.toString().padStart(2, "0")}:00`;
      this.timeLabelsContainer.appendChild(label);
    }
  }

  renderHourLines() {
    for (let hour = 0; hour < 24; hour++) {
      const line = document.createElement("div");
      line.className = "hour-line";
      line.style.top = `${hour * 60}px`;
      this.container.appendChild(line);
    }
  }

  renderCurrentTimeLine() {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();

    const line = document.createElement("div");
    line.className = "current-time-line";
    line.style.top = `${minutes}px`;

    const label = document.createElement("div");
    label.className = "current-time-label";
    label.style.top = `${minutes}px`;
    label.innerText = now.toTimeString().substring(0, 5);

    this.container.appendChild(line);
    this.container.appendChild(label);
  }

  renderEvents(events) {
    const layout = this.dayLayout.layoutEvents(events);

    layout.forEach((ev) => {
      const div = document.createElement("div");
      div.className = "event";
      div.style.top = `${ev.top}px`;
      div.style.height = `${ev.height}px`;
      div.style.left = `${ev.left}px`;
      div.style.width = `${ev.width}px`;
      div.style.backgroundColor = this.getRandomColor();
      div.innerHTML = `
        <div class="event-title">${ev.title}</div>
        <div class="event-location">${ev.location}</div>
      `;
      this.container.appendChild(div);
    });
  }

  getRandomColor() {
    const colorNumber = Math.floor(Math.random() * 10) + 1;
    return `var(--color-${colorNumber})`;
  }

  clear() {
    this.container.innerHTML = "";
    this.timeLabelsContainer.innerHTML = "";
  }

  render(events) {
    this.clear();
    this.renderTimeLabels();
    this.renderHourLines();
    this.renderCurrentTimeLine();
    this.renderEvents(events);
  }
};
