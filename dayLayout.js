window.DayLayout = class DayLayout {
  constructor(config = {}) {
    this.DAY_WIDTH = config.totalWidth || 600;
    this.INDENT_WIDTH = config.indentWidth || 10;
    this.THRESHOLD_MINS = config.thresholdMins || 30;
  }

  eventsConflict(event1, event2) {
    return (
      Math.abs(event1.startOffset - event2.startOffset) < this.THRESHOLD_MINS
    );
  }

  distributeEvents(events) {
    let currRow = [];
    let prevRow = null;
    let rawLeftToEvent = {};

    for (const event of events) {
      if (
        currRow.length === 0 ||
        (this.eventsConflict(event, currRow[0]) &&
          currRow[0].endOffset >= event.startOffset)
      ) {
        currRow.push(event);
        continue;
      }

      this.distributeRow(currRow, prevRow, rawLeftToEvent);

      prevRow = currRow;
      currRow = [event];
    }

    // handle last row if it exists
    if (currRow.length > 0) {
      this.distributeRow(currRow, prevRow, rawLeftToEvent);
    }
  }

  distributeRow(currRow, prevRow, rawLeftToEvent) {
    if (!prevRow) {
      // for first row, distribute evenly
      const eventWidth = this.DAY_WIDTH / currRow.length;
      currRow.forEach((event, idx) => {
        event.rawLeft = idx * eventWidth;
        event.left = idx * eventWidth;
        event.rawWidth = eventWidth;
        event.width = eventWidth;
        rawLeftToEvent[Math.round(event.rawLeft)] = [event];
      });
      return;
    }

    let prevIdx = 0;
    let currIdx = 0;

    let currLeftStart = 0;
    let currIdxStart = currIdx;
    let availableWidth = 0;

    while (currIdx < currRow.length) {
      // advance prevIdx, keeping track of availableWidth
      while (
        prevIdx < prevRow.length &&
        (!this.eventsConflict(currRow[currIdx], prevRow[prevIdx]) ||
          prevRow[prevIdx].endOffset < currRow[currIdx].startOffset)
      ) {
        availableWidth += prevRow[prevIdx].rawWidth;
        prevIdx += 1;
      }
      if (prevIdx === prevRow.length) {
        // add remaining width to the right of prevRow[prevIdx]
        availableWidth +=
          this.DAY_WIDTH -
          (prevRow[prevIdx - 1].rawLeft + prevRow[prevIdx - 1].rawWidth);
        currIdx = currRow.length;
      } else {
        // advance currIdx
        while (
          currIdx < currRow.length &&
          this.eventsConflict(currRow[currIdx], prevRow[prevIdx])
        ) {
          currIdx += 1;
        }
      }

      // distribute events evenly
      const numEvents = currIdx - currIdxStart;
      const eventWidth = availableWidth / numEvents;

      for (let i = 0; i < numEvents; i++) {
        const event = currRow[currIdxStart + i];
        event.rawLeft = currLeftStart + i * eventWidth;
        event.rawWidth = eventWidth;
        event.left = currLeftStart + i * eventWidth;
        event.width = eventWidth;

        // apply indents
        const roundedLeft = Math.round(event.rawLeft);
        if (roundedLeft in rawLeftToEvent) {
          for (const e of rawLeftToEvent[roundedLeft]) {
            if (event.startOffset < e.endOffset) {
              event.left = e.left + this.INDENT_WIDTH;
            }
          }
          event.width -= event.left - event.rawLeft;
          rawLeftToEvent[roundedLeft].push(event);
        } else {
          rawLeftToEvent[roundedLeft] = [event];
        }
      }

      // reset for next iteration
      currLeftStart += availableWidth;
      currIdxStart = currIdx;
      availableWidth = 0;
    }
  }

  layoutEvents(events) {
    const convertedEvents = events.map((event) => ({
      ...event,
      startOffset: event.start.getHours() * 60 + event.start.getMinutes(),
      endOffset: event.end.getHours() * 60 + event.end.getMinutes(),
    }));

    // sort rows
    const sorted = convertedEvents.slice().sort((a, b) => {
      if (a.startOffset !== b.startOffset) return a.startOffset - b.startOffset;
      return b.endOffset - a.endOffset;
    });

    // add fields for computing geometry
    const calendarEvents = sorted.map((event) => ({
      ...event,
      top: event.startOffset,
      height: event.endOffset - event.startOffset,
      rawLeft: 0,
      left: 0,
      rawWidth: this.DAY_WIDTH,
      width: this.DAY_WIDTH,
    }));

    this.distributeEvents(calendarEvents);
    return calendarEvents;
  }
};
