window.EventGenerator = class EventGenerator {
  constructor() {
    this.baseDate = new Date(2025, 4, 31); // May 31, 2025
    this.locations = [
      "Secret Garden",
      "Cloud Chamber",
      "Time Machine",
      "Quantum Lab",
      "Crystal Cave",
      "Floating Library",
      "Observatory",
      "Butterfly Room",
      "Star Chamber",
      "Rainbow Bridge",
      "Moon Base",
      "Treehouse",
      "Ice Palace",
      "Dragon's Den",
      "Enchanted Forest",
      "Space Station",
      "Underwater City",
      "Sky Garden",
      "Time Portal",
      "Magic Workshop",
      "Crystal Spire",
      "Mystic Grove",
      "Cosmic Cafe",
      "Dream Chamber",
      "Aurora Hall",
      "Nebula Lounge",
      "Phoenix Nest",
      "Starlight Studio",
      "Whisper Woods",
      "Mystic Falls",
      "Celestial Court",
      "Dragon's Peak",
      "Frost Garden",
      "Mystic Mesa",
      "Starlight Sanctuary"
    ];
  }

  generateEvents(count = 50) {
    return Array.from({ length: count }, (_, i) => {
      // Generate random start time between 8am and 8pm
      const startHour = Math.floor(Math.random() * 24);
      const startMinute = Math.floor(Math.random() * 60);
      const startDate = new Date(this.baseDate);
      startDate.setHours(startHour, startMinute, 0, 0);

      // Generate random duration between 15 and 120 minutes
      const duration = 15 + Math.floor(Math.random() * 115);
      const endDate = new Date(startDate.getTime() + duration * 60000);

      return {
        id: 0,
        title: "X",
        location: this.locations[Math.floor(Math.random() * this.locations.length)],
        start: startDate,
        end: endDate,
      };
    })
      .sort((a, b) => {
        if (a.start.getTime() !== b.start.getTime()) {
          return a.start.getTime() - b.start.getTime();
        }
        return b.end.getTime() - a.end.getTime();
      })
      .map((event, idx) => {
        event.id = idx + 1;
        event.title = `Event ${idx + 1}`;
        return event;
      });
  }
};
