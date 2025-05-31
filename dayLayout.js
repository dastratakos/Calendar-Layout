window.DayLayout = class DayLayout {
  constructor(config = {}) {
    this.TOTAL_WIDTH = config.totalWidth || 600;
    this.INDENT_WIDTH = config.indentWidth || 10;
    this.THRESHOLD_MINS = config.thresholdMins || 30;
  }

  eventsConflict(event1, event2) {
    return (
      Math.abs(event1.startOffset - event2.startOffset) < this.THRESHOLD_MINS
    );
  }

  buildRows(events) {
    let rows = [];
    let currRow = [];
    for (const event of events) {
      if (currRow.length === 0) {
        currRow.push(event);
        continue;
      }

      if (
        this.eventsConflict(event, currRow[0]) &&
        currRow[0].endOffset >= event.startOffset
      ) {
        currRow.push(event);
        continue;
      }

      // start a new row
      rows.push(currRow);
      currRow = [event];
    }

    if (currRow.length > 0) {
      rows.push(currRow);
    }

    return rows;
  }

  distributeHorizontally(rows) {
    // first row: split events equally across total width
    if (rows.length > 0 && rows[0].length > 0) {
      const eventWidth = this.TOTAL_WIDTH / rows[0].length;
      rows[0].forEach((event, idx) => {
        event.leftWithoutIndents = idx * eventWidth;
        event.left = idx * eventWidth;
        event.width = eventWidth;
      });
    }

    for (let rowIdx = 1; rowIdx < rows.length; rowIdx++) {
      const prevRow = rows[rowIdx - 1];
      const currRow = rows[rowIdx];

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
          availableWidth += prevRow[prevIdx].width;
          prevIdx += 1;
        }
        if (prevIdx === prevRow.length) {
          // add remaining width to the right of prevRow[prevIdx]
          availableWidth +=
            this.TOTAL_WIDTH -
            (prevRow[prevIdx - 1].leftWithoutIndents +
              prevRow[prevIdx - 1].width);
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
        // update curr widths
        const numEvents = currIdx - currIdxStart;
        const eventWidth = availableWidth / numEvents;

        for (let i = 0; i < numEvents; i++) {
          currRow[currIdxStart + i].leftWithoutIndents =
            currLeftStart + i * eventWidth;
          currRow[currIdxStart + i].width = eventWidth;
        }

        // reset for next iteration
        currLeftStart += availableWidth;
        currIdxStart = currIdx;
        availableWidth = 0;
      }
    }
  }

  addIndents(rows) {
    let leftToEvent = {};
    for (const row of rows) {
      for (const event of row) {
        const roundedLeft = Math.round(event.leftWithoutIndents);
        event.left = event.leftWithoutIndents;
        if (!(roundedLeft in leftToEvent)) {
          leftToEvent[roundedLeft] = [event];
          continue;
        }

        for (const e of leftToEvent[roundedLeft]) {
          if (event.startOffset < e.endOffset) {
            event.left = e.left + this.INDENT_WIDTH;
          }
        }
        event.width -= event.left - event.leftWithoutIndents;
        leftToEvent[roundedLeft].push(event);
      }
    }
  }

  layoutEvents(events) {
    // sort rows
    const sorted = events.slice().sort((a, b) => {
      if (a.startOffset !== b.startOffset) return a.startOffset - b.startOffset;
      return b.endOffset - a.endOffset;
    });

    // add fields for computing geometry
    const calendarEvents = sorted.map((event) => ({
      ...event,
      top: event.startOffset,
      height: event.endOffset - event.startOffset,
      leftWithoutIndents: 0,
      left: 0,
      width: this.TOTAL_WIDTH,
    }));

    const rows = this.buildRows(calendarEvents);
    this.distributeHorizontally(rows);
    this.addIndents(rows);

    return calendarEvents;
  }
};
