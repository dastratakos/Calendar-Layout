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
      "Starlight Sanctuary",
    ];

    this.titles = [
      "Annual Intergalactic Tea Party and Time Travel Symposium",
      "Quantum Computing Workshop: From Theory to Practice",
      "The Great Dragon's Annual Fire Safety Training",
      "Mystic Arts and Advanced Spellcasting Techniques",
      "Underwater City Maintenance and Mermaid Meetup",
      "Space Station Orientation for New Interstellar Travelers",
      "Crystal Formation and Magical Properties Seminar",
      "Time Portal Safety and Maintenance Certification",
      "Advanced Potion Making and Experimental Brewing",
      "Celestial Navigation and Star Chart Reading",
      "Dragon Training and Care Workshop",
      "Magical Creature Handling and Care Certification",
      "Advanced Spell Weaving and Enchantment Techniques",
      "Interdimensional Communication Protocol Training",
      "Magical Artifact Authentication and Preservation",
      "Cosmic Energy Manipulation and Control",
      "Advanced Time Travel Ethics and Best Practices",
      "Magical Plant Care and Herbology Workshop",
      "Interstellar Diplomacy and Protocol Training",
      "Advanced Magical Theory and Practical Applications",
      "Crystal Energy Channeling and Meditation",
      "Magical Transportation Safety and Regulations",
      "Advanced Spell Components and Material Sourcing",
      "Interdimensional Portal Maintenance and Repair",
      "Magical Creature Breeding and Conservation",
      "Advanced Potion Ingredient Harvesting",
      "Magical Architecture and Structural Integrity",
      "Time Stream Navigation and Safety Protocols",
      "Magical Artifact Restoration and Preservation",
      "Advanced Spell Defense and Countermeasures",
    ];
  }

  generateEvent(date = this.baseDate) {
    const startHour = Math.floor(Math.random() * 24);
    const startMinute = Math.floor(Math.random() * 60);
    const startDate = new Date(date);
    startDate.setHours(startHour, startMinute, 0, 0);

    // Generate random duration between 15 and 120 minutes
    const duration = 15 + Math.floor(Math.random() * 115);
    const endDate = new Date(startDate.getTime() + duration * 60000);

    return {
      title: this.titles[Math.floor(Math.random() * this.titles.length)],
      location:
        this.locations[Math.floor(Math.random() * this.locations.length)],
      start: startDate,
      end: endDate,
      color: `var(--color-${Math.floor(Math.random() * 10) + 1})`,
    };
  }

  generateDayEvents(date = this.baseDate, count = 50) {
    return Array.from({ length: count }, () => this.generateEvent(date))
      .sort((a, b) => {
        if (a.start.getTime() !== b.start.getTime()) {
          return a.start.getTime() - b.start.getTime();
        }
        return b.end.getTime() - a.end.getTime();
      })
      .map((event, idx) => ({ ...event, id: idx + 1 }));
  }

  generateWeekEvents(startDate = this.baseDate, eventsPerDay = 20) {
    // TODO: const for 7 days
    return Array.from({ length: 7 }, (_, day) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);
      return this.generateDayEvents(currentDate, eventsPerDay);
    })
      .flat()
      .sort((a, b) => {
        if (a.start.getTime() !== b.start.getTime()) {
          return a.start.getTime() - b.start.getTime();
        }
        return b.end.getTime() - a.end.getTime();
      })
      .map((event, idx) => ({ ...event, id: idx + 1 }));
  }
};
