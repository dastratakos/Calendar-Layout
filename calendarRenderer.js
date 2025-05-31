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
    // Convert Date objects to minute offsets for layout
    const eventsWithOffsets = events.map((event) => ({
      ...event,
      startOffset: event.start.getHours() * 60 + event.start.getMinutes(),
      endOffset: event.end.getHours() * 60 + event.end.getMinutes(),
    }));

    const layout = this.dayLayout.layoutEvents(eventsWithOffsets);

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

      div.innerHTML = `
        <div class="event-title">${ev.title}</div>
        <div class="event-location">${Icons.location} ${ev.location}</div>
        <div class="event-time">${Icons.clock} ${startTime} - ${endTime}</div>
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
