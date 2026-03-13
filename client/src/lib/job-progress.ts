import type { Job, CatalogItem } from "@shared/schema";

const ROOM_GENERAL_TASKS = [
  "Kabllot e ndertuara",
  "Gypat e vendosura",
  "Shtekat e hapura",
];

export function calculateJobProgress(job: Job, catalogItems?: CatalogItem[]): {
  overallPercent: number;
  completedRooms: number;
  totalRooms: number;
  totalTasks: number;
  totalDone: number;
} {
  const t1 = (job.table1Data || {}) as Record<string, Record<string, number>>;
  const rpd = (job.roomProgressData || {}) as Record<string, Record<string, boolean>>;

  const pajisjeItems = catalogItems
    ? catalogItems.filter(c => c.category === "Pajisje elektrike")
    : Object.keys(t1).map(name => ({ name }));

  const allRoomNames = new Set<string>();
  for (const rooms of Object.values(t1)) {
    for (const room of Object.keys(rooms)) {
      if ((rooms as Record<string, number>)[room] > 0) {
        allRoomNames.add(room);
      }
    }
  }

  const roomsWithWork = Array.from(allRoomNames);

  if (roomsWithWork.length === 0) {
    return { overallPercent: 0, completedRooms: 0, totalRooms: 0, totalTasks: 0, totalDone: 0 };
  }

  let totalTasks = 0;
  let totalDone = 0;

  const completedRoomsList: string[] = [];

  for (const room of roomsWithWork) {
    let roomTasks = 0;
    let roomDone = 0;

    for (const item of pajisjeItems) {
      const qty = t1[item.name]?.[room] || 0;
      if (qty > 0) {
        roomTasks++;
        if (rpd[room]?.[item.name]) roomDone++;
      }
    }

    for (const task of ROOM_GENERAL_TASKS) {
      roomTasks++;
      if (rpd[room]?.[task]) roomDone++;
    }

    totalTasks += roomTasks;
    totalDone += roomDone;

    if (roomTasks > 0 && roomDone === roomTasks) {
      completedRoomsList.push(room);
    }
  }

  const overallPercent = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  return {
    overallPercent,
    completedRooms: completedRoomsList.length,
    totalRooms: roomsWithWork.length,
    totalTasks,
    totalDone,
  };
}

const TOOLS_BY_MATERIAL_KEYWORD: Record<string, string[]> = {
  "priz": ["Shafciger (kaçavida)", "Dana / Trapan", "Nivel", "Metro", "Hilti (nese mur betoni)"],
  "çeles": ["Shafciger (kaçavida)", "Dana / Trapan", "Nivel", "Metro", "Hilti (nese mur betoni)"],
  "ndricues": ["Shafciger (kaçavida)", "Dana / Trapan", "Shkalle", "Tester tensioni"],
  "llamp": ["Shafciger (kaçavida)", "Dana / Trapan", "Shkalle", "Tester tensioni"],
  "spot": ["Shafciger (kaçavida)", "Dana / Trapan", "Shkalle", "Sharre per gips", "Tester tensioni"],
  "led": ["Shafciger (kaçavida)", "Dana / Trapan", "Shkalle"],
  "ventilator": ["Shafciger (kaçavida)", "Dana / Trapan", "Shkalle"],
  "tablo": ["Shafciger (kaçavida)", "Qekiq", "Tester tensioni", "Shirit izolues", "Multimeter"],
  "sigures": ["Shafciger (kaçavida)", "Qekiq", "Tester tensioni", "Multimeter"],
  "kontaktor": ["Shafciger (kaçavida)", "Qekiq", "Tester tensioni", "Multimeter"],
  "rele": ["Shafciger (kaçavida)", "Qekiq", "Tester tensioni", "Multimeter"],
  "kabllo": ["Qekiq", "Prerese kabllosh", "Shirit izolues", "Metro", "Dana / Trapan", "Hilti (nese mur betoni)"],
  "kabell": ["Qekiq", "Prerese kabllosh", "Shirit izolues", "Metro", "Dana / Trapan"],
  "gyp": ["Dana / Trapan", "Hilti (nese mur betoni)", "Sharre", "Metro", "Nivel"],
  "kanal": ["Dana / Trapan", "Hilti (nese mur betoni)", "Metro", "Nivel", "Sharre"],
  "tub": ["Dana / Trapan", "Hilti (nese mur betoni)", "Metro", "Sharre"],
  "kamera": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shkalle", "Shafciger (kaçavida)", "Laptop (per konfigurim)"],
  "dvr": ["Shafciger (kaçavida)", "Qekiq", "Prerese kabllosh", "Laptop (per konfigurim)", "Monitor"],
  "nvr": ["Shafciger (kaçavida)", "Qekiq", "Prerese kabllosh", "Laptop (per konfigurim)", "Monitor"],
  "switch": ["Shafciger (kaçavida)", "Qekiq", "Prerese kabllosh", "Laptop (per konfigurim)"],
  "alarm": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shafciger (kaçavida)", "Shkalle", "Laptop (per konfigurim)"],
  "sensor": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shafciger (kaçavida)", "Shkalle"],
  "siren": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shafciger (kaçavida)", "Shkalle"],
  "interfon": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shafciger (kaçavida)", "Shkalle", "Metro"],
  "panel": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shafciger (kaçavida)", "Nivel"],
  "monitor": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shafciger (kaçavida)", "Nivel", "Shkalle"],
  "brav": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shafciger (kaçavida)"],
  "ups": ["Shafciger (kaçavida)", "Qekiq", "Tester tensioni"],
  "stabilizator": ["Shafciger (kaçavida)", "Qekiq", "Tester tensioni"],
  "generator": ["Shafciger (kaçavida)", "Qekiq", "Tester tensioni", "Cel angleze"],
};

