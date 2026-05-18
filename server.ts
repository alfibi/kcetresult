import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

interface SubjectResult {
  code: string;
  name: string;
  internal: number;
  external: number;
  total: number;
  status: "Pass" | "Fail" | "Absent";
}

interface StudentResult {
  rollNo: string;
  regNo: string;
  name: string;
  parentage: string;
  session: string;
  course: string;
  branch: string;
  semester: string;
  college: string;
  subjects: SubjectResult[];
  grandTotal: number;
  resultStatus: string;
}

const generateMockData = (): StudentResult[] => {
  const results: StudentResult[] = [];
  const subjects = [
    { code: "MTH-301", name: "Discrete Mathematics" },
    { code: "ECE-302", name: "Digital Electronics" },
    { code: "ECE-303", name: "Digital Electronics Lab" },
    { code: "CSE-304", name: "Database Management Systems (DBMS)" },
    { code: "CSE-305", name: "Database Management Systems (DBMS) Lab" },
    { code: "CSE-306", name: "Object Oriented Programming using C++" },
    { code: "CSE-307", name: "Object Oriented Programming using C++ Lab" },
    { code: "CSE-308", name: "Introduction to Artificial Intelligence" },
  ];

  const studentNames = [
    "MOHAMMAD UZAIR",
    "HASSAAN BIN MAJEED",
    "WAMIQ ABBAS",
    "SYED SABA HAROON ANDRABI",
    "TAHIR BASHIR KHAN",
    "SHAFI NABI RASOOL",
    "MUZAMIL YOUSUF SHEIKH",
    "MUTASIM QURESHI",
    "PEERZADA SHAH FAHAD",
    "CHERANJEEV MUJOO",
    "AJAY KUMAR",
    "KASHIF NISAR",
    "SEERET FATIMA",
    "SAALIF HAMID DARIAL",
    "QADRI IBRAHIM SHAH",
    "RUWAIF AJAZ WANI",
    "MONIS RASHID",
    "IMTIYAZ GUL",
    "MOHAMMAD TIHAME",
    "TOWSEEF AHMAD MALIK",
    "SADIYA MANZOOR",
    "ANDLEEBA MAQBOOL",
    "SHUJAT JAVAID",
    "PEER IDREES ANAYAT",
    "FARAH FIRDOUS NAIK",
    "IMRAN MUSHTAQ",
    "ALI RAZA KHAN",
    "FASIL AMIN",
    "IKHLAQ AHMAD BHAT",
    "AARIBA TAHIR",
    "SYED ASGAR RIZVI",
    "MOHAMMAD ZAYEEM KHAN",
  ];

  const firstNames = ["Aamir", "Zoya", "Ishfaq", "Saba", "Faisal", "Mehak", "Sajid", "Iqra", "Omar", "Aasifa"];
  const lastNames = ["Khan", "Malik", "Dar", "Rather", "Sheikh", "Bhat", "Wani", "Shah", "Lone", "Mir"];

  for (let i = 1; i <= 32; i++) {
    const rollNo = `241681460${i < 10 ? '0' + i : i}`;
    const name = studentNames[i - 1];
    const parentage = `${firstNames[Math.floor(Math.random() * 10)]} ${lastNames[Math.floor(Math.random() * 10)]}`;
    
    const studentSubjects: SubjectResult[] = subjects.map((s, index) => {
      let internal = Math.floor(Math.random() * 11) + 18; // 18-28
      let external = Math.floor(Math.random() * 41) + 20; // 20-60
      
      // Force fail for roll no 24168146023 on first two subjects
      if (rollNo === "24168146023" && index < 2) {
        external = Math.floor(Math.random() * 10) + 10; // 10-19, definite fail
      } else if (rollNo === "24168146023") {
        // Ensure others pass to strictly have "a subject or two failed"
        external = Math.floor(Math.random() * 21) + 40; // 40-60
      }

      const total = internal + external;
      return {
        ...s,
        internal,
        external,
        total,
        status: (total >= 40 && external >= 28 ? "Pass" : "Fail") as "Pass" | "Fail" | "Absent"
      };
    });

    const grandTotal = studentSubjects.reduce((acc, s) => acc + s.total, 0);
    const failedSubjects = studentSubjects.filter(s => s.status === "Fail");
    const resultStatus = failedSubjects.length === 0 ? "Qualified" : `Re-appear in ${failedSubjects.map(s => s.code).join(", ")}`;

    results.push({
      rollNo,
      regNo: `2024-BTECH-${1000 + i}`,
      name,
      parentage,
      session: "Autumn 2024",
      course: "B.Tech",
      branch: "Computer Science & Engineering",
      semester: "3rd Semester",
      college: "Kashmir College of Engineering & Technology",
      subjects: studentSubjects,
      grandTotal,
      resultStatus
    });
  }
  return results;
};

const mockResults = generateMockData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to fetch result
  app.get("/api/results", (req, res) => {
    const { rollNo, session } = req.query;
    
    if (!rollNo) {
      return res.status(400).json({ error: "Roll number is required" });
    }

    const result = mockResults.find(r => r.rollNo === rollNo && (!session || r.session === session));
    
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "Result not found for the provided details" });
    }
  });

  // API Route to fetch college results
  app.get("/api/college-results", (req, res) => {
    const { college, session } = req.query;
    
    if (!college) {
      return res.status(400).json({ error: "College is required" });
    }

    const results = mockResults.filter(r => r.college === college && (!session || r.session === session));
    
    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).json({ error: "No results found for the provided college" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
