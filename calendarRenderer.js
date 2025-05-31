window.CalendarRenderer = class CalendarRenderer {
  constructor(config = {}) {
    this.container = document.getElementById(config.containerId || "calendar");
    this.timeLabelsContainer = document.getElementById(
      config.timeLabelsId || "time-labels"
    );
    this.dayLayout = new DayLayout(config);

    // Calendar dimensions
    this.calendarWidth = config.calendarWidth || 600;
    this.calendarHeight = config.calendarHeight || 1440; // 24 hours * 60 minutes
    this.timeLabelWidth = config.timeLabelWidth || 60;
    this.timeLabelOverlapThreshold = config.timeLabelOverlapThreshold || 12; // minutes

    // Apply dimensions
    this.container.style.width = `${this.calendarWidth}px`;
    this.container.style.height = `${this.calendarHeight}px`;
    this.timeLabelsContainer.style.width = `${this.timeLabelWidth}px`;
    this.timeLabelsContainer.style.height = `${this.calendarHeight}px`;
  }

  renderTimeLabels() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Add labels for each hour
    for (let hour = 0; hour < 24; hour++) {
      const minutes = hour * 60;
      // Skip if this hour's label would overlap with current time
      if (Math.abs(minutes - currentMinutes) < this.timeLabelOverlapThreshold) {
        continue;
      }

      const label = document.createElement("div");
      label.className = "time-label";
      label.style.top = `${minutes}px`;

      // Convert to 12-hour format
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12; // Convert 0 to 12
      label.innerText = `${displayHour}${period}`;

      this.timeLabelsContainer.appendChild(label);
    }

    // Add final 12AM label at the bottom if it won't overlap
    if (Math.abs(24 * 60 - currentMinutes) >= this.timeLabelOverlapThreshold) {
      const finalLabel = document.createElement("div");
      finalLabel.className = "time-label";
      finalLabel.style.top = `${24 * 60}px`;
      finalLabel.innerText = "12AM";
      this.timeLabelsContainer.appendChild(finalLabel);
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

    // Convert to 12-hour format
    const period = now.getHours() >= 12 ? "PM" : "AM";
    const displayHour = now.getHours() % 12 || 12;
    const displayMinutes = now.getMinutes().toString().padStart(2, "0");
    label.innerText = `${displayHour}:${displayMinutes}${period}`;

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

      const startTime = ev.start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endTime = ev.end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      let html = `<div class="event-title">${ev.title}</div>`;

      if (ev.height >= 40) {
        html += `<div class="event-location">${Icons.location} ${ev.location}</div>`;
      }

      if (ev.height >= 60) {
        html += `<div class="event-time">${Icons.clock} ${startTime} - ${endTime}</div>`;
      }

      div.innerHTML = html;
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
