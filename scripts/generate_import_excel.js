import * as XLSX from "xlsx";

// ESM import of xlsx start
import * as fs from "node:fs";
XLSX.set_fs(fs);
import { Readable } from "node:stream";
XLSX.stream.set_readable(Readable);
import * as cpexcel from "xlsx/dist/cpexcel.full.mjs";
XLSX.set_cptable(cpexcel);
// ESM import of xlsx end

import Chance from "chance";

const chance = new Chance();
const args = process.argv.slice(2);

let type = null;
let lang = null;
let count = null;

args.forEach((arg) => {
  if (arg.startsWith("--type=")) {
    type = arg.split("=")[1];
  } else if (arg.startsWith("--lang=")) {
    lang = arg.split("=")[1];
  } else if (arg.startsWith("--count=")) {
    count = parseInt(arg.split("=")[1], 10);
  }
});

if (!type || !["baby", "chw"].includes(type)) {
  console.error("Error: Invalid or missing type. Allowed values are 'baby' or 'chw'.");
  process.exit(1);
}

if (!lang || !["en", "ch"].includes(lang)) {
  console.error("Error: Invalid or missing lang. Allowed values are 'en' or 'ch'.");
  process.exit(1);
}

if (isNaN(count) || count <= 0) {
  console.error("Error: Invalid or missing count. It must be a positive number.");
  process.exit(1);
}

const options = [
  {
    title: "Name",
    description: "1. Required",
    value: () => chance.name(),
  },
  {
    title: "CHW ID",
    description: `1. Required
2. Validate: Do not repeat in the Excel and the Database`,
    value: () => chance.ssn({ dashes: false }),
  },
  {
    title: "Area",
    description: "1. Required",
    value: () => chance.address({ short_suffix: true }),
  },
  {
    title: "Phone",
    description: "1. Required",
    value: () => chance.phone({ formatted: false }),
  },
  {
    title: "Username",
    description: "1. Required",
    value: () => {
      const firstName = chance.first().toLowerCase();
      const lastName = chance.last().toLowerCase();
      return `${firstName}_${lastName}`;
    },
  },
  {
    title: "Password",
    description: "1. Required",
    value: () => chance.string({ length: 8, alpha: true, numeric: true }),
  },
];

const data = [];

const header = options.map((option) => option.title);
data.push(header);
data.push(options.map((option) => option.description));

for (let i = 0; i < count; i++) {
  const row = options.map((option) => option.value());
  data.push(row);
}

const ws = XLSX.utils.aoa_to_sheet(data);

const columnWidths = header.map((_, index) => {
  const maxLength = Math.max(...data.map((row) => row[index].toString().length));
  return { wch: maxLength + 2 };
});

ws["!cols"] = columnWidths;

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, `${type} Sheet`);

const outputFileName = `import_${type}_${lang}_${count}.xlsx`;

XLSX.writeFile(wb, outputFileName);
console.log(`Excel file generated: ${outputFileName}`);