const TOOLS_BY_CATEGORY: Record<string, string[]> = {
  "Pajisje elektrike": ["Shafciger (kaçavida)", "Dana / Trapan", "Qekiq", "Tester tensioni", "Nivel", "Metro"],
  "Kabllo & Gypa": ["Qekiq", "Prerese kabllosh", "Dana / Trapan", "Shirit izolues", "Metro"],
  "Kamera": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shkalle", "Shafciger (kaçavida)", "Laptop (per konfigurim)"],
  "Interfon": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shkalle", "Shafciger (kaçavida)", "Metro"],
  "Alarm": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shafciger (kaçavida)", "Shkalle", "Laptop (per konfigurim)"],
  "Punë/Shërbime": [],
};

function normalizeName(s: string): string {
  return s.toLowerCase()
    .replace(/ë/g, "e").replace(/ç/g, "c").replace(/é/g, "e")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/â/g, "a");
}

export function getRequiredToolsForJob(job: Job): string[] {
  const toolSet = new Set<string>();
  const allData = [
    job.table1Data || {},
    job.table2Data || {},
    job.cameraData || {},
    job.intercomData || {},
    job.alarmData || {},
    job.serviceData || {},
  ];

  const materialNames: { name: string; category?: string }[] = [];

  for (const data of allData) {
    for (const itemName of Object.keys(data as Record<string, unknown>)) {
      materialNames.push({ name: itemName });
    }
  }

  materialNames.forEach(item => {
    const nameNorm = normalizeName(item.name);
    for (const [keyword, tools] of Object.entries(TOOLS_BY_MATERIAL_KEYWORD)) {
      if (nameNorm.includes(normalizeName(keyword))) {
        tools.forEach(t => toolSet.add(t));
      }
    }
  });

  switch (job.category) {
    case "electric":
      (TOOLS_BY_CATEGORY["Pajisje elektrike"] || []).forEach(t => toolSet.add(t));
      (TOOLS_BY_CATEGORY["Kabllo & Gypa"] || []).forEach(t => toolSet.add(t));
      break;
    case "camera":
      (TOOLS_BY_CATEGORY["Kamera"] || []).forEach(t => toolSet.add(t));
      break;
    case "alarm":
      (TOOLS_BY_CATEGORY["Alarm"] || []).forEach(t => toolSet.add(t));
      break;
    case "intercom":
      (TOOLS_BY_CATEGORY["Interfon"] || []).forEach(t => toolSet.add(t));
      break;
  }

  if (toolSet.size === 0 && materialNames.length > 0) {
    ["Shafciger (kaçavida)", "Dana / Trapan", "Qekiq", "Metro"].forEach(t => toolSet.add(t));
  }

  return Array.from(toolSet).sort();
}
