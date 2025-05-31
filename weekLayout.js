window.WeekLayout = class WeekLayout {
  constructor(config = {}) {
    this.WEEK_WIDTH = config.weekWidth || 600;
    this.DAY_WIDTH = config.dayWidth || this.WEEK_WIDTH / 7;
    this.INDENT_WIDTH = config.indentWidth || 10;
    this.THRESHOLD_MINS = config.thresholdMins || 30;
    this.dayLayout = new DayLayout({
      dayWidth: this.DAY_WIDTH,
      indentWidth: this.INDENT_WIDTH,
      thresholdMins: this.THRESHOLD_MINS
    });
  }

  layoutEvents(events) {
    // Group events by day
    const eventsByDay = {};
    events.forEach(event => {
      const day = event.start.getDay();
      if (!eventsByDay[day]) {
        eventsByDay[day] = [];
      }
      eventsByDay[day].push(event);
    });

    for (const day in eventsByDay) {
      console.log(day, eventsByDay[day].length);
    }

    // Layout events for each day
    const layoutedEvents = [];
    Object.entries(eventsByDay).forEach(([day, dayEvents]) => {
      const dayLayoutedEvents = this.dayLayout.layoutEvents(dayEvents);
      // Adjust left position based on day
      dayLayoutedEvents.forEach(event => {
        event.left += day * this.DAY_WIDTH;
      });
      layoutedEvents.push(...dayLayoutedEvents);
    });

    return layoutedEvents;
  }
}; 